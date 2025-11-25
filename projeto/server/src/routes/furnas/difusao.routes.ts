import { Router } from "express";
import {getAll, getById, exportData, getAnalytics} from "../../controllers/furnas/difusao.controller";
//import { cacheMiddleware } from "../../middlewares/cacheMiddleware";

const router = Router();

// rota com cache de 10 minutos (600 segundos)
//router.get("/all", cacheMiddleware(600), getAll);

router.get("/all", getAll);
router.get("/:idDifusao", getById);
router.post("/export", exportData);
router.get("/graph/analytics", getAnalytics);


export default router;