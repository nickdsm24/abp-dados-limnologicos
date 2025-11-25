import { Router } from "express";
import {getAll, getById, exportData, getAnalytics} from "../../controllers/furnas/horiba.controller";

const router = Router();

router.get("/all", getAll);
router.get("/:idHoriba", getById);
router.post("/export", exportData);
router.get("/graph/analytics", getAnalytics);


export default router;