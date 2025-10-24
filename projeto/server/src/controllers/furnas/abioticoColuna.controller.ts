import { Request, Response } from "express";
import { furnasPool } from "../../configs/db";
import { logger } from "../../configs/logger";
// 1. Importa os três serviços
import { DataFormatterService } from "../../services/dataFormatterService";
import { ExportService, ExportFileOptions } from "../../services/exportService";
import { FilterService } from "../../services/filterService";

const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

// 2. Define o mapeamento de filtros da URL para colunas do DB
// (Ex: ?idcampanha=10 se tornará WHERE a.idcampanha = $1)
const abioticoColumnMap = {
	idcampanha: 'a.idcampanha',
	idsitio: 'a.idsitio',
	// Adicione outros filtros de igualdade simples aqui
	// Ex: nrocampanha: 'b.nrocampanha'
};

// --- FUNÇÃO HELPER ---

/**
 * Constrói a query de listagem e contagem dinamicamente, aplicando filtros.
 * @param filters Um objeto (ex: req.query ou req.body.filters) com os filtros.
 */
const buildAbioticoQuery = (filters: any) => {
	// Query base para selecionar os dados
	const baseQuery = `
        SELECT 
            a.idabioticocoluna, a.datamedida, a.horamedida, a.profundidade,
            a.dic, a.nt, a.pt, a.delta13c, a.delta15n,
            b.idcampanha, b.nrocampanha,
            c.idsitio, c.nome AS sitio_nome, c.lat AS sitio_lat, c.lng AS sitio_lng
        FROM tbabioticocoluna AS a
        LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
        LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
    `;

	// Query base para contagem (para paginação)
	const countQuery = `
        SELECT COUNT(a.idabioticocoluna)
        FROM tbabioticocoluna AS a
        LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
        LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
    `;

	// --- LÓGICA DE FILTRO ---
	// 3. Usa o FilterService para construir a cláusula WHERE
	const { whereClause, params, nextIndex } = FilterService.buildFilter(
		filters,
		abioticoColumnMap,
		1, // Começa a contagem de parâmetros em $1
	);

	// Se você precisar de filtros mais complexos (datas, LIKE, etc.),
	// você pode adicionar a lógica aqui, usando o 'nextIndex' e 'params'.
	// Por enquanto, usamos apenas o retorno direto do FilterService.
	const whereString = whereClause;
	const values = params;
	const paramIndex = nextIndex; // O próximo índice livre (ex: $3)
	// --- FIM DA LÓGICA DE FILTRO ---

	// Query principal com ordenação
	const mainQuery = `${baseQuery} ${whereString} ORDER BY a.datamedida DESC, a.horamedida DESC`;
	// Query de contagem (sem ordenação)
	const countText = `${countQuery} ${whereString}`;

	return { mainQuery, countText, values, paramIndex };
};

// --- ENDPOINTS ---

/**
 * Endpoint: getAll
 * Retorna uma lista paginada de registros com filtros.
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || PAGE_SIZE;
		const offset = (page - 1) * limit;

		// 1. Constrói a query base (passando req.query para filtros)
		const { mainQuery, countText, values, paramIndex } = buildAbioticoQuery(
			req.query,
		);

		// 2. Adiciona paginação à query
		// O paramIndex nos diz onde começar (ex: $3)
		const paginatedQuery = `${mainQuery} LIMIT $${paramIndex} OFFSET $${paramIndex + 1
			}`;
		const paginatedValues = [...values, limit, offset];

		// 3. Executa a query de dados e a de contagem em paralelo
		const [result, countResult] = await Promise.all([
			furnasPool.query(paginatedQuery, paginatedValues),
			furnasPool.query(countText, values), // Contagem total com filtros
		]);

		const total = Number(countResult.rows[0].count);

		// 4. Formata os dados da página (formato de lista "achatado")
		const data = result.rows.map(DataFormatterService.formatListOutput);

		res.status(200).json({
			success: true,
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
			data,
		});
	} catch (error: any) {
		logger.error("Erro ao consultar tbabioticocoluna", {
			message: error.message,
			stack: error.stack,
		});

		res.status(500).json({
			success: false,
			error: "Erro ao realizar operação.",
		});
	}
};

/**
 * Endpoint: getById
 * Retorna um registro único com dados aninhados.
 */
export const getById = async (req: Request, res: Response): Promise<void> => {
	try {
		const idAbioticoColuna = Number(req.params.idabioticocoluna);

		if (isNaN(idAbioticoColuna)) {
			res.status(400).json({
				success: false,
				error: `ID ${req.params.idabioticocoluna} inválido.`,
			});
			return;
		}

		// Query de detalhe (não usa o helper, pois é específica)
		const result = await furnasPool.query(
			`
            SELECT 
                a.*,
                b.idcampanha,
                b.nrocampanha,
                b.datainicio AS campanha_datainicio,
                b.datafim AS campanha_datafim,
                b.idreservatorio,
                c.idsitio,
                c.nome AS sitio_nome,
                c.descricao AS sitio_descricao,
                c.lat AS sitio_lat,
                c.lng AS sitio_lng,
                d.nome AS reservatorio_nome
            FROM tbabioticocoluna AS a
            LEFT JOIN tbcampanha AS b
                ON a.idcampanha = b.idcampanha
            LEFT JOIN tbsitio AS c
                ON a.idsitio = c.idsitio
            LEFT JOIN tbreservatorio AS d
                ON b.idreservatorio = d.idreservatorio
            WHERE a.idabioticocoluna = $1
            `,
			[idAbioticoColuna],
		);

		if (result.rows.length === 0) {
			res.status(404).json({
				success: false,
				error: `Registro abiótico em coluna não encontrado.`,
			});
			return;
		}

		// Aplica a formatação de DETALHE (com objetos aninhados)
		const data = DataFormatterService.formatDetailOutput(result.rows[0]);

		res.status(200).json({
			success: true,
			data,
		});
	} catch (error: any) {
		logger.error(
			`Erro ao consultar tbabioticocoluna por ID ${req.params.idabioticocoluna}`,
			{
				message: error.message,
				stack: error.stack,
			},
		);

		res.status(500).json({
			success: false,
			error: "Erro ao realizar operação.",
		});
	}
};

/**
 * Endpoint: exportData
 * Gera e envia um arquivo (CSV ou XLSX) com base nos filtros e opções.
 */
export const exportData = async (req: Request, res: Response): Promise<void> => {
	try {
		// 1. Extrai opções do body (enviadas pelo modal)
		const {
			format,
			range,
			includeHeaders,
			delimiter,
			encoding,
			filters, // filtros do modal
			page, // página atual (para range='page')
			limit, // limite atual (para range='page')
		} = req.body as ExportFileOptions & {
			range: "page" | "all";
			filters: any; // Seus currentFilters
			page?: number;
			limit?: number;
		};

		// 2. Constrói a query base com os filtros
		const { mainQuery, values, paramIndex } = buildAbioticoQuery(filters || {});

		let queryText = mainQuery;
		let queryValues = [...values];

		// 3. Adiciona paginação se for 'page'
		if (range === "page") {
			const currentPage = page || 1;
			const currentLimit = limit || PAGE_SIZE;
			const offset = (currentPage - 1) * currentLimit;

			// Adiciona LIMIT e OFFSET aos parâmetros
			queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
			queryValues.push(currentLimit, offset);
		}
		// Se range === 'all', não adiciona LIMIT/OFFSET (busca tudo)

		// 4. Executa a query
		const result = await furnasPool.query(queryText, queryValues);

		// 5. Formata os dados para "lista" (achatado), que é o formato ideal para CSV/Excel
		const formattedData = result.rows.map(
			DataFormatterService.formatListOutput,
		);

		// 6. Gera o buffer do arquivo usando o ExportService
		const fileBuffer = await ExportService.generateExportFile(formattedData, {
			format,
			includeHeaders,
			delimiter,
			encoding,
		});

		// 7. Define os headers da resposta para forçar o download
		const fileName = `export_abiotico_coluna_${new Date()
			.toISOString()
			.slice(0, 10)}.${format}`;

		if (format === "xlsx") {
			res.setHeader(
				"Content-Type",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			);
		} else {
			// Define o charset para CSV, especialmente importante para iso-8859-1
			res.setHeader(
				"Content-Type",
				"text/csv; charset=" + (encoding || "utf-8"),
			);
		}
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${fileName}"`,
		);

		// 8. Envia o buffer como resposta
		res.send(fileBuffer);
	} catch (error: any) {
		logger.error("Erro ao exportar dados de tbabioticocoluna", {
			message: error.message,
			stack: error.stack,
		});
		// Retorna um JSON em caso de erro (não envia arquivo)
		res.status(500).json({
			success: false,
			error: "Erro ao gerar exportação.",
		});
	}
};
