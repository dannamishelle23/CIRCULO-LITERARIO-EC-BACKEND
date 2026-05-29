import { Router } from "express";
import {
  crearObra,
  obtenerObra,
  listarObrasClub,
  actualizarObra,
  postularObra,
  aprobarObra,
  iniciarVotacion,
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
   ACTUALIZAR OBRA (solo autor real)
========================= */
router.put(
  "/:id",
  verificarTokenJWT,
  verificarAutorObra,
  actualizarObra
);

/* =========================
   POSTULAR OBRA (solo autor real)
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