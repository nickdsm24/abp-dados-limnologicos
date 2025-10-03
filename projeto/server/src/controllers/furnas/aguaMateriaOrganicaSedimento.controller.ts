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
          a.idaguamateriaorganicasedimento,
          a.idcampanha,
          a.idsitio,
          a.datamedida,
          a.horamedida,
          a.profundidade,
          a.batimetria,
          a.agua,
          a.materiaOrganica,
          b.nrocampanha,
          c.nome AS sitio_nome
        FROM tbaguamateriaorganicasedimento AS a
        LEFT JOIN tbcampanha AS b
          ON a.idcampanha = b.idcampanha
        LEFT JOIN tbsitio AS c
          ON a.idsitio = c.idsitio
        ORDER BY c.nome, b.nrocampanha
        LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    const countResult = await furnasPool.query("SELECT COUNT(*) FROM tbaguamateriaorganicasedimento");
    const total = Number(countResult.rows[0].count);

    const data = result.rows.map((row: any) => ({
      idaguamateriaorganicasedimento: row.idaguamateriaorganicasedimento,
      campanha: row.idcampanha
        ? {
            idCampanha: row.idcampanha,
            nroCampanha: row.nrocampanha,
          }
        : undefined,
      sitio: row.idsitio
        ? {
            idSitio: row.idsitio,
            nome: row.sitio_nome,
          }
        : undefined,
      dataMedida: row.datamedida,
      horaMedida: row.horamedida,
      profundidade: row.profundidade,
      batimetria: row.batimetria,
      agua: row.agua,
      materiaOrganica: row.materiaorganica,
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
    logger.error("Erro ao consultar tbaguamateriaorganicasedimento", {
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
          a.idaguamateriaorganicasedimento,
          a.idcampanha,
          a.idsitio,
          a.datamedida,
          a.horamedida,
          a.profundidade,
          a.batimetria,
          a.agua,
          a.materiaOrganica,
          b.nrocampanha,
          c.nome AS sitio_nome
        FROM tbaguamateriaorganicasedimento AS a
        LEFT JOIN tbcampanha AS b
          ON a.idcampanha = b.idcampanha
        LEFT JOIN tbsitio AS c
          ON a.idsitio = c.idsitio
        WHERE a.idaguamateriaorganicasedimento = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `O ID ${id} não foi encontrado.`,
      });
      return;
    }

    const data = result.rows.map((row: any) => ({
      idaguamateriaorganicasedimento: row.idaguamateriaorganicasedimento,
      campanha: row.idcampanha
        ? {
            idCampanha: row.idcampanha,
            nroCampanha: row.nrocampanha,
          }
        : undefined,
      sitio: row.idsitio
        ? {
            idSitio: row.idsitio,
            nome: row.sitio_nome,
          }
        : undefined,
      dataMedida: row.datamedida,
      horaMedida: row.horamedida,
      profundidade: row.profundidade,
      batimetria: row.batimetria,
      agua: row.agua,
      materiaOrganica: row.materiaorganica,
    }));

    res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (error: any) {
    logger.error("Erro ao consultar tbaguamateriaorganicasedimento por ID", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: "Erro ao realizar a operação.",
    });
  }
};
