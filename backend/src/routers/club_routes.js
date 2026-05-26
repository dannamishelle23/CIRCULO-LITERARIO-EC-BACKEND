import { Router } from "express"
import { crearClub, listarClubes, detalleClub, asignarModeradorClub, misClubesAsignados, detalleMiClub, actualizarClub, suspenderClub, reactivarClub, quitarModeradorClub } from "../controllers/club_controller.js"
import {verificarTokenJWT} from "../middlewares/JWT.js"

const router = Router()

//Crear clubes literarios (solo lo hace el administrador)
router.post("/crear-club",verificarTokenJWT,crearClub)
//Listar clubes literarios
router.get("/listar-clubes",verificarTokenJWT,listarClubes)
//Visualizar un club por ID
router.get("/detalle-club/:clubId",verificarTokenJWT,detalleClub)
//Asignar moderador a un club literario (solo lo hace el administrador)
router.patch("/asignar-moderador/:clubId/:moderadorId",verificarTokenJWT,asignarModeradorClub)
//Listar clubes literarios asignados a un moderador (solo lo ve el moderador)
router.get("/mis-clubes",verificarTokenJWT,misClubesAsignados)
//Detalle de un club literario asignado a un moderador (solo lo ve el moderador)
router.get("/mis-clubes/:clubId",verificarTokenJWT,detalleMiClub)
//Actualizar un club literario 
router.patch("/actualizar-club/:clubId",verificarTokenJWT,actualizarClub)
//Suspender un club literario (solo lo hace el administrador)
router.patch("/suspender-club/:clubId",verificarTokenJWT,suspenderClub)
//Reactivar un club literario suspendido (solo lo hace el administrador)
router.patch("/reactivar-club/:clubId",verificarTokenJWT,reactivarClub)
//Quitar un moderador de un club literario
router.patch("/quitar-moderador/:clubId/:moderadorId",verificarTokenJWT,quitarModeradorClub)

export default router