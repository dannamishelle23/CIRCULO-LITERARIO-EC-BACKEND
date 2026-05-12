import Usuarios from "../models/Usuarios.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import { sendMailToCreateModerator } from "../helpers/sendMail.js"
import {subirImagenCloudinary} from "../helpers/uploadCloudinary.js"
import mongoose from "mongoose"

//Creación de endpoint para visualizar perfil (Administrador - Moderador - Lector y/o Autor)
const perfil = (req,res) => {
  if (!req.usuarioHeader) {
    return res.status(401).json({msg: "No autorizado"})
  }
  const {token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil} = req.usuarioHeader
  res.status(200).json(datosPerfil)
}

//Creación de endpoint para actualizar el perfil (Administrador - Moderador - Lector y/o Autor)
const actualizarPerfil = async(req,res) => {
  try {
    const {id} = req.params
    const {nombres, apellidos, provincia, username, email} = req.body
    if ( !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg: "ID de usuario no válido."})
    const usuarioBDD = await Usuarios.findById(id)
    if (!usuarioBDD) return res.status(404).json({msg: "Usuario no encontrado."})
    if (Object.values(req.body).includes("")) return res.status(400).json({msg: "Debes completar todos los campos."})
    if (usuarioBDD.email !== email)
    {
      const emailExistente = await Usuarios.findOne({email})
      if (emailExistente) {
        return res.status(404).json({msg: "El email ya se encuentra registrado."})
      }
    }
    usuarioBDD.nombres = nombres ?? usuarioBDD.nombres
    usuarioBDD.apellidos = apellidos ?? usuarioBDD.apellidos
    usuarioBDD.provincia = provincia ?? usuarioBDD.provincia
    usuarioBDD.username = username ?? usuarioBDD.username
    usuarioBDD.email = email ?? usuarioBDD.email

    await usuarioBDD.save()
    res.status(200).json({msg: "Perfil actualizado con éxito."})
  } catch (error) {
    console.error(error)
    res.status(500).json({msg: `Error en el servidor - ${error}`})
  }
}

//Creación de endpoint para actualizar la contraseña (Administrador - Moderador - Lector y/o Autor)
const actualizarPassword = async(req,res) => {
  try {

    const { passwordActual, passwordNuevo } = req.body

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios."
      })
    }

    const usuarioBDD = await Usuarios.findById(req.usuarioHeader._id)

    if (!usuarioBDD) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      })
    }

    // Validar contraseña actual
    const verificarPassword =
      await usuarioBDD.matchPassword(passwordActual)

    if (!verificarPassword) {
      return res.status(400).json({
        msg: "La contraseña actual no es correcta."
      })
    }
    // Validar que el usuario no reutilice la misma contraseña al cambiar
    const mismaPassword =
      await usuarioBDD.matchPassword(passwordNuevo)

    if (mismaPassword) {
      return res.status(400).json({
        msg: "La nueva contraseña no puede ser igual a la actual."
      })
    }
    // Encriptar nueva contraseña
    usuarioBDD.password =
      await usuarioBDD.encryptPassword(passwordNuevo)

    await usuarioBDD.save()

    res.status(200).json({msg: "Contraseña actualizada con éxito."})

  } catch (error) {
    console.error(error)
    res.status(500).json({
      msg: `Error en el servidor - ${error}`
    })
  }
}

// ADMINISTRACION DE USUARIOS MODERADORES Y LECTORES/AUTORES

//1. Registro de un moderador (lo hace el administrador)
const registrarModerador = async(req,res) => {
  try {
    const {nombres, apellidos, fechaNacimiento, provincia, username, email} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg: "Debes completar todos los campos."})
    //Verificar email existente
    const emailExistente = await Usuarios.findOne({email})
    if (emailExistente) {
      return res.status(404).json({msg: "El email ya se encuentra registrado."})
    }
    //Verificar username existente
    const usernameExistente = await Usuarios.findOne({username})
    if (usernameExistente) {
      return res.status(404).json({msg: "El nombre de usuario ya existe."})
    }
    //Generar contraseña temporal
    const passwordTemporal = Math.random().toString(36).toUpperCase().slice(2,8)
    //Crear nuevo moderador
    const nuevoModerador = new Usuarios({
      nombres,
      apellidos,
      fechaNacimiento,
      provincia,
      username,
      email,
      password: await Usuarios.prototype.encryptPassword("MOD-" + passwordTemporal),
      rol: "Moderador",
      creadoPor: req.usuarioHeader._id
    })
     // Subir imagen si existe
    if (req.files?.avatar) {

      const { secure_url, public_id } =
        await subirImagenCloudinary(
          req.files.avatar.tempFilePath
        )

      nuevoModerador.avatar = secure_url
      nuevoModerador.avatarID = public_id
    }
    //Guardar moderador
    await nuevoModerador.save()
    //Enviar correo al moderador con sus credenciales de acceso
    await sendMailToCreateModerator(email, username, "MOD-" + passwordTemporal)
    res.status(200).json({msg: "Moderador registrado con éxito."})
  } catch (error) { 
    console.error(error)
    res.status(500).json({
      msg: `Error en el servidor - ${error}`
    })
  }
}

const listarModeradores = async (req, res) => {
    try {
        const moderadores = await Usuarios.find({ rol: "Moderador" })
            // 1. Excluir campos sensibles y no necesarios para la respuesta
            .select("-password -createdAt -updatedAt -__v -confirmEmail")
            // 2. Obtener el nombre de quien creó el moderador (administrador) y mostrar solo su nombre
            .populate("creadoPor", "nombres") 

        res.status(200).json({ "Moderadores registrados": moderadores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `Error en el servidor - ${error}` });
    }
};

export {
    perfil,
    actualizarPerfil,
    actualizarPassword,
    registrarModerador,
    listarModeradores
}