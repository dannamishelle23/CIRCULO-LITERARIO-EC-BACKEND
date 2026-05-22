import { validationResult } from "express-validator"

export const validarCampos = (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {

        const erroresFormateados = {}

        errors.array().forEach(error => {

            if (!erroresFormateados[error.path]) {
                erroresFormateados[error.path] = []
            }

            erroresFormateados[error.path].push(error.msg)
        })

        return res.status(400).json({
            msg: "Error de validación",
            errors: erroresFormateados
        })
    }

    next()
}