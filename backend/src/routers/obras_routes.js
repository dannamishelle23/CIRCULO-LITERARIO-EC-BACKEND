import { Router } from "express";
import {
  crearObra,
  obtenerObra,
  listarObrasClub,
  listarObrasPublicasAutor,
  listarObrasEnRevision,
  listarObrasAprobadas,
  actualizarObra,
  postularObra,
  aprobarObra,
  rechazarObra,
  iniciarVotacion,
  cerrarVotacion,
  listarMisObrasClub,
  obtenerObrasVotacionClub,
  obtenerObrasPublicadasClub,
  votarObra
} from "../controllers/obras_controller.js";

import { verificarTokenJWT } from "../middlewares/JWT.js";
import verificarRol from "../middlewares/verificarRol.js";
import verificarMiembroClub from "../middlewares/verificarMiembrosClub.js";
import verificarAutorObra from "../middlewares/verificarAutorObra.js";

const router = Router();

//CREAR OBRA (usuario lector o autor dentro del club)
router.post("/",verificarTokenJWT,crearObra);

//VER OBRAS EN VOTACION Y PUBLICADAS (USUARIOS DEL CLUB)
router.get("/obras-votacion/:clubId", verificarTokenJWT, verificarMiembroClub, obtenerObrasVotacionClub);
router.get("/obras-publicadas/:clubId", verificarTokenJWT, verificarMiembroClub, obtenerObrasPublicadasClub);

//LISTAR OBRAS PUBLICAS DE UN AUTOR (SE CONSULTA DESDE EL PERFIL PUBLICO DE CADA AUTOR)
router.get("/autor/:autorId",verificarTokenJWT,listarObrasPublicasAutor);

//OBTENER OBRA (MODERADOR)
router.get("/:id",verificarTokenJWT,obtenerObra);

//ACTUALIZAR OBRA (SOLO TITULO, PORTADA, SINOPSIS Y PROLOGO)
router.put("/:id",verificarTokenJWT,verificarAutorObra,actualizarObra);

//POSTULAR OBRA (PASA A REVISION POR EL MODERADOR)
router.post("/:id/postular",verificarTokenJWT,verificarAutorObra,postularObra);

//LISTAR OBRAS DE UN CLUB
router.get("/club/:clubId",verificarTokenJWT,verificarMiembroClub,listarObrasClub);

//LISTAR OBRAS SOLO DE UN USUARIO (MIS OBRAS)
router.get("/club/:clubId/mis-obras",verificarTokenJWT,listarMisObrasClub);


/* =========================
   MODERADORES
========================= */

//LISTAR OBRAS EN REVISIÓN DEL CLUB 
router.get("/moderador/:clubId/en-revision",verificarTokenJWT,
  verificarRol("Moderador"),
  listarObrasEnRevision
);

//LISTAR OBRAS APROBADAS DEL CLUB 
router.get(
  "/moderador/:clubId/aprobadas",
  verificarTokenJWT,
  verificarRol("Moderador"),
  listarObrasAprobadas
);

//APROBAR OBRA (LA HISTORIA PASA A APROBADA)
router.post("/:id/aprobar",verificarTokenJWT,verificarRol("Moderador"),aprobarObra);

//RECHAZAR OBRA (LA HISTORIA PASA A BORRADOR)
router.post("/:id/rechazar",
  verificarTokenJWT,
  verificarRol("Moderador"),
  rechazarObra
);

//INICIAR VOTACION
router.post(
  "/club/:clubId/iniciar-votacion",
  verificarTokenJWT,
  verificarRol("Moderador"),
  iniciarVotacion
);

/* =========================
   CERRAR VOTACIÓN (moderador)
========================= */
router.post(
  "/club/:clubId/cerrar-votacion",
  verificarTokenJWT,
  verificarRol("Moderador"),
  cerrarVotacion
);

//VOTAR OBRA PARA LEER (USUARIOS DEL CLUB)
router.post("/:id/votar",verificarTokenJWT,votarObra);

export default router;