import Usuarios from "../models/Usuarios.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import { sendMailToCreateModerator } from "../helpers/sendMail.js"
import {subirImagenCloudinary} from "../helpers/uploadCloudinary.js"
import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose"

//Creación de endpoint para visualizar perfil (Administrador - Moderador - Lector y/o Autor)
const perfil = (req, res) => {

  if (!req.usuarioHeader) {
    return res.status(401).json({
      msg: "No autorizado."
    })
  }

  const {
    token,
    confirmEmail,
    createdAt,
    updatedAt,
    __v,
    ...datosPerfil
  } = req.usuarioHeader

  res.status(200).json(datosPerfil)
}

//Actualizar perfil
const actualizarPerfil = async (req, res) => {

  try {

    const { id } = req.params

    const {
      nombres,
      apellidos,
      provincia,
      username,
      email,
      avatar
    } = req.body || {}

    const usuarioBDD = await Usuarios.findById(id)

    if (!usuarioBDD) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      })
    }

    //Debe enviar al menos un dato
    if (
      Object.keys(req.body || {}).length === 0 &&
      !req.files?.avatar
    ) {
      return res.status(400).json({
        msg: "Debes enviar al menos un campo para actualizar."
      })
    }

    //Validar email repetido
    if (email && usuarioBDD.email !== email) {

      const emailExistente = await Usuarios.findOne({ email })

      if (emailExistente) {
        return res.status(400).json({
          msg: "El correo ya se encuentra registrado."
        })
      }
    }

    //Validar username repetido
    if (username && usuarioBDD.username !== username) {

      const usernameExistente = await Usuarios.findOne({
        username
      })

      if (usernameExistente) {
        return res.status(400).json({
          msg: "El nombre de usuario ya existe."
        })
      }
    }

    //Subir avatar
    if (req.files?.avatar) {

      if (usuarioBDD.avatarID) {
        await cloudinary.uploader.destroy(
          usuarioBDD.avatarID
        )
      }

      const {
        secure_url,
        public_id
      } = await subirImagenCloudinary(
        req.files.avatar.tempFilePath,
        "Usuarios"
      )

      usuarioBDD.avatar = secure_url
      usuarioBDD.avatarID = public_id
    }

    usuarioBDD.nombres =
      nombres ?? usuarioBDD.nombres

    usuarioBDD.apellidos =
      apellidos ?? usuarioBDD.apellidos

    usuarioBDD.provincia =
      provincia ?? usuarioBDD.provincia

    usuarioBDD.username =
      username ?? usuarioBDD.username

    usuarioBDD.email =
      email ?? usuarioBDD.email

    usuarioBDD.avatar =
      avatar ?? usuarioBDD.avatar

    await usuarioBDD.save()

    const {
      token,
      confirmEmail,
      password,
      createdAt,
      updatedAt,
      __v,
      ...perfilActualizado
    } = usuarioBDD.toObject()

    res.status(200).json({
      msg: "Perfil actualizado correctamente.",
      usuario: perfilActualizado
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      msg: "Error al procesar la solicitud."
    })
  }
}

//Actualizar contraseña
const actualizarPassword = async (req, res) => {

  try {

    const {
      passwordActual,
      passwordNuevo
    } = req.body

    const usuarioBDD = await Usuarios.findById(
      req.usuarioHeader._id
    )

    if (!usuarioBDD) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      })
    }

    //Validar password actual
    const verificarPassword =
      await usuarioBDD.matchPassword(passwordActual)

    if (!verificarPassword) {
      return res.status(400).json({
        msg: "La contraseña actual no es correcta."
      })
    }

    //Evitar reutilizar contraseña
    const mismaPassword =
      await usuarioBDD.matchPassword(passwordNuevo)

    if (mismaPassword) {
      return res.status(400).json({
        msg: "La nueva contraseña no puede ser igual a la actual."
      })
    }

    //Encriptar nueva contraseña
    usuarioBDD.password =
      await usuarioBDD.encryptPassword(passwordNuevo)

    await usuarioBDD.save()

    res.status(200).json({
      msg: "Contraseña actualizada correctamente."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      msg: "Error al procesar la solicitud."
    })
  }
}

//Registrar moderador
const registrarModerador = async (req, res) => {

  try {

    const {
      nombres,
      apellidos,
      fechaNacimiento,
      provincia,
      username,
      email
    } = req.body

    //Validar email existente
    const emailExistente = await Usuarios.findOne({
      email
    })

    if (emailExistente) {
      return res.status(400).json({
        msg: "El correo ya se encuentra registrado."
      })
    }

    //Validar username existente
    const usernameExistente =
      await Usuarios.findOne({ username })

    if (usernameExistente) {
      return res.status(400).json({
        msg: "El nombre de usuario ya existe."
      })
    }

    //Password temporal
    const passwordTemporal =
      Math.random()
        .toString(36)
        .toUpperCase()
        .slice(2, 8)

    //Crear moderador
    const nuevoModerador = new Usuarios({

      nombres,
      apellidos,
      fechaNacimiento,
      provincia,
      username,
      email,

      password:
        await Usuarios.prototype.encryptPassword(
          "MOD-" + passwordTemporal
        ),

      rol: "Moderador",

      creadoPor: req.usuarioHeader._id,

      confirmEmail: true
    })

    await nuevoModerador.save()

    //Enviar credenciales
    await sendMailToCreateModerator(
      email,
      username,
      "MOD-" + passwordTemporal
    )

    res.status(200).json({
      success: true,
      message: "Moderador registrado correctamente."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud."
    })
  }
}

//Listar moderadores
const listarModeradores = async (req, res) => {

  try {

    const moderadores = await Usuarios.find({
      rol: "Moderador",
      estadoUsuario: { $ne: "Eliminado" }
    })
    .select(
      "-password -createdAt -updatedAt -__v -confirmEmail"
    )
    .populate("creadoPor", "nombres")

    res.status(200).json({
      moderadores
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: "Error al procesar la solicitud."
    })
  }
}

// Visualizar un moderador específico
const detalleModerador = async(req,res) => {

  try {
    const { id } = req.params

    // Buscar moderador
    const moderador = await Usuarios.findOne({
      _id: id,
      rol: "Moderador"
    })
    .select("-password -createdAt -updatedAt -__v -confirmEmail")
    .populate("creadoPor", "nombres apellidos email")

    // Validar existencia
    if (!moderador) {
      return res.status(404).json({
        msg: "Moderador no encontrado."
      })
    }

    // Validar estado
    if (moderador.estadoUsuario === "Eliminado") {
      return res.status(403).json({
        success: false,
        message: "El moderador fue eliminado del sistema."
      })
    }

    res.status(200).json({
      success: true,
      message: "Moderador encontrado correctamente",
      data: { moderador }
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: `Error en el servidor - ${error}`
    })
  }
}

//4. Deshabilitar moderador
const deshabilitarModerador = async(req,res) => {

  try {

    const { id } = req.params

    // Buscar moderador
    const moderadorBDD = await Usuarios.findOne({
      _id: id,
      rol: "Moderador"
    })

    // Validar existencia
    if (!moderadorBDD) {
      return res.status(404).json({
        success: false,
        message: "Moderador no encontrado."
      })
    }

    // Verificar si ya está suspendido
    if (moderadorBDD.estadoUsuario === "Suspendido") {
      return res.status(400).json({
        success: false,
        message: "El moderador ya se encuentra suspendido."
      })
    }

    // Soft delete
    moderadorBDD.estadoUsuario = "Suspendido"

    await moderadorBDD.save()

    res.status(200).json({
      success: true,
      message: "Moderador suspendido correctamente."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: `Error en el servidor - ${error}`
    })
  }
}

//Listar usuarios (solamente activos y suspendidos)
const listarUsuarios = async (req, res) => {
    try {

        const usuarios = await Usuarios.find({
            rol: "Usuario",
            estadoUsuario: { $ne: "Eliminado" }      //Excluir de la lista los usuarios eliminados
        })
        .select("-password -createdAt -updatedAt -__v -confirmEmail")
        .populate("creadoPor", "nombres")

        res.status(200).json({
          success: true,
          message: "Usuarios obtenidos correctamente", 
          data: { usuarios }
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            msg: `Error en el servidor - ${error}`
        })
    }
}

// Visualizar un usuario específico
const detalleUsuario = async(req,res) => {

  try {
    const { id } = req.params

    // Buscar usuario
    const usuario = await Usuarios.findOne({
      _id: id,
      rol: "Usuario"
    })
    .select("-password -createdAt -updatedAt -__v -confirmEmail")
    .populate("creadoPor", "nombres apellidos email")

    // Validar existencia
    if (!usuario) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      })
    }

    // Validar estado
    if (usuario.estadoUsuario === "Eliminado") {
      return res.status(403).json({
        msg: "El usuario fue eliminado del sistema."
      })
    }

    res.status(200).json({
      success: true,
      message: "Usuario encontrado correctamente",
      data: { usuario }
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      msg: `Error en el servidor - ${error}`
    })
  }
}

//Suspender usuario lector/autor
const suspenderUsuario = async(req,res) => {

  try {

    const { id } = req.params

    // Evitar auto suspensión
    if (req.usuarioHeader._id.toString() === id) {
      return res.status(400).json({
        msg: "No puedes suspender tu propia cuenta."
      })
    }

    // Buscar usuario
    const usuarioBDD = await Usuarios.findById(id)

    // Validar existencia
    if (!usuarioBDD) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      })
    }

    // Solo lectores/autores
    if (
      usuarioBDD.rol !== "Usuario"
    ) {
      return res.status(403).json({
        msg: "Solo puedes suspender usuarios lectores/autores."
      })
    }

    // Validar estado
    if (usuarioBDD.estadoUsuario === "Suspendido") {
      return res.status(400).json({
        msg: "El usuario ya se encuentra suspendido."
      })
    }

    if (usuarioBDD.estadoUsuario === "Eliminado") {
      return res.status(400).json({
        msg: "No puedes suspender un usuario eliminado."
      })
    }

    // Suspender usuario
    usuarioBDD.estadoUsuario = "Suspendido"

    await usuarioBDD.save()

    res.status(200).json({
      success: true,
      message: "Usuario suspendido correctamente."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      msg: `Error en el servidor - ${error}`
    })
  }
}

// Reactivar cuentas de usuario (moderadores o lectores/autores suspendidos)
const reactivarUsuario = async(req,res) => {

  try {

    const { id } = req.params

    // Buscar usuario
    const usuarioBDD = await Usuarios.findById(id)

    // Validar existencia
    if (!usuarioBDD) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      })
    }

    // Solo lectores/autores
    if (
      usuarioBDD.rol !== "Usuario" &&
      usuarioBDD.rol !== "Moderador"
    ) {
      return res.status(403).json({
        msg: "Solo puedes reactivar usuarios lectores/autores."
      })
    }

    // Validar estado
    if (usuarioBDD.estadoUsuario === "Activo") {
      return res.status(400).json({
        msg: "El usuario ya se encuentra activo."
      })
    }

    if (usuarioBDD.estadoUsuario === "Eliminado") {
      return res.status(400).json({
        msg: "No puedes reactivar un usuario eliminado."
      })
    }

    // Reactivar usuario
    usuarioBDD.estadoUsuario = "Activo"

    await usuarioBDD.save()

    res.status(200).json({
      success: true,
      message: `${usuarioBDD.rol} reactivado correctamente.`
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: `Error en el servidor - ${error}`
    })
  }
}

//Eliminar definitivamente un lector/autor
const eliminarUsuario = async(req,res) => {

  try {

    const { id } = req.params

    // Evitar auto eliminación
    if (req.usuarioHeader._id.toString() === id) {
      return res.status(400).json({
        msg: "No puedes eliminar tu propia cuenta."
      })
    }

    // Buscar usuario
    const usuarioBDD = await Usuarios.findById(id)

    // Validar existencia
    if (!usuarioBDD) {
      return res.status(404).json({
        msg: "Usuario no encontrado."
      })
    }

    // Solo lectores/autores
    if (
      usuarioBDD.rol !== "Usuario"
    ) {
      return res.status(403).json({
        msg: "Solo puedes eliminar usuarios lectores/autores."
      })
    }

    // Eliminación lógica
    usuarioBDD.estadoUsuario = "Eliminado"

    await usuarioBDD.save()

    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      success: false,
      message: `Error en el servidor - ${error}`
    })
  }
}

export {
    perfil,
    actualizarPerfil,
    actualizarPassword,
    registrarModerador,
    listarModeradores,
    detalleModerador,
    deshabilitarModerador,
    listarUsuarios,
    detalleUsuario,
    suspenderUsuario,
    reactivarUsuario,
    eliminarUsuario
}