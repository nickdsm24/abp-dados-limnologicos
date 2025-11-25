// src/models/abioticoSuperficie.model.ts
import { furnasPool } from "../../configs/db";
import { FilterService } from "../../services/filterService";

// Mapeia as chaves do frontend (vistas pelo useMemo/formatListRow)
// para as colunas reais do banco de dados (com seus aliases).
const abioticoSuperficieColumnMap = {
  // Chaves de Range (type: 'number' ou 'date' no frontend)
  idabioticosuperficie: "a.idabioticosuperficie",
  datamedida: "a.datamedida",
  dic: "a.dic",
  nt: "a.nt",
  pt: "a.pt",
  delta13c: "a.delta13c",
  delta15n: "a.delta15n",

  // Chaves de Igualdade/ILIKE (type: 'string' no frontend)
  sitio: "c.nome", // Traduz 'sitio' (visto no frontend) para 'c.nome'
  campanha: "b.nrocampanha", // Traduz 'campanha' para 'b.nrocampanha'
  horamedida: "a.horamedida",
};

/**
 * Constrói a query de listagem e contagem dinamicamente, aplicando filtros.
 */
const buildAbioticoSuperficieQuery = (filters: any) => {
  // Query base para selecionar os dados (para a listagem)
  // Esta query traz os campos brutos necessários para o formatListRow
  const baseQuery = `
    SELECT 
        a.idabioticosuperficie,
        a.idcampanha,
        a.idsitio,
        a.datamedida,
        a.horamedida,
        a.dic,
        a.nt,
        a.pt,
        a.delta13c,
        a.delta15n,
        b.nrocampanha,
        c.nome AS sitio_nome
    FROM tbabioticosuperficie AS a
    LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
    LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
  `;

  // Query base para contagem (deve ter os mesmos JOINS e FILTROS)
  const countQuery = `
    SELECT COUNT(a.idabioticosuperficie)
    FROM tbabioticosuperficie AS a
    LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
    LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
  `;

  // Usa o FilterService para construir a cláusula WHERE
  const { whereClause, params, nextIndex } = FilterService.buildFilter(
    filters,
    abioticoSuperficieColumnMap,
    1, // Começa a contagem de parâmetros em $1
  );

  const whereString = whereClause;
  const values = params;
  const paramIndex = nextIndex;

  // Ordenação (vinda do controller original)
  const orderBy = "ORDER BY c.nome, b.nrocampanha";

  // Query principal com filtros e ordenação
  const mainQuery = `${baseQuery} ${whereString} ${orderBy}`;
  // Query de contagem com filtros (sem ordenação)
  const countText = `${countQuery} ${whereString}`;

  return { mainQuery, countText, values, paramIndex };
};

/**
 * Classe Model para encapsular o acesso a dados da tbabioticosuperficie.
 */
export class AbioticoSuperficieModel {
  /**
   * Busca uma lista paginada de registros, aplicando filtros.
   */
  public static async findPaginated(options: { filters: any; page: number; limit: number }) {
    const { filters, page, limit } = options;
    const offset = (page - 1) * limit;

    // 1. Constrói a query base com filtros
    const { mainQuery, countText, values, paramIndex } = buildAbioticoSuperficieQuery(filters);

    // 2. Adiciona paginação à query
    const paginatedQuery = `${mainQuery} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const paginatedValues = [...values, limit, offset];

    // 3. Executa a query de dados e a de contagem em paralelo
    const [result, countResult] = await Promise.all([
      furnasPool.query(paginatedQuery, paginatedValues),
      furnasPool.query(countText, values), // Contagem total com filtros
    ]);

    const total = Number(countResult.rows[0].count);

    return { data: result.rows, total };
  }

  /**
   * Busca TODOS os registros que correspondem aos filtros, sem paginação.
   */
  public static async findAll(options: { filters: any }): Promise<any[]> {
    const { filters } = options;

    const { mainQuery, values } = buildAbioticoSuperficieQuery(filters);
    const result = await furnasPool.query(mainQuery, values);

    return result.rows;
  }

  /**
   * Busca um único registro pelo ID, com todos os joins necessários.
   */
  public static async findById(id: number): Promise<any | null> {
    // Query de detalhe completa
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
      FROM tbabioticosuperficie AS a
      LEFT JOIN tbcampanha AS b
        ON a.idcampanha = b.idcampanha
      LEFT JOIN tbsitio AS c
        ON a.idsitio = c.idsitio
      LEFT JOIN tbreservatorio AS d
        ON b.idreservatorio = d.idreservatorio
      WHERE a.idabioticosuperficie = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

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
        'dic', 'nt', 'pt', 
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
    // a: tbabioticosuperficie
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
        FROM tbabioticosuperficie a
        ${joinClause}
        ${whereString}
        ${groupByClause}
        ORDER BY label ASC
    `;

    const result = await furnasPool.query(query, params);
    return result.rows;
  }
}