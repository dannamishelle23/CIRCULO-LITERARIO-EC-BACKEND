import { Router } from "express";

import {
  crearCapitulo,
  listarCapitulos,
  editarCapitulo,
  eliminarCapitulo,
} from "../controllers/capitulos_controller.js";

import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router();

/* =========================
   CREAR CAPÍTULO
========================= */
router.post(
  "/:id", // id = obraId
  verificarTokenJWT,
  crearCapitulo
);

/* =========================
   LISTAR CAPÍTULOS
========================= */
router.get(
  "/obra/:id",
  verificarTokenJWT,
  listarCapitulos
);

/* =========================
   EDITAR CAPÍTULO
========================= */
router.put(
  "/:capituloId",
  verificarTokenJWT,
  editarCapitulo
);

/* =========================
   ELIMINAR CAPÍTULO
========================= */
router.delete(
  "/:capituloId",
  verificarTokenJWT,
  eliminarCapitulo
);

export default router;