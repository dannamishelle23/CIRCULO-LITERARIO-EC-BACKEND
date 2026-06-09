import { Router } from "express";
import {
  crearObra,
  obtenerObra,
  listarObrasClub,
  actualizarObra,
  postularObra,
  aprobarObra,
  iniciarVotacion,
  listarMisObrasClub
} from "../controllers/obras_controller.js";

import { verificarTokenJWT } from "../middlewares/JWT.js";
import verificarRol from "../middlewares/verificarRol.js";
import verificarMiembroClub from "../middlewares/verificarMiembrosClub.js";
import verificarAutorObra from "../middlewares/verificarAutorObra.js";

const router = Router();
/* =========================
   CREAR OBRA (usuario autenticado)
========================= */
router.post("/",
  verificarTokenJWT,
  crearObra
);

/* =========================
   LISTAR OBRAS DEL CLUB
   (solo miembros aprobados)
========================= */
router.get(
  "/club/:clubId",
  verificarTokenJWT,
  verificarMiembroClub,
  listarObrasClub
);

/* =========================
   OBTENER OBRA (preview o completa)
========================= */
router.get("/:id",verificarTokenJWT,obtenerObra);

/* =========================
   ACTUALIZAR OBRA
========================= */
router.put(
  "/:id",
  verificarTokenJWT,
  verificarAutorObra,
  actualizarObra
);

/* =========================
   POSTULAR OBRA
========================= */
router.post(
  "/:id/postular",
  verificarTokenJWT,
  verificarAutorObra,
  postularObra
);

/* =========================
   APROBAR OBRA (moderador)
========================= */
router.post(
  "/:id/aprobar",
  verificarTokenJWT,
  verificarRol("Moderador"),
  aprobarObra
);

router.get(
  "/club/:clubId/mis-obras",
  verificarTokenJWT,
  listarMisObrasClub
);

/* =========================
   INICIAR VOTACIÓN (moderador)
========================= */
router.post(
  "/:id/votacion",
  verificarTokenJWT,
  verificarRol("Moderador"),
  iniciarVotacion
);

export default router;