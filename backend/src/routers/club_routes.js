import { Router } from "express"
import { crearClub, listarClubes, detalleClub, asignarModeradorClub, misClubesAsignados, detalleMiClub } from "../controllers/club_controller.js"
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


export default router