import { Router } from "express";
import { getAll, getById } from "../../controllers/furnas/abioticoColuna.controller";

const router = Router();

router.get("/all", getAll);
router.get("/:idabioticocoluna", getById);

export default router;