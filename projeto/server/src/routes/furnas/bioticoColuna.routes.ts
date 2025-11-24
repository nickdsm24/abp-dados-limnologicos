import { Router } from "express";
import { getAll, getById, exportData } from "../../controllers/furnas/bioticoColuna.controller";
//import { cacheMiddleware } from "../../middlewares/cacheMiddleware";

const router = Router();

// rota com cache de 10 minutos (600 segundos)
//router.get("/all", cacheMiddleware(600), getAll);

router.get("/all", getAll);
router.get("/:id", getById);
router.post("/export", exportData);


export default router;
