import { Router } from "express";
// 1. Importa a nova função 'exportData' do controller
import {
	getAll,
	getById,
	exportData,
	getAnalytics
} from "../../controllers/furnas/abioticoColuna.controller";
//import { cacheMiddleware } from "../../middlewares/cacheMiddleware";

const router = Router();

// rota com cache de 10 minutos (600 segundos)
//router.get("/all", cacheMiddleware(600), getAll);

router.get("/all", getAll);
router.get("/:idabioticocoluna", getById);

// 2. Adiciona a nova rota de exportação (usando POST)
router.post("/export", exportData);
router.get("/graph/analytics", getAnalytics);

export default router;