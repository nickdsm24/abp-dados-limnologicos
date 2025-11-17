import { Router } from "express";
import { getAll, getById, exportData } from "../../controllers/sima/sima.controller";

const router = Router();

router.get("/all", getAll);
router.get("/:idsima", getById);
router.post("/export", exportData);

export default router;