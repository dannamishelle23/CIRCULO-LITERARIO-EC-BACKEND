import { check, param } from "express-validator"
import { calcularEdad } from "../utils/calcularEdad.js"
import { provinciasEcuador } from "../utils/provinciasEcuador.js"

// =========================
// VALIDAR ID
// =========================
export const validarMongoID = [

    param("id")
        .isMongoId()
        .withMessage("ID inválido.")
]

// =========================
// ACTUALIZAR PERFIL
// =========================
export const validarActualizarPerfil = [

    check("nombres")
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("Los nombres deben tener entre 2 y 50 caracteres.")
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("Solo se permiten letras.")
        .trim(),

    check("apellidos")
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("Los apellidos deben tener entre 2 y 50 caracteres.")
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("Solo se permiten letras.")
        .trim(),

    check("provincia")
        .optional()
        .isIn(provinciasEcuador)
        .withMessage("Provincia inválida.")
        .trim(),

    check("username")
        .optional()
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

    check("email")
        .optional()
        .isEmail()
        .withMessage("Correo inválido.")
        .isLength({ max: 100 })
        .normalizeEmail()
]

// =========================
// PASSWORD ACTUALIZAR
// =========================
export const validarActualizarPassword = [

    check("passwordActual")
        .notEmpty()
        .withMessage("La contraseña actual es obligatoria."),

    check("passwordNuevo")
        .notEmpty()
        .withMessage("La nueva contraseña es obligatoria.")
        .isLength({ min: 8, max: 30 })
        .withMessage("Debe tener entre 8 y 30 caracteres.")
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .matches(/[0-9]/)
        .matches(/[@$!%*?&]/)
]

// =========================
// REGISTRAR MODERADOR
// =========================
export const validarRegistrarModerador = [

    check("nombres")
        .notEmpty()
        .withMessage("Los nombres son obligatorios.")
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("Solo letras permitidas.")
        .trim(),

    check("apellidos")
        .notEmpty()
        .withMessage("Los apellidos son obligatorios.")
        .isLength({ min: 2, max: 50 })
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("Solo letras permitidas.")
        .trim(),

    check("fechaNacimiento")
        .notEmpty()
        .withMessage("La fecha de nacimiento es obligatoria.")
        .isDate()
        .withMessage("Fecha inválida.")
        .custom((value) => {

            const fecha = new Date(value)
            const hoy = new Date()

            if (isNaN(fecha.getTime())) {
                throw new Error("Fecha inválida.")
            }

            if (fecha > hoy) {
                throw new Error("La fecha no puede ser futura.")
            }

            const año = fecha.getFullYear()

            if (año < 1900) {
                throw new Error("Fecha no válida.")
            }

            const edad = calcularEdad(value)

            if (edad < 18) {
                throw new Error("El moderador debe ser mayor de edad.")
            }

            return true
        }),

    check("provincia")
        .notEmpty()
        .withMessage("La provincia es obligatoria.")
        .isIn(provinciasEcuador)
        .withMessage("Provincia inválida.")
        .trim(),

    check("username")
        .notEmpty()
        .withMessage("El username es obligatorio.")
        .isLength({ min: 4, max: 20 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Solo letras, números y _")
        .trim(),

    check("email")
        .notEmpty()
        .withMessage("El correo es obligatorio.")
        .isEmail()
        .withMessage("Correo inválido.")
        .normalizeEmail()
]