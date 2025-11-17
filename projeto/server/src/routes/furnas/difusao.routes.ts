import { Router } from "express";
import {getAll, getById, exportData} from "../../controllers/furnas/difusao.controller";

const router = Router();

router.get("/all", getAll);
router.get("/:idDifusao", getById);
router.post("/export", exportData);


export default router;