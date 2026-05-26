import { Router } from "express"

import {
  solicitarUnionClub,
  listarSolicitudesClub,
  aprobarSolicitudClub,
  rechazarSolicitudClub,
  listarMiembrosClub,
  misSolicitudesUsuario
} from "../controllers/clubMiembros_controller.js"

import {verificarTokenJWT} from "../middlewares/JWT.js"

const router = Router()

// RUTAS PARA LOS USUARIOS

// SOLICITAR UNIÓN (LO HACEN LOS USUARIOS)
router.post("/unirse/:clubId",verificarTokenJWT,solicitarUnionClub)

// RUTAS PARA EL MODERADOR

// LISTAR SOLICITUDES
router.get("/solicitudes/:clubId",verificarTokenJWT,listarSolicitudesClub)

// APROBAR SOLICITUD
router.patch("/aprobar/:solicitudId",verificarTokenJWT,aprobarSolicitudClub)

// RECHAZAR SOLICITUD
router.patch("/rechazar/:solicitudId",verificarTokenJWT,rechazarSolicitudClub)

// LISTAR MIEMBROS
router.get("/visualizar/:clubId",verificarTokenJWT,listarMiembrosClub)

// LISTAR MIS SOLICITUDES (USUARIO)
router.get("/mis-solicitudes",verificarTokenJWT, misSolicitudesUsuario)

export default router