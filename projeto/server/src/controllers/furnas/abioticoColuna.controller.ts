import { Request, Response } from "express";
import { furnasPool } from "../../configs/db";
import { logger } from "../../configs/logger";

const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

// Mapeamento
const mapRowToAbioticoColuna = (row: any) => ({
    idabioticocoluna: row.idabioticocoluna,
    datamedida: row.datamedida,
    horamedida: row.horamedida,
    profundidade: row.profundidade,
    dic: row.dic,
    nt: row.nt,
    pt: row.pt,
    delta13c: row.delta13c,
    delta15n: row.delta15n,
    
    // Objeto Aninhado para o Sítio
    sitio: row.idsitio ? {
        idsitio: row.idsitio,
        nome: row.sitio_nome,
        lat: row.sitio_lat,
        lng: row.sitio_lng,
        descricao: row.sitio_descricao,
    } : undefined,
    
    // Objeto Aninhado para a Campanha
    campanha: row.idcampanha ? {
        idcampanha: row.idcampanha,
        nroCampanha: row.nrocampanha,
        dataInicio: row.campanha_datainicio,
        dataFim: row.campanha_datafim,
        // Inclui o Reservatório aninhado na Campanha
        reservatorio: row.idreservatorio ? {
            idreservatorio: row.idreservatorio,
            nome: row.reservatorio_nome,
        } : undefined,
    } : undefined,
});

// getAll
export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || PAGE_SIZE;
        const offset = (page - 1) * limit;

        const result = await furnasPool.query(
            `
            SELECT 
                a.idabioticocoluna,
                a.datamedida,
                a.horamedida,
                a.profundidade,
                a.dic,
                a.nt,
                a.pt,
                a.delta13c,
                a.delta15n,
                b.idcampanha,
                b.nrocampanha,
                c.idsitio,
                c.nome AS sitio_nome,
                c.lat AS sitio_lat,
                c.lng AS sitio_lng
            FROM tbabioticocoluna AS a
            LEFT JOIN tbcampanha AS b
                ON a.idcampanha = b.idcampanha
            LEFT JOIN tbsitio AS c
                ON a.idsitio = c.idsitio
            ORDER BY a.datamedida DESC, a.horamedida DESC
            LIMIT $1 OFFSET $2
            `,
            [limit, offset],
        );

        const countResult = await furnasPool.query("SELECT COUNT(*) FROM tbabioticocoluna");
        const total = Number(countResult.rows[0].count);

        // aplica o mapeamento, removendo campos extras para listagem
        const data = result.rows.map((row: any) => ({
            ...mapRowToAbioticoColuna(row),
            campanha: row.idcampanha ? { idcampanha: row.idcampanha, nrocampanha: row.nrocampanha } : undefined,
            sitio: row.idsitio ? { idsitio: row.idsitio, nome: row.sitio_nome, lat: row.sitio_lat, lng: row.sitio_lng } : undefined,
            datamedida: row.datamedida,
            horamedida: row.horamedida,
            profundidade: row.profundidade,
            dic: row.dic,
            nt: row.nt,
            pt: row.pt,
            delta13c: row.delta13c,
            delta15n: row.delta15n,
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

// getById
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
            [idAbioticoColuna]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                error: `Registro abiótico em coluna não encontrado.`,
            });
            return;
        }

        // Mapeia o resultado único
        const data = mapRowToAbioticoColuna(result.rows[0]);

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