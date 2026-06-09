import Usuarios from "../models/Usuarios.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

//Registro del usuario (lector y/o autor)
const registro = async (req, res) => {
  try {
    const { email, username, password } = req.body
    console.log("BODY:", req.body)
    console.log("EMAIL:", email)
    console.log("USERNAME:", username)

    //Verificar usuario existente
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

    //Encriptar contraseña
    nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)

    //Generar token
    const token = nuevoUsuario.createToken()
    nuevoUsuario.token = token

    await nuevoUsuario.save()

    //Enviar correo (manejar errores)
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
      msg: "Error al procesar la solicitud"
    })
  }
}

//Confirmación de email para el inicio de sesión del lector o autor
const confirmarMail = async(req,res) => {
  try {
    const {token} = req.params

    // Validar que el token no esté vacío
    if (!token || token.trim() === "") {
      return res.status(400).json({msg: "Token inválido o no proporcionado."})
    }

    // Buscar el usuario por el token
    const usuarioBDD = await Usuarios.findOne({token})
    
    // Si no existe el usuario o el token no coincide
    if (!usuarioBDD) {
      return res.status(404).json({msg: "Token inválido o cuenta ya confirmada."})
    }

    // Verificar si la cuenta ya está confirmada
    if (usuarioBDD.confirmEmail === true) {
      return res.status(400).json({msg: "La cuenta ya ha sido confirmada anteriormente."})
    }

    // Actualizar el usuario: eliminar token y marcar como confirmado
    usuarioBDD.token = null
    usuarioBDD.confirmEmail = true
    await usuarioBDD.save()

    // Log para debugging
    console.log(`✓ Cuenta confirmada para usuario: ${usuarioBDD.email}`)

    res.status(200).json({
      msg: "¡Cuenta confirmada exitosamente! Ya puedes iniciar sesión.",
      usuario: {
        email: usuarioBDD.email,
        username: usuarioBDD.username,
        confirmEmail: usuarioBDD.confirmEmail
      }
    })
  } catch (error) {
    console.error("Error en confirmarMail:", error)
    res.status(500).json({msg: "Error al procesar la solicitud"})
  }
}

//Endpoint para recuperar contraseña (Administrador - Moderador - Lector y/o Autor)
const recuperarPassword = async(req,res) => {
    try {
        const {identifier} = req.body
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
        res.status(500).json({msg: "Error al procesar la solicitud"})
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
        msg: "Tu cuenta no ha sido verificada. Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión."
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

    const { nombres, apellidos, provincia, username, _id, rol, email, avatar } = usuarioBDD
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
        rol,
        avatar
      }
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({msg: "Error al procesar solicitud."})
  }
}

//Reenviar correo de confirmación
const reenviarConfirmacion = async(req,res) => {
  try {
    const {email} = req.body
    
    if (!email) {
      return res.status(400).json({msg: "El correo electrónico es obligatorio."})
    }

    // Buscar el usuario por email
    const usuario = await Usuarios.findOne({email})
    
    if (!usuario) {
      return res.status(404).json({msg: "No encontramos una cuenta con este correo electrónico."})
    }

    // Verificar si ya está confirmado
    if (usuario.confirmEmail === true) {
      return res.status(400).json({msg: "Esta cuenta ya ha sido confirmada."})
    }

    // Generar nuevo token
    const nuevoToken = usuario.createToken()
    usuario.token = nuevoToken
    await usuario.save()

    // Reenviar el correo
    try {
      await sendMailToRegister(email, nuevoToken)
      console.log(`✓ Correo de confirmación reenviado a: ${email}`)
      res.status(200).json({msg: "Correo de confirmación reenviado. Revisa tu buzón."})
    } catch (error) {
      console.error("Error reenviando correo:", error.message)
      res.status(500).json({msg: "Error al reenviar el correo. Intenta más tarde."})
    }
  } catch (error) {
    console.error("Error en reenviarConfirmacion:", error)
    res.status(500).json({msg: "Error al procesar la solicitud."})
  }
}

export {
    registro,
    confirmarMail,
    reenviarConfirmacion,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    login
}