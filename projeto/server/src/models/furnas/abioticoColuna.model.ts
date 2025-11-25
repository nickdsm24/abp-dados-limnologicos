// src/models/abioticoColuna.model.ts
import { furnasPool } from '../../configs/db';
import { FilterService } from '../../services/filterService';

// Mapeia as chaves do frontend (vistas pelo useMemo)
// para as colunas reais do banco de dados (com seus aliases).
const abioticoColumnMap = {
    // Chaves de Range (type: 'number' ou 'date' no frontend)
    idabioticocoluna: 'a.idabioticocoluna',
    datamedida: 'a.datamedida',
    profundidade: 'a.profundidade',
    dic: 'a.dic',
    nt: 'a.nt',
    pt: 'a.pt',
    delta13c: 'a.delta13c',
    delta15n: 'a.delta15n',

    // Chaves de Igualdade (type: 'string' no frontend)
    sitio: 'c.nome', // <-- Traduz 'sitio' para 'c.nome'
    campanha: 'b.nrocampanha', // <-- Traduz 'campanha' para 'b.nrocampanha'
    horamedida: 'a.horamedida', // <-- horamedida é tratada como string
};

/**
 * Constrói a query de listagem e contagem dinamicamente, aplicando filtros.
 * Esta função agora é privada e serve de base para os métodos públicos.
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

    // Usa o FilterService para construir a cláusula WHERE
    const { whereClause, params, nextIndex } = FilterService.buildFilter(
        filters,
        abioticoColumnMap,
        1, // Começa a contagem de parâmetros em $1
    );

    const whereString = whereClause;
    const values = params;
    const paramIndex = nextIndex;

    // Query principal com ordenação
    const mainQuery = `${baseQuery} ${whereString} ORDER BY a.datamedida DESC, a.horamedida DESC`;
    // Query de contagem (sem ordenação)
    const countText = `${countQuery} ${whereString}`;

    return { mainQuery, countText, values, paramIndex };
};

/**
 * Classe Model para encapsular o acesso a dados da tbabioticocoluna.
 * Todos os métodos são estáticos, agindo como um repositório.
 */
export class AbioticoColunaModel {
    /**
     * Busca uma lista paginada de registros, aplicando filtros.
     * Retorna tanto os dados da página quanto a contagem total de registros.
     */
    public static async findPaginated(options: {
        filters: any;
        page: number;
        limit: number;
    }) {
        const { filters, page, limit } = options;
        const offset = (page - 1) * limit;

        // 1. Constrói a query base com filtros
        const { mainQuery, countText, values, paramIndex } =
            buildAbioticoQuery(filters);

        // 2. Adiciona paginação à query
        const paginatedQuery = `${mainQuery} LIMIT $${paramIndex} OFFSET $${
            paramIndex + 1
        }`;
        const paginatedValues = [...values, limit, offset];

        // 3. Executa a query de dados e a de contagem em paralelo
        const [result, countResult] = await Promise.all([
            furnasPool.query(paginatedQuery, paginatedValues),
            furnasPool.query(countText, values), // Contagem total com filtros
        ]);

        const total = Number(countResult.rows[0].count);
        
        // Retorna os dados "crus" e a contagem
        return { data: result.rows, total };
    }

    /**
     * Busca TODOS os registros que correspondem aos filtros, sem paginação.
     * Ideal para exportações (range = 'all').
     */
    public static async findAll(options: { filters: any }): Promise<any[]> {
        const { filters } = options;
        
        // 1. Constrói a query base (ignora contagem e paginação)
        const { mainQuery, values } = buildAbioticoQuery(filters);
        
        // 2. Executa a query
        const result = await furnasPool.query(mainQuery, values);
        
        // Retorna os dados "crus"
        return result.rows;
    }

    /**
     * Busca um único registro pelo ID, com todos os joins necessários
     * para a visualização de detalhe.
     */
    public static async findById(id: number): Promise<any | null> {
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
            [id],
        );

        if (result.rows.length === 0) {
            return null;
        }
        
        // Retorna o primeiro registro "cru"
        return result.rows[0];
    }

    /**
     * --- NOVO MÉTODO PARA ANALYTICS (GRÁFICOS) ---
     * Calcula estatísticas (Média, Min, Max, Desvio Padrão) agrupadas por Reservatório ou Sítio.
     */
    public static async getAnalyticsData(options: {
        metric: string;
        groupBy: 'reservatorio' | 'sitio';
        filterReservatorioId?: number;
    }) {
        const { metric, groupBy, filterReservatorioId } = options;

        // 1. Whitelist de métricas permitidas (Segurança contra SQL Injection)
        const allowedMetrics = [
            'profundidade', 'dic', 'nt', 'pt', 
            'delta13c', 'delta15n'
        ];
        
        if (!allowedMetrics.includes(metric)) {
            throw new Error(`Métrica inválida ou não permitida para análise: ${metric}`);
        }

        // 2. Construção da Query Dinâmica
        let selectLabel = '';
        let groupByClause = '';
        let whereClauses: string[] = [];
        let params: any[] = [];
        let paramCounter = 1;

        // Joins necessários para conectar Abiotico -> Campanha -> Reservatório e Abiotico -> Sítio
        // a: tbabioticocoluna
        // b: tbcampanha
        // c: tbsitio
        // d: tbreservatorio
        const joinClause = `
            LEFT JOIN tbcampanha b ON a.idcampanha = b.idcampanha
            LEFT JOIN tbsitio c ON a.idsitio = c.idsitio
            LEFT JOIN tbreservatorio d ON b.idreservatorio = d.idreservatorio
        `;

        if (groupBy === 'reservatorio') {
            // Agrupar por Reservatório (Visão Macro)
            // d.nome vem de tbreservatorio (ligado via tbcampanha b)
            selectLabel = 'd.nome AS label, d.idreservatorio AS id';
            groupByClause = 'GROUP BY d.idreservatorio, d.nome';
        } else {
            // Agrupar por Sítio (Visão Micro/Drill-down)
            // c.nome vem de tbsitio (ligado direto em a)
            selectLabel = 'c.nome AS label, c.idsitio AS id';
            groupByClause = 'GROUP BY c.idsitio, c.nome';
        }

        // 3. Filtros
        
        // Filtro de Drill-down (Ex: ver apenas sítios de um reservatório específico)
        if (filterReservatorioId) {
            whereClauses.push(`d.idreservatorio = $${paramCounter++}`);
            params.push(filterReservatorioId);
        }

        // Filtro essencial: Ignorar nulos na métrica escolhida
        whereClauses.push(`a.${metric} IS NOT NULL`);

        const whereString = whereClauses.length > 0 
            ? 'WHERE ' + whereClauses.join(' AND ') 
            : '';

        // 4. Montagem Final da Query
        const query = `
            SELECT 
                ${selectLabel},
                ROUND(AVG(a.${metric})::numeric, 2) as media,
                ROUND(STDDEV(a.${metric})::numeric, 2) as desvio_padrao,
                MIN(a.${metric}) as minimo,
                MAX(a.${metric}) as maximo,
                COUNT(a.${metric}) as contagem
            FROM tbabioticocoluna a
            ${joinClause}
            ${whereString}
            ${groupByClause}
            ORDER BY label ASC
        `;

        const result = await furnasPool.query(query, params);
        return result.rows;
    }
}