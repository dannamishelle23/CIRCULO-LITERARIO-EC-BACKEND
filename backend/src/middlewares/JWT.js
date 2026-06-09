import jwt from "jsonwebtoken"
import Usuarios from "../models/Usuarios.js"

//Crear token JWT
const crearTokenJWT = (id, rol) => {
    return jwt.sign({id, rol}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

const verificarTokenJWT = async(req,res, next) => {
  const {authorization} = req.headers
    if (!authorization) return res.status(401).json({msg: "Acceso denegado: token no proporcionado."})
    try { 
        const token = authorization.split(" ") [1]
        const {id} = jwt.verify(token, process.env.JWT_SECRET)
        const usuarioBDD = await Usuarios.findById(id)
            .lean()
            .select("-password -token")
            if (!usuarioBDD) return res.status(401).json({msg: "Usuario no encontrado."})
            req.usuarioHeader = usuarioBDD
            next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({msg: `Token inválido o expirado - ${error}.`})
    }
}

export {
    crearTokenJWT,
    verificarTokenJWT
}