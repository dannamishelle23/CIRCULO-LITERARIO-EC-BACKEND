import {Router} from 'express'
import { perfil, perfilPublicoUsuario, actualizarPerfil, actualizarPassword, registrarModerador, listarModeradores, detalleModerador, deshabilitarModerador, listarUsuarios, detalleUsuario, suspenderUsuario, reactivarUsuario, eliminarUsuario } from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import { validarActualizarPerfil, validarMongoID, validarActualizarPassword, validarRegistrarModerador } from '../validators/usuario_validator.js'
import { validarCampos } from '../middlewares/validar_campos.js'

const router = Router()
router.get('/perfil', verificarTokenJWT, perfil)       //Visualizar perfil del usuario autenticado
router.get("/perfil/:id",verificarTokenJWT,validarMongoID,validarCampos, perfilPublicoUsuario)    //Visualizar perfil público de un usuario por su ID (para lectores y autores)
router.patch('/actualizar-perfil/:id', verificarTokenJWT, validarMongoID, validarActualizarPerfil, validarCampos, actualizarPerfil)
router.patch('/actualizar-password', verificarTokenJWT, validarActualizarPassword, validarCampos, actualizarPassword)

//Rutas para gestionar usuarios moderadores (solo lo hace el administrador)
router.post('/crear-moderador', verificarTokenJWT, validarRegistrarModerador, validarCampos, registrarModerador)
router.get('/listar-moderadores', verificarTokenJWT, listarModeradores)
router.get('/detalle-moderador/:id', verificarTokenJWT, validarMongoID, validarCampos, detalleModerador)
router.patch('/deshabilitar-moderador/:id', verificarTokenJWT, validarMongoID, validarCampos, deshabilitarModerador)

//Rutas para gestionar usuarios lectores/autores 
router.get('/listar-usuarios', verificarTokenJWT, listarUsuarios)         //Lo hace el moderador y el administrador
router.get('/detalle-usuario/:id', verificarTokenJWT, validarMongoID, validarCampos, detalleUsuario)     //Lo hace el moderador y el administrador
router.patch('/suspender-usuario/:id', verificarTokenJWT, validarMongoID, validarCampos, suspenderUsuario)         //Lo hace el moderador y el administrador
router.patch('/reactivar-usuario/:id', verificarTokenJWT, validarMongoID, validarCampos, reactivarUsuario)
router.delete('/eliminar-usuario/:id', verificarTokenJWT, validarMongoID, validarCampos, eliminarUsuario)

export default router