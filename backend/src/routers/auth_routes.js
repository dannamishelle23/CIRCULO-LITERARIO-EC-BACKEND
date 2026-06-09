import {Router} from 'express'
import { registro, confirmarMail, reenviarConfirmacion, recuperarPassword, comprobarTokenPassword, crearNuevoPassword, login } from '../controllers/auth_controller.js'
import {
  validarRegistro,
  validarLogin,
  validarRecuperarPassword,
  validarNuevoPassword,
  validarToken
} from "../validators/auth_validator.js"

import {validarCampos} from '../middlewares/validar_campos.js'

const router = Router()

//1. Ruta para el registro del lector y/o autor
router.post('/registro', validarRegistro, validarCampos, registro)
//2. Ruta para la confirmación del email del lector y/o autor
router.get('/confirmar/:token', validarToken, validarCampos,confirmarMail)
//2.1 Ruta para reenviar correo de confirmación
router.post('/reenviar-confirmacion', validarCampos, reenviarConfirmacion)
//3. Rutas para la recuperación de contraseña (Administrador - Moderador - Lector y/o Autor)
router.post('/recuperar-password', validarRecuperarPassword, validarCampos, recuperarPassword)
router.get('/recuperar-password/:token', validarToken, validarCampos, comprobarTokenPassword)
router.post('/nuevo-password/:token', validarNuevoPassword, validarCampos, crearNuevoPassword)

//4. Ruta para el inicio de sesión (Administrador - Moderador - Lector y/o autor)
router.post('/login',validarLogin, validarCampos, login)

export default router