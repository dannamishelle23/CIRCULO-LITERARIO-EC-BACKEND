import {Router} from 'express'
import { perfil, actualizarPerfil, actualizarPassword, registrarModerador, listarModeradores, detalleModerador, deshabilitarModerador, suspenderUsuario, reactivarUsuario, eliminarUsuario } from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()
router.get('/perfil', verificarTokenJWT, perfil)
router.patch('/actualizar-perfil/:id', verificarTokenJWT, actualizarPerfil)
router.patch('/actualizar-password', verificarTokenJWT, actualizarPassword)

//Rutas para gestionar usuarios moderadores (solo lo hace el administrador)
router.post('/crear-moderador', verificarTokenJWT, registrarModerador)
router.get('/listar-moderadores', verificarTokenJWT, listarModeradores)
router.get('/detalle-moderador/:id', verificarTokenJWT, detalleModerador)
router.patch('/deshabilitar-moderador/:id', verificarTokenJWT, deshabilitarModerador)

//Rutas para gestionar usuarios lectores/autores 
router.patch('/suspender-usuario/:id', verificarTokenJWT, suspenderUsuario)         //Lo hace el moderador y el administrador
router.patch('/reactivar-usuario/:id', verificarTokenJWT, reactivarUsuario)
router.delete('/eliminar-usuario/:id', verificarTokenJWT, eliminarUsuario)

export default router