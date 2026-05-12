import {Router} from 'express'
import { perfil, actualizarPerfil, actualizarPassword, registrarModerador, listarModeradores } from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()
router.get('/perfil', verificarTokenJWT, perfil)
router.patch('/actualizar-perfil/:id', verificarTokenJWT, actualizarPerfil)
router.patch('/actualizar-password', verificarTokenJWT, actualizarPassword)

//Rutas para gestionar usuarios moderadores (solo lo hace el administrador)
router.post('/crear-moderador', verificarTokenJWT, registrarModerador)
router.get('/listar-moderadores', verificarTokenJWT, listarModeradores)

export default router