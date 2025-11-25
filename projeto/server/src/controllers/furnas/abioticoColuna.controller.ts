// src/controllers/furnas/abioticoColuna.controller.ts
import { Request, Response } from "express";
import { logger } from "../../configs/logger";
// 1. Importa os Serviços (formatação e exportação)
import { DataFormatterService } from "../../services/dataFormatterService";
import { ExportService, ExportFileOptions } from "../../services/exportService";
// 2. Importa o Model
import { AbioticoColunaModel } from "../../models/furnas/abioticoColuna.model";

const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

// --- ENDPOINTS ---

/**
 * Endpoint: getAll
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || PAGE_SIZE;

    // 1. Pede os dados paginados ao Model
    const { data: rawData, total } = await AbioticoColunaModel.findPaginated({
      filters: req.query,
      page,
      limit,
    });

    // 2. Formata os dados "crus" usando o Service
    const data = rawData.map(DataFormatterService.formatListRow);

    // 3. Envia a resposta
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

    // 1. Pede o dado ao Model
    const rawData = await AbioticoColunaModel.findById(idAbioticoColuna);

    // 2. Verifica se foi encontrado
    if (!rawData) {
      res.status(404).json({
        success: false,
        error: `Registro abiótico em coluna não encontrado.`,
      });
      return;
    }

    // 3. Formata o dado "cru"
    const data = rawData; // Retorna os dados crus do model

    // 4. Envia a resposta
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    logger.error(`Erro ao consultar tbabioticocoluna por ID ${req.params.idabioticocoluna}`, {
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
 * Endpoint: exportData
 */
export const exportData = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extrai opções do body
    const { format, range, includeHeaders, delimiter, encoding, filters, page, limit } =
      req.body as ExportFileOptions & {
        range: "page" | "all";
        filters: any;
        page?: number;
        limit?: number;
      };

    // Opções para o ExportService
    const exportOptions: ExportFileOptions = {
      format,
      includeHeaders,
      delimiter,
      encoding,
    };

    let rawData: any[];

    // 2. Busca os dados no Model com base no 'range'
    if (range === "page") {
      const { data } = await AbioticoColunaModel.findPaginated({
        filters: filters || {},
        page: page || 1,
        limit: limit || PAGE_SIZE,
      });
      rawData = data;
    } else {
      // range === 'all'
      rawData = await AbioticoColunaModel.findAll({
        filters: filters || {},
      });
    }

    // 3. Formata os dados para "lista"
    const formattedData = rawData.map(DataFormatterService.formatListRow);

    // 4. Gera o buffer do arquivo
    const fileBuffer = await ExportService.generateExportFile(formattedData, exportOptions);

    // 5. Define os headers da resposta
    const fileName = `export_abiotico_coluna_${new Date().toISOString().slice(0, 10)}.${format}`;

    if (format === "xlsx") {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
    } else {
      res.setHeader("Content-Type", "text/csv; charset=" + (encoding || "utf-8"));
    }
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // 6. Envia o buffer como resposta
    res.send(fileBuffer);
  } catch (error: any) {
    logger.error("Erro ao exportar dados de tbabioticocoluna", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      error: "Erro ao gerar exportação.",
    });
  }
};

/**
 * --- NOVO ENDPOINT DE ANALYTICS ---
 * Endpoint: getAnalytics
 * Retorna estatísticas agrupadas por Reservatório ou Sítio.
 * Query Params: metric (obrigatório), groupBy (obrigatório), filterReservatorioId
 */
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { metric, groupBy, filterReservatorioId } = req.query;

    // 1. Validações Básicas
    if (!metric) {
      res.status(400).json({ 
        success: false, 
        error: "Parâmetro 'metric' é obrigatório." 
      });
      return;
    }

    if (groupBy !== 'reservatorio' && groupBy !== 'sitio') {
      res.status(400).json({ 
        success: false, 
        error: "Parâmetro 'groupBy' deve ser 'reservatorio' ou 'sitio'." 
      });
      return;
    }

    // 2. Chama o Model de Agregação
    const data = await AbioticoColunaModel.getAnalyticsData({
      metric: metric as string,
      groupBy: groupBy as 'reservatorio' | 'sitio',
      filterReservatorioId: filterReservatorioId ? Number(filterReservatorioId) : undefined
    });

    // 3. Retorna o JSON otimizado
    res.status(200).json({
      success: true,
      groupBy,
      metric,
      totalGroups: data.length,
      data
    });

  } catch (error: any) {
    logger.error("Erro ao gerar analytics de Abiótico Coluna", {
      message: error.message,
      stack: error.stack,
      query: req.query
    });

    // Se for erro de métrica inválida (lançado pelo model), retorna 400
    if (error.message && error.message.includes("Métrica inválida")) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Erro ao processar dados analíticos.",
    });
  }
};