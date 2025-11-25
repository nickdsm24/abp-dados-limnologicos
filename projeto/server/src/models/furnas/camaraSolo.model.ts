import { furnasPool } from '../../configs/db';
import { FilterService } from '../../services/filterService';

// Mapeia as chaves do frontend (filtros) para as colunas reais do banco de dados.
const camaraSoloColumnMap = {
    // Chaves de Range (type: 'number' ou 'date')
    idCamaraSolo: 'a.idCamaraSolo',
    dataMedida: 'a.dataMedida',
    ch4: 'a.ch4',
    co2: 'a.co2',
    n2o: 'a.n2o',
    tempar: 'a.tempar',
    tempsolo: 'a.tempsolo',
    vento: 'a.vento',
    altitude: 'a.altitude',

    // Chaves de Igualdade (type: 'string')
    sitio: 'c.nome',
    campanha: 'b.nroCampanha',
    horaMedida: 'a.horaMedida',
};

/**
 * Constrói a query de listagem e contagem dinamicamente, aplicando filtros.
 * @param filters Um objeto (ex: req.query) com os filtros.
 */
const buildCamaraSoloQuery = (filters: any) => {
    // Query base para selecionar os dados (baseado no getAll original)
    const baseQuery = `
        SELECT
            a.idCamaraSolo, a.dataMedida, a.horaMedida, a.ch4, a.co2, a.n2o,
            a.tempar, a.tempsolo, a.vento, a.altitude,
            b.idCampanha, b.nroCampanha,
            c.idSitio, c.nome AS sitio_nome, c.lat AS sitio_lat, c.lng AS sitio_lng
        FROM tbcamarasolo AS a
        LEFT JOIN tbcampanha AS b ON a.idCampanha = b.idCampanha
        LEFT JOIN tbsitio AS c ON a.idSitio = c.idSitio
    `;

    // Query base para contagem (deve ter os mesmos JOINs para filtros)
    const countQuery = `
        SELECT COUNT(a.idCamaraSolo)
        FROM tbcamarasolo AS a
        LEFT JOIN tbcampanha AS b ON a.idCampanha = b.idCampanha
        LEFT JOIN tbsitio AS c ON a.idSitio = c.idSitio
    `;

    // Usa o FilterService para construir a cláusula WHERE
    const { whereClause, params, nextIndex } = FilterService.buildFilter(
        filters,
        camaraSoloColumnMap,
        1, // Começa a contagem de parâmetros em $1
    );

    const whereString = whereClause;
    const values = params;
    const paramIndex = nextIndex;

    // Query principal com ordenação (do getAll original)
    const mainQuery = `${baseQuery} ${whereString} ORDER BY a.dataMedida DESC, a.horaMedida DESC`;
    // Query de contagem (sem ordenação)
    const countText = `${countQuery} ${whereString}`;

    return { mainQuery, countText, values, paramIndex };
};

/**
 * Classe Model para encapsular o acesso a dados da tbcamarasolo.
 */
export class CamaraSoloModel {
    /**
     * Busca uma lista paginada de registros, aplicando filtros.
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
            buildCamaraSoloQuery(filters);

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
        const { mainQuery, values } = buildCamaraSoloQuery(filters);
        
        // 2. Executa a query
        const result = await furnasPool.query(mainQuery, values);
        
        // Retorna os dados "crus"
        return result.rows;
    }

    /**
     * Busca um único registro pelo ID, com os joins necessários
     * para a visualização de detalhe.
     */
    public static async findById(id: number): Promise<any | null> {
        // Query baseada no getById original + Reservatório (para contexto completo se necessário)
        const result = await furnasPool.query(
            `
            SELECT
                a.idCamaraSolo, a.dataMedida, a.horaMedida, a.ch4, a.co2, a.n2o,
                a.tempar, a.tempsolo, a.vento, a.altitude,
                b.idCampanha, b.nroCampanha,
                b.dataInicio AS campanha_datainicio,
                b.dataFim AS campanha_datafim,
                c.idSitio, c.nome AS sitio_nome, c.lat AS sitio_lat, c.lng AS sitio_lng,
                c.descricao AS sitio_descricao,
                d.idreservatorio, d.nome AS reservatorio_nome
            FROM tbcamarasolo AS a
            LEFT JOIN tbcampanha AS b
                ON a.idCampanha = b.idCampanha
            LEFT JOIN tbsitio AS c
                ON a.idSitio = c.idSitio
            LEFT JOIN tbreservatorio AS d 
                ON b.idReservatorio = d.idReservatorio
            WHERE a.idCamaraSolo = $1
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

        // 1. Mapeamento de métricas (Input Frontend -> Coluna Banco)
        const metricToColumn: Record<string, string> = {
            'CH4': 'ch4',
            'ch4': 'ch4',
            'CO2': 'co2',
            'co2': 'co2',
            'N2O': 'n2o',
            'n2o': 'n2o',
            'tempAr': 'tempar',
            'tempar': 'tempar',
            'tempSolo': 'tempsolo',
            'tempsolo': 'tempsolo',
            'vento': 'vento',
            'altitude': 'altitude'
        };

        // Validação
        if (!metricToColumn.hasOwnProperty(metric)) {
            throw new Error(`Métrica inválida ou não permitida para análise: ${metric}`);
        }

        const column = metricToColumn[metric];

        // 2. Construção da Query Dinâmica
        let selectLabel = '';
        let groupByClause = '';
        let whereClauses: string[] = [];
        let params: any[] = [];
        let paramCounter = 1;

        // Joins necessários para conectar Dados -> Sítio, Campanha -> Reservatório
        // a: tbcamarasolo
        // b: tbcampanha
        // c: tbsitio
        // d: tbreservatorio
        const joinClause = `
            LEFT JOIN tbcampanha b ON a.idCampanha = b.idCampanha
            LEFT JOIN tbsitio c ON a.idSitio = c.idSitio
            LEFT JOIN tbreservatorio d ON b.idReservatorio = d.idReservatorio
        `;

        if (groupBy === 'reservatorio') {
            // Agrupar por Reservatório (Visão Macro)
            selectLabel = 'd.nome AS label, d.idreservatorio AS id';
            groupByClause = 'GROUP BY d.idreservatorio, d.nome';
        } else {
            // Agrupar por Sítio (Visão Micro/Drill-down)
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
        whereClauses.push(`a.${column} IS NOT NULL`);

        const whereString = whereClauses.length > 0 
            ? 'WHERE ' + whereClauses.join(' AND ') 
            : '';

        // 4. Montagem Final da Query
        const query = `
            SELECT 
                ${selectLabel},
                ROUND(AVG(a.${column})::numeric, 2) as media,
                ROUND(STDDEV(a.${column})::numeric, 2) as desvio_padrao,
                MIN(a.${column}) as minimo,
                MAX(a.${column}) as maximo,
                COUNT(a.${column}) as contagem
            FROM tbcamarasolo a
            ${joinClause}
            ${whereString}
            ${groupByClause}
            ORDER BY label ASC
        `;

        const result = await furnasPool.query(query, params);
        return result.rows;
    }
}