import { Request, Response } from "express";
import { furnasPool } from "../../configs/db";
import { logger } from "../../configs/logger";

const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

// Mapeamento
const mapRowToCampanha = (row: any) => ({
    idcampanha: row.idcampanha,
    nrocampanha: row.nrocampanha,
    datainicio: row.datainicio,
    datafim: row.datafim,
    
    // Objeto Aninhado para a Instituição
    instituicao: row.idinstituicao
        ? {
            idinstituicao: row.idinstituicao,
            nome: row.instituicao_nome,
          }
        : undefined,
    
    // Objeto Aninhado para o Reservatório
    reservatorio: row.idreservatorio
        ? {
            idreservatorio: row.idreservatorio,
            nome: row.reservatorio_nome,
            lat: row.reservatorio_lat,
            lng: row.reservatorio_lng,
          }
        : undefined,
});

// getAll
export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        // Padronizando leitura de query params
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || PAGE_SIZE;
        const offset = (page - 1) * limit;

        const result = await furnasPool.query(
            `
            SELECT 
                a.idcampanha,
                a.nrocampanha,
                a.datainicio,
                a.datafim,
                b.idinstituicao,
                b.nome AS instituicao_nome,
                c.idreservatorio,
                c.nome AS reservatorio_nome,
                c.lat AS reservatorio_lat,
                c.lng AS reservatorio_lng
            FROM tbcampanha AS a
            LEFT JOIN tbinstituicao AS b 
                ON a.idinstituicao = b.idinstituicao
            LEFT JOIN tbreservatorio AS c 
                ON a.idreservatorio = c.idreservatorio
            ORDER BY c.nome, a.nrocampanha
            LIMIT $1 OFFSET $2
            `,
            [limit, offset],
        );

        const countResult = await furnasPool.query("SELECT COUNT(*) FROM tbcampanha");
        const total = Number(countResult.rows[0].count);

        // aplica o mapeamento
        const data = result.rows.map(mapRowToCampanha);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data,
        });
    } catch (error: any) {
        logger.error("Erro ao consultar tbcampanha", {
            message: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            success: false,
            error: "Erro ao realizar operação.", 
        });
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        // Padronizando a leitura e conversão do ID
        const idCampanha = Number(req.params.idcampanha);

        // Validação de ID
        if (isNaN(idCampanha)) {
            res.status(400).json({
                success: false,
                error: `ID ${req.params.idcampanha} inválido.`, 
            });
            return;
        }

        const result = await furnasPool.query(
            `
            SELECT 
                a.idcampanha,
                a.nrocampanha,
                a.datainicio,
                a.datafim,
                b.idinstituicao,
                b.nome AS instituicao_nome,
                c.idreservatorio,
                c.nome AS reservatorio_nome,
                c.lat AS reservatorio_lat,
                c.lng AS reservatorio_lng
            FROM tbcampanha AS a
            LEFT JOIN tbinstituicao AS b 
                ON a.idinstituicao = b.idinstituicao
            LEFT JOIN tbreservatorio AS c 
                ON a.idreservatorio = c.idreservatorio
            WHERE a.idcampanha = $1
            `,
            [idCampanha]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                error: `Registro de campanha não encontrado.`,
            });
            return;
        }

        // Mapeia o resultado único
        const data = mapRowToCampanha(result.rows[0]);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error: any) {
        logger.error(`Erro ao consultar tbcampanha por ID ${req.params.idcampanha}`, {
            message: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            success: false,
            error: "Erro ao realizar operação.",
        });
    }
};