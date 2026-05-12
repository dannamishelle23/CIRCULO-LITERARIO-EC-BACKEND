import Usuarios from "../models/Usuarios.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

//Registro del usuario (lector y/o autor)
const registro = async (req, res) => {
  try {
    const { email, username, password } = req.body

    if (Object.values(req.body).includes("")) {
      return res.status(400).json({
        msg: "Todos los campos deben ser completados de forma obligatoria."
      })
    }

    const usuarioExistente = await Usuarios.findOne({
      $or: [{ email }, { username }]
    })

    if (usuarioExistente) {
      return res.status(400).json({
        msg: "El correo o el nombre del usuario ya se encuentran registrados."
      })
    }

    const nuevoUsuario = new Usuarios({
      ...req.body,
      rol: "Usuario"
    })

    nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)

    const token = nuevoUsuario.createToken()
    nuevoUsuario.token = token

    await nuevoUsuario.save()

    //Envío de manejo con manejo de errores
    try {
      await sendMailToRegister(email, token)
      console.log("Correo enviado correctamente")
    } catch (error) {
      console.log("Error enviando correo:", error.message)
    }

    res.status(200).json({
      msg: "Usuario registrado. Revisa tu correo para confirmar tu cuenta."
    })

  } catch (error) {
    res.status(500).json({
      msg: `Error en el servidor - ${error.message}`
    })
  }
}

//Confirmación de email para el inicio de sesión del lector o autor
const confirmarMail = async(req,res) => {
  try {
    const {token} = req.params
    const usuarioBDD = await Usuarios.findOne({token})
    if (!usuarioBDD) return res.status(404).json({msg: "Token inválido o cuenta ya confirmada."})
    usuarioBDD.token = null
    usuarioBDD.confirmEmail = true
    await usuarioBDD.save()
    res.status(200).json({msg: "Cuenta confirmada, ya puedes iniciar sesión."})
  } catch (error) {
    console.error(error)
    res.status(500).json({msg: `Error al procesar la solicitud - ${error}`})
  }
}

//Endpoint para recuperar contraseña (Administrador - Moderador - Lector y/o Autor)
const recuperarPassword = async(req,res) => {
    try {
        const {identifier} = req.body
        if (!identifier) return res.status(400).json({msg: "Debes ingresar tu correo o nombre de usuario."})
        const usuario = await Usuarios.findOne({
          $or: [
            {email: identifier},
            {username: identifier}
          ]
        })
        //Estrategia de seguridad (no revelar si el username o el correo existen o no en la BDD)
        if (!usuario) {
          return res.status(200).json({msg: "Si el usuario existe, recibirás un correo para reestablecer tu contraseña."})
        }
        const token = usuario.createToken()
        usuario.token = token
        await usuario.save()
        await sendMailToRecoveryPassword(usuario.email,token)
        res.status(200).json({msg: "Si el usuario existe, recibirás un correo electrónico para reestablecer tu contraseña."})
    } catch(error) {
        console.error(error)
        res.status(500).json({msg: `Error al procesar la solicitud - ${error}`})
    }
}

const comprobarTokenPassword = async(req,res) => {
  try {
    const {token} = req.params
    const usuarioBDD = await Usuarios.findOne({token})
    if(!usuarioBDD) return res.status(400).json({msg: "No se pudo validar su cuenta. El token es inválido o ya expiró."})
    return res.status(200).json({
      msg: "Token confirmado, ya puedes crear tu nueva contraseña."})
  } catch (error) {
        console.error(error)
        res.status(500).json({msg: `Error al procesar la solicitud - ${error}`})
  }
}

//Crear nueva contraseña
const crearNuevoPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body
    const { token } = req.params

    if (!password || !confirmPassword) {
      return res.status(400).json({
        msg: "Debes llenar todos los campos de forma obligatoria."
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: "La contraseña debe tener mínimo 6 caracteres."
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        msg: "Las contraseñas no coinciden."
      })
    }

    const usuario = await Usuarios.findOne({ token })

    if (!usuario) {
      return res.status(400).json({
        msg: "Token inválido o expirado."
      })
    }

    usuario.password = await usuario.encryptPassword(password)
    usuario.token = null

    await usuario.save()

    return res.status(200).json({
      msg: "Contraseña restablecida exitosamente. Ya puedes iniciar sesión."
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      msg: "Error al procesar la solicitud."
    })
  }
}

//Login del usuario (Administrador - Moderador - Lector y/o Autor)
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({
        msg: "Debes completar todos los campos."
      })
    }

    // Buscar al usuario por email o username
    const usuarioBDD = await Usuarios.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    }).select("-__v -token -updatedAt")

    if (!usuarioBDD) {
      return res.status(401).json({
        msg: "Correo, nombre de usuario o contraseña incorrectos."
      })
    }
    if (!usuarioBDD.confirmEmail) {
      return res.status(403).json({
        msg: "Debes verificar tu cuenta antes de iniciar sesión."
      })
    }

    if (usuarioBDD.estadoUsuario !== "Activo") {
      return res.status(403).json({
        msg: "Tu cuenta no está disponible."
      })
    }

    const verificarPassword = await usuarioBDD.matchPassword(password)

    if (!verificarPassword) {
      return res.status(401).json({
        msg: "Correo, nombre de usuario o contraseña incorrectos."
      })
    }

    const { nombres, apellidos, provincia, username, _id, rol, email } = usuarioBDD
    const token = crearTokenJWT(usuarioBDD._id, usuarioBDD.rol)

    return res.status(200).json({
      msg: "Inicio de sesión exitoso.",
      usuario: {
        _id,
        token,
        nombres,
        apellidos,
        provincia,
        username,
        email,
        rol
      }
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({msg: "Error al procesar solicitud."})
  }
}

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login
}