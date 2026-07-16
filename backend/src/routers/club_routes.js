import { Router } from "express"
import { crearClub, listarClubes, detalleClub, asignarModeradorClub, misClubesAsignados, detalleMiClub, actualizarClub, suspenderClub, reactivarClub, quitarModeradorClub } from "../controllers/club_controller.js"
import {verificarTokenJWT} from "../middlewares/JWT.js"
import verificarRol from "../middlewares/verificarRol.js"

const router = Router()

//Crear clubes literarios (solo lo hace el administrador)
router.post("/crear-club",verificarTokenJWT,verificarRol("Administrador"),crearClub)
//Listar clubes literarios
router.get("/listar-clubes",verificarTokenJWT,listarClubes)
//Visualizar un club por ID
router.get("/detalle-club/:clubId",verificarTokenJWT,detalleClub)
//Asignar moderador a un club literario (solo lo hace el administrador)
router.patch("/asignar-moderador/:clubId/:moderadorId",verificarTokenJWT,verificarRol("Administrador"),asignarModeradorClub)
//Listar clubes literarios asignados a un moderador (solo lo ve el moderador)
router.get("/mis-clubes",verificarTokenJWT,verificarRol("Moderador"),misClubesAsignados)
//Detalle de un club literario asignado a un moderador (solo lo ve el moderador)
router.get("/mis-clubes/:clubId",verificarTokenJWT,verificarRol("Moderador"),detalleMiClub)
//Actualizar un club literario (solo lo hace el administrador)
router.patch("/actualizar-club/:clubId",verificarTokenJWT,verificarRol("Administrador"),actualizarClub)
//Suspender un club literario (solo lo hace el administrador)
router.patch("/suspender-club/:clubId",verificarTokenJWT,verificarRol("Administrador"),suspenderClub)
//Reactivar un club literario suspendido (solo lo hace el administrador)
router.patch("/reactivar-club/:clubId",verificarTokenJWT,verificarRol("Administrador"),reactivarClub)
//Quitar un moderador de un club literario
router.patch("/quitar-moderador/:clubId/:moderadorId",verificarTokenJWT,verificarRol("Administrador"),quitarModeradorClub)

export default router