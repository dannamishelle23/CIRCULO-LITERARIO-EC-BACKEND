import { check } from "express-validator"
import { calcularEdad } from "../utils/calcularEdad.js"
import { provinciasEcuador } from "../utils/provinciasEcuador.js"

// REGISTRO
export const validarRegistro = [

    check("nombres")
        .notEmpty()
        .withMessage("Los nombres son obligatorios.")
        .isLength({ min: 2, max: 50 })
        .withMessage("Los nombres deben tener entre 2 y 50 caracteres.")
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("Los nombres solo pueden contener letras.")
        .trim(),

    check("apellidos")
        .notEmpty()
        .withMessage("Los apellidos son obligatorios.")
        .isLength({ min: 2, max: 50 })
        .withMessage("Los apellidos deben tener entre 2 y 50 caracteres.")
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("Los apellidos solo pueden contener letras.")
        .trim(),

    check("fechaNacimiento")
        .notEmpty()
        .withMessage("La fecha de nacimiento es obligatoria.")
        .isDate()
        .withMessage("Fecha inválida.")
        .custom((value) => {

            const fecha = new Date(value)
            const hoy = new Date()
            const año = fecha.getFullYear()

            if (isNaN(fecha.getTime())) {
                throw new Error("Fecha inválida.")
            }

            if (fecha > hoy) {
                throw new Error("La fecha no puede ser futura.")
            }

            if (año < 1900) {
                throw new Error("Fecha de nacimiento no válida.")
            }

            const edad = calcularEdad(value)

            if (edad < 13) {
                throw new Error("Debes tener al menos 13 años.")
            }

            return true
        }),

    check("provincia")
        .notEmpty()
        .withMessage("La provincia es obligatoria.")
        .isIn(provinciasEcuador)
        .withMessage("Provincia inválida."),

    check("email")
        .notEmpty()
        .withMessage("El correo es obligatorio.")
        .isEmail()
        .withMessage("Correo inválido.")
        .isLength({ max: 100 })
        .withMessage("Correo demasiado largo.")
        .normalizeEmail(),

    check("username")
        .notEmpty()
        .withMessage("El username es obligatorio.")
        .isLength({ min: 4, max: 20 })
        .withMessage("Debe tener entre 4 y 20 caracteres.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Solo letras, números y _")
        .custom((value) => {

            if (value.includes("__")) {
                throw new Error("No se permiten '__' consecutivos.")
            }

            if (value.startsWith("_") || value.endsWith("_")) {
                throw new Error("No puede iniciar o terminar con _")
            }

            return true
        })
        .trim(),

    check("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria.")
        .isLength({ min: 8, max: 30 })
        .withMessage("Debe tener entre 8 y 30 caracteres.")
        .matches(/[A-Z]/)
        .withMessage("Debe tener al menos una mayúscula.")
        .matches(/[a-z]/)
        .withMessage("Debe tener al menos una minúscula.")
        .matches(/[0-9]/)
        .withMessage("Debe tener al menos un número.")
        .matches(/[@$!%*?&]/)
        .withMessage("Debe tener al menos un símbolo especial.")
]

// =========================
// LOGIN
// =========================
export const validarLogin = [

    check("identifier")
        .notEmpty()
        .withMessage("Debes ingresar usuario o correo.")
        .isLength({ max: 100 })
        .trim(),

    check("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria.")
        .isLength({ max: 100 })
]

// =========================
// RECUPERAR PASSWORD
// =========================
export const validarRecuperarPassword = [

    check("identifier")
        .notEmpty()
        .withMessage("Debes ingresar usuario o correo.")
        .trim()
]

// =========================
// NUEVA PASSWORD
// =========================
export const validarNuevoPassword = [

    check("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria.")
        .isLength({ min: 8, max: 30 })
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .matches(/[0-9]/)
        .matches(/[@$!%*?&]/),

    check("confirmPassword")
        .notEmpty()
        .withMessage("Debes confirmar la contraseña.")
]

// =========================
// TOKEN
// =========================
export const validarToken = [

    check("token")
        .notEmpty()
        .withMessage("El token es obligatorio.")
        .isLength({ min: 20 })
        .withMessage("Token inválido.")
]