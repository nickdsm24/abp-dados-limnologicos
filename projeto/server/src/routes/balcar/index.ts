<<<<<<< HEAD
import express from "express";
import fluxoinpe from "./fluxoinpe.routes";
import campanha from "./campanha.routes";
import instituicao from "./instituicao.routes";
import sitio from "./sitio.routes";
import reservatorio from "./reservatorio.routes";
import tabelacampo from "./tabelacampo.routes";

const app = express();

app.use(express.json());

// Rotas agrupadas por entidade
app.use("/campanha", campanha);
app.use("/instituicao", instituicao);
app.use("/sitio", sitio);
app.use("/reservatorio", reservatorio);
app.use("/tabelacampo", tabelacampo);

// Exemplo: GET /campanha?page=1


const router = express.Router();

router.use("/fluxoinpe", fluxoinpe);
router.use("/campanha", campanha);
router.use("/instituicao", instituicao);
router.use("/sitio", sitio);
router.use("/reservatorio", reservatorio);
router.use("/tabelacampo", tabelacampo);

export default router;
=======
import express from "express";
import fluxoinpe from "./fluxoinpe.routes";

const router = express.Router();

router.use("/fluxoinpe", fluxoinpe);

export default router;
>>>>>>> a7ddc47d2bd0e6e134ab37f37f4a7cfa5c81ba3d
