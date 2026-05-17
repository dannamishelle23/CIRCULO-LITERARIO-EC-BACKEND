import { Router } from "express"
import { crearClub, listarClubes, asignarModeradorClub } from "../controllers/club_controller.js"
import {verificarTokenJWT} from "../middlewares/JWT.js"

const router = Router()

//Crear clubes literarios (solo lo hace el administrador)
router.post("/crear-club",verificarTokenJWT,crearClub)
//Listar clubes literarios
router.get("/listar-clubes",verificarTokenJWT,listarClubes)
//Asignar moderador a un club literario (solo lo hace el administrador)
router.patch("/asignar-moderador/:clubId/:moderadorId",verificarTokenJWT,asignarModeradorClub)

export default router