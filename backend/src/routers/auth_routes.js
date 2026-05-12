import {Router} from 'express'
import { registro, confirmarMail, recuperarPassword, comprobarTokenPassword, crearNuevoPassword, login } from '../controllers/auth_controller.js'

const router = Router()

//1. Ruta para el registro del lector y/o autor
router.post('/registro', registro)
//2. Ruta para la confirmación del email del lector y/o autor
router.get('/confirmar/:token', confirmarMail)
//3. Rutas para la recuperación de contraseña (Administrador - Moderador - Lector y/o Autor)
router.post('/recuperar-password', recuperarPassword)
router.get('/recuperar-password/:token', comprobarTokenPassword)
router.post('/nuevo-password/:token', crearNuevoPassword)

//4. Ruta para el inicio de sesión (Administrador - Moderador - Lector y/o autor)
router.post('/login',login)

export default router