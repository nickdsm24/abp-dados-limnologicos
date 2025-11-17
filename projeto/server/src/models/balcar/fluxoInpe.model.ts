import { balcarPool } from '../../configs/db'; // ATENÇÃO: Importa o balcarPool
import { FilterService } from '../../services/filterService';

// Mapeia as chaves do frontend (ex: req.query) para as colunas reais
// do banco de dados (com seus aliases).
const fluxoInpeColumnMap = {
    // Chaves de Range (number, date)
    idfluxoinpe: 'a.idfluxoinpe',
    datamedida: 'a.datamedida',
    ch4: 'a.ch4',
    batimetria: 'a.batimetria',
    tempar: 'a.tempar',
    tempcupula: 'a.tempcupula',
    tempaguasubsuperficie: 'a.tempaguasubsuperficie',
    tempaguameio: 'a.tempaguameio',
    tempaguafundo: 'a.tempaguafundo',
    phsubsuperficie: 'a.phsubsuperficie',
    phmeio: 'a.phmeio',
    phfundo: 'a.phfundo',
    orpsubsuperficie: 'a.orpsubsuperficie',
    orpmeio: 'a.orpmeio',
    orpfundo: 'a.orpfundo',
    condutividadesubsuperficie: 'a.condutividadesubsuperficie',
    condutividademeio: 'a.condutividademeio',
    condutividadefundo: 'a.condutividadefundo',
    odsubsuperficie: 'a.odsubsuperficie',
    odmeio: 'a.odmeio',
    odfundo: 'a.odfundo',
    tsdsubsuperficie: 'a.tsdsubsuperficie',
    tsdmeio: 'a.tsdmeio',
    tsdfundo: 'a.tsdfundo',

    // Chaves de Igualdade (string)
    // O frontend pode enviar { sitio: 'Nome do Sitio' } ou { campanha: 'Nro da Campanha' }
    sitio: 'c.nome', // Mapeia a chave 'sitio' para 'c.nome'
    campanha: 'b.nrocampanha', // Mapeia 'campanha' para 'b.nrocampanha'
};

/**
 * Constrói a query de listagem e contagem dinamicamente, aplicando filtros.
 * @param filters Um objeto (ex: req.query) com os filtros.
 */
const buildFluxoInpeQuery = (filters: any) => {
    // Query base para selecionar os dados (a mesma do controller original)
    // Usa os aliases 'sitio_nome', etc. para o DataFormatterService
    const baseQuery = `
        SELECT 
            a.idfluxoinpe, a.datamedida, a.ch4, a.batimetria, a.tempar,
            a.tempcupula, a.tempaguasubsuperficie, a.tempaguameio, a.tempaguafundo,
            a.phsubsuperficie, a.phmeio, a.phfundo,
            a.orpsubsuperficie, a.orpmeio, a.orpfundo,
            a.condutividadesubsuperficie, a.condutividademeio, a.condutividadefundo,
            a.odsubsuperficie, a.odmeio, a.odfundo,
            a.tsdsubsuperficie, a.tsdmeio, a.tsdfundo,
            b.idcampanha, b.nrocampanha,
            c.idsitio, c.nome AS sitio_nome, c.lat AS sitio_lat, c.lng AS sitio_lng
        FROM tbfluxoinpe AS a
        LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
        LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
    `;

    // Query base para contagem (com os mesmos joins e filtros)
    // ISSO CORRIGE O BUG DO CONTROLLER ANTIGO
    const countQuery = `
        SELECT COUNT(a.idfluxoinpe)
        FROM tbfluxoinpe AS a
        LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
        LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
    `;

    // Usa o FilterService para construir a cláusula WHERE
    const { whereClause, params, nextIndex } = FilterService.buildFilter(
        filters,
        fluxoInpeColumnMap,
        1, // Começa a contagem de parâmetros em $1
    );

    const whereString = whereClause;
    const values = params;
    const paramIndex = nextIndex;

    // Query principal com ordenação (conforme controller original)
    const mainQuery = `${baseQuery} ${whereString} ORDER BY a.datamedida DESC, a.idfluxoinpe DESC`;
    // Query de contagem (sem ordenação)
    const countText = `${countQuery} ${whereString}`;

    return { mainQuery, countText, values, paramIndex };
};

/**
 * Classe Model para encapsular o acesso a dados da tbfluxoinpe (Balcar).
 */
export class FluxoInpeModel {
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
            buildFluxoInpeQuery(filters);

        // 2. Adiciona paginação à query
        const paginatedQuery = `${mainQuery} LIMIT $${paramIndex} OFFSET $${
            paramIndex + 1
        }`;
        const paginatedValues = [...values, limit, offset];

        // 3. Executa a query de dados e a de contagem em paralelo
        //    (Usa a contagem com filtros, corrigindo o COUNT(*) do controller antigo)
        const [result, countResult] = await Promise.all([
            balcarPool.query(paginatedQuery, paginatedValues),
            balcarPool.query(countText, values),
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
        const { mainQuery, values } = buildFluxoInpeQuery(filters);
        
        // 2. Executa a query
        const result = await balcarPool.query(mainQuery, values);
        
        // Retorna os dados "crus"
        return result.rows;
    }

    /**
     * Busca um único registro pelo ID.
     * (Segue o padrão dos exemplos, buscando dados mais ricos com join em reservatorio)
     */
    public static async findById(id: number): Promise<any | null> {
        const result = await balcarPool.query(
            `
            SELECT 
                a.*, -- Campos principais do tbfluxoinpe
                b.idcampanha, b.nrocampanha,
                b.datainicio AS campanha_datainicio, b.datafim AS campanha_datafim,
                c.idsitio, c.nome AS sitio_nome,
                c.lat AS sitio_lat, c.lng AS sitio_lng, c.descricao AS sitio_descricao,
                d.idreservatorio, d.nome AS reservatorio_nome -- Join adicional
            FROM tbfluxoinpe AS a
            LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
            LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
            LEFT JOIN tbreservatorio AS d ON b.idreservatorio = d.idreservatorio
            WHERE a.idfluxoinpe = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return null;
        }
        
        // Retorna o primeiro registro "cru"
        return result.rows[0];
    }
}