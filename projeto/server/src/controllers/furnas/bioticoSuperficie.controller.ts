import { Request, Response } from "express";
import { furnasPool } from "../../configs/db";
import { logger } from "../../configs/logger";

const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || PAGE_SIZE;
    const offset = (page - 1) * limit;

    const result = await furnasPool.query(
      `
            SELECT 
                a.idBioticoSuperficie,
                a.idCampanha,
                a.idSitio,
                a.dataMedida,
                a.horaMedida,
                a.doc,
                a.toc,
                a.poc,
                a.densidadeBacteria,
                a.biomassaBacteria,
                a.clorofilaA,
                a.biomassaCarbonoTotalFito,
                a.densidadeTotalFito,
                a.biomassaZoo,
                a.densidadeTotalZoo,
                b.nrocampanha,
                c.nome AS sitio_nome
            FROM tbbioticosuperficie AS a
            LEFT JOIN tbcampanha AS b
                ON a.idCampanha = b.idcampanha
            LEFT JOIN tbsitio AS c
                ON a.idSitio = c.idsitio
            ORDER BY c.nome, b.nrocampanha
            LIMIT $1 OFFSET $2
            `,
      [limit, offset],
    );

    const countResult = await furnasPool.query("SELECT COUNT(*) FROM tbbioticosuperficie");
    const total = Number(countResult.rows[0].count);

    const data = result.rows.map((row: any) => ({
      idBioticoSuperficie: row.idBioticoSuperficie,
      idCampanha: row.idCampanha
        ? {
            idCampanha: row.idCampanha,
            nroCampanha: row.nrocampanha,
          }
        : undefined,
      sitio: row.idSitio
        ? {
            idSitio: row.idSitio,
            nome: row.sitio_nome,
          }
        : undefined,
      dataMedida: row.dataMedida,
      horaMedida: row.horaMedida,
      doc: row.doc,
      toc: row.toc,
      poc: row.poc,
      densidadeBacteria: row.densidadeBacteria,
      biomassaBacteria: row.biomassaBacteria,
      clorofilaA: row.clorofilaA,
      biomassaCarbonoTotalFito: row.biomassaCarbonoTotalFito,
      densidadeTotalFito: row.densidadeTotalFito,
      biomassaZoo: row.biomassaZoo,
      densidadeTotalZoo: row.densidadeTotalZoo,
    }));

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error: any) {
    logger.error("Erro ao consultar tbbioticosuperficie", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: "Erro ao realizar a operação.",
    });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await furnasPool.query(
      `
            SELECT 
                a.idBioticoSuperficie,
                a.idCampanha,
                a.idSitio,
                a.dataMedida,
                a.horaMedida,
                a.doc,
                a.toc,
                a.poc,
                a.densidadeBacteria,
                a.biomassaBacteria,
                a.clorofilaA,
                a.biomassaCarbonoTotalFito,
                a.densidadeTotalFito,
                a.biomassaZoo,
                a.densidadeTotalZoo,
                b.nrocampanha,
                c.nome AS sitio_nome
            FROM tbbioticosuperficie AS a
            LEFT JOIN tbcampanha AS b
                ON a.idCampanha = b.idcampanha
            LEFT JOIN tbsitio AS c
                ON a.idSitio = c.idsitio
            WHERE a.idBioticoSuperficie = $1
            `,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `O ID ${id} não foi encontrado.`,
      });
      return;
    }

    const data = result.rows.map((row: any) => ({
      idBioticoSuperficie: row.idBioticoSuperficie,
      idCampanha: row.idCampanha
        ? {
            idCampanha: row.idCampanha,
            nroCampanha: row.nrocampanha,
          }
        : undefined,
      sitio: row.idSitio
        ? {
            idSitio: row.idSitio,
            nome: row.sitio_nome,
          }
        : undefined,
      dataMedida: row.dataMedida,
      horaMedida: row.horaMedida,
      doc: row.doc,
      toc: row.toc,
      poc: row.poc,
      densidadeBacteria: row.densidadeBacteria,
      biomassaBacteria: row.biomassaBacteria,
      clorofilaA: row.clorofilaA,
      biomassaCarbonoTotalFito: row.biomassaCarbonoTotalFito,
      densidadeTotalFito: row.densidadeTotalFito,
      biomassaZoo: row.biomassaZoo,
      densidadeTotalZoo: row.densidadeTotalZoo,
    }));

    res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (error: any) {
    logger.error("Erro ao consultar tbbioticosuperficie por ID", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: "Erro ao realizar a operação.",
    });
  }
};
