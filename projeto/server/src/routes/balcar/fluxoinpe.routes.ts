<<<<<<< HEAD
import { Router } from "express";
import { getAll, getById } from "../../controllers/balcar/fluxoinpe.controller";

const router = Router();

router.get("/all", getAll);
router.get("/:id", getById);

export default router;
=======
import { Router } from "express";
import { getAll } from "../../controllers/balcar/fluxoinpe.controller";

const router = Router();

router.get("/all", getAll);

export default router;
>>>>>>> a7ddc47d2bd0e6e134ab37f37f4a7cfa5c81ba3d
