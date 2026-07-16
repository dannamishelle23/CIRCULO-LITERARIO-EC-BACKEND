import jwt from "jsonwebtoken"
import Usuarios from "../models/Usuarios.js"

//Crear token JWT
const crearTokenJWT = (id, rol) => {
    return jwt.sign({id, rol}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

const verificarTokenJWT = async(req,res, next) => {
  const authorizationHeader = req.headers.authorization || req.headers.Authorization

  if (!authorizationHeader) {
    return res.status(401).json({msg: "Acceso denegado: token no proporcionado."})
  }

  try {
    const token = authorizationHeader.startsWith("Bearer ") || authorizationHeader.startsWith("bearer ")
      ? authorizationHeader.split(/\s+/)[1]
      : authorizationHeader

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const usuarioBDD = await Usuarios.findById(decodedToken.id || decodedToken._id)
      .lean()
      .select("-password -token")

    if (!usuarioBDD) {
      return res.status(401).json({msg: "Usuario no encontrado."})
    }

    req.usuarioHeader = {
      ...usuarioBDD,
      rol: usuarioBDD.rol || decodedToken.rol
    }
    req.user = req.usuarioHeader
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