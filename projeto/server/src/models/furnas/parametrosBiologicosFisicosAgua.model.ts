import { furnasPool } from '../../configs/db';
import { FilterService } from '../../services/filterService';

/**
 * Mapeamento das chaves do frontend para as colunas reais da tabela.
 */
const parametrosColumnMap = {
  // Chaves de Range
  idParametrosBiologicosFisicosAgua: 'a.idParametrosBiologicosFisicosAgua',
  dataMedida: 'a.dataMedida',
  profundidade: 'a.profundidade',
  secchi: 'a.secchi',
  tempagua: 'a.tempagua',
  condutividade: 'a.condutividade',
  _do: 'a._do',
  ph: 'a.ph',
  turbidez: 'a.turbidez',
  materialemsuspensao: 'a.materialemsuspensao',
  doc: 'a.doc',
  toc: 'a.toc',
  poc: 'a.poc',
  dic: 'a.dic',
  nt: 'a.nt',
  pt: 'a.pt',
  densidadebacteria: 'a.densidadebacteria',
  biomassabacteria: 'a.biomassabacteria',
  clorofilaa: 'a.clorofilaa',
  biomassacarbonototalfito: 'a.biomassacarbonototalfito',
  densidadetotalfito: 'a.densidadetotalfito',
  biomassazoo: 'a.biomassazoo',
  densidadetotalzoo: 'a.densidadetotalzoo',
  producaofitoplanctonica: 'a.producaofitoplanctonica',
  carbonoorganicoexcretado: 'a.carbonoorganicoexcretado',
  respiracaofito: 'a.respiracaofito',
  producaobacteriana: 'a.producaobacteriana',
  respiracaobacteriana: 'a.respiracaobacteriana',
  taxasedimentacao: 'a.taxasedimentacao',
  delta13c: 'a.delta13c',
  delta15n: 'a.delta15n',
  intensidadeluminosa: 'a.intensidadeluminosa',

  // Igualdade (string)
  sitio: 'c.nome',
  campanha: 'b.nroCampanha'
};

/**
 * Constrói consultas com filtros aplicados.
 */
const buildParametrosQuery = (filters: any) => {
  const baseQuery = `
    SELECT
        a.idParametrosBiologicosFisicosAgua,
        a.dataMedida,
        a.profundidade,
        a.secchi,
        a.tempagua,
        a.condutividade,
        a._do,
        a.ph,
        a.turbidez,
        a.materialemsuspensao,
        a.doc,
        a.toc,
        a.poc,
        a.dic,
        a.nt,
        a.pt,
        a.densidadebacteria,
        a.biomassabacteria,
        a.clorofilaa,
        a.biomassacarbonototalfito,
        a.densidadetotalfito,
        a.biomassazoo,
        a.densidadetotalzoo,
        a.producaofitoplanctonica,
        a.carbonoorganicoexcretado,
        a.respiracaofito,
        a.producaobacteriana,
        a.respiracaobacteriana,
        a.taxasedimentacao,
        a.delta13c,
        a.delta15n,
        a.intensidadeluminosa,
        b.idCampanha,
        b.nroCampanha,
        c.idSitio,
        c.nome AS sitio_nome,
        c.lat AS sitio_lat,
        c.lng AS sitio_lng
    FROM tbparametrosbiologicosfisicosagua AS a
    LEFT JOIN tbcampanha AS b ON a.idCampanha = b.idCampanha
    LEFT JOIN tbsitio AS c ON a.idSitio = c.idSitio
  `;

  const countQuery = `
    SELECT COUNT(a.idParametrosBiologicosFisicosAgua)
    FROM tbparametrosbiologicosfisicosagua AS a
    LEFT JOIN tbcampanha AS b ON a.idCampanha = b.idCampanha
    LEFT JOIN tbsitio AS c ON a.idSitio = c.idSitio
  `;

  const { whereClause, params, nextIndex } = FilterService.buildFilter(
    filters,
    parametrosColumnMap,
    1
  );

  const mainQuery = `${baseQuery} ${whereClause} ORDER BY a.dataMedida DESC`;
  const countText = `${countQuery} ${whereClause}`;

  return { mainQuery, countText, values: params, paramIndex: nextIndex };
};

/**
 * Model de acesso aos dados.
 */
export class ParametrosBiologicosFisicosAguaModel {
  public static async findPaginated(options: {
    filters: any;
    page: number;
    limit: number;
  }) {
    const { filters, page, limit } = options;
    const offset = (page - 1) * limit;

    const { mainQuery, countText, values, paramIndex } =
      buildParametrosQuery(filters);

    const paginatedQuery = `${mainQuery} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const paginatedValues = [...values, limit, offset];

    const [result, countResult] = await Promise.all([
      furnasPool.query(paginatedQuery, paginatedValues),
      furnasPool.query(countText, values)
    ]);

    const total = Number(countResult.rows[0].count);

    return { data: result.rows, total };
  }

  public static async findAll(options: { filters: any }): Promise<any[]> {
    const { filters } = options;

    const { mainQuery, values } = buildParametrosQuery(filters);

    const result = await furnasPool.query(mainQuery, values);

    return result.rows;
  }

  /**
   * Busca um único registro, com joins para tabela Campanha, Sitio e Reservatório.
   */
  public static async findById(id: number): Promise<any | null> {
    const result = await furnasPool.query(
      `
      SELECT 
          a.*,
          b.idcampanha, b.nrocampanha,
          b.datainicio AS campanha_datainicio,
          b.datafim AS campanha_datafim,
          b.idreservatorio,
          c.idsitio, c.nome AS sitio_nome,
          c.descricao AS sitio_descricao,
          c.lat AS sitio_lat,
          c.lng AS sitio_lng,
          d.nome AS reservatorio_nome
      FROM tbparametrosbiologicosfisicosagua AS a
      LEFT JOIN tbcampanha AS b ON a.idcampanha = b.idcampanha
      LEFT JOIN tbsitio AS c ON a.idsitio = c.idsitio
      LEFT JOIN tbreservatorio AS d ON b.idreservatorio = d.idreservatorio
      WHERE a.idparametrosbiologicosfisicosagua = $1
      `,
      [id]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }
}
