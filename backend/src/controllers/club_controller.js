import Club from "../models/Clubes.js"
import mongoose from "mongoose";
import Usuarios from "../models/Usuarios.js"
import { subirImagenCloudinary, eliminarImagenCloudinary} from "../helpers/uploadCloudinary.js";

//Crear clubes literarios (solo lo hace el administrador)
const crearClub = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      generoLiterario
    } = req.body

    if (
      Object.values({
        nombre,
        descripcion,
        generoLiterario
      }).includes("")
    ) {
      return res.status(400).json({
        msg: "Debes completar todos los campos."
      })
    }

    // Verificar si ya existe un club del género
    const clubExistente = await Club.findOne({
      generoLiterario
    })

    if (clubExistente) {
      return res.status(400).json({
        msg: `Ya existe un club del género ${generoLiterario}.`
      })
    }

    const nuevoClub = new Club({
      nombre,
      descripcion,
      generoLiterario,
      creadoPor: req.usuarioHeader._id
    })

    // Subir portada
    if (req.files?.portada) {

      const { secure_url, public_id } =
        await subirImagenCloudinary(
          req.files.portada.tempFilePath,
          "Clubes"
        )

      nuevoClub.portada = secure_url
      nuevoClub.portadaID = public_id
    }

    await nuevoClub.save()

    res.status(201).json({
      msg: "Club literario creado con éxito."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      msg: `Error en el servidor - ${error}`
    })
  }
}

// Listar clubes literarios 
const listarClubes = async (req, res) => {
  try {

    let filtro = {}

    // USUARIO NORMAL
    if (req.usuarioHeader.rol === "Usuario") {

      filtro.estadoClub = "Activo"

    }

    // MODERADOR
    else if (req.usuarioHeader.rol === "Moderador") {

      filtro.estadoClub = {
        $in: ["Activo", "Suspendido"]
      }

    }

    // ADMINISTRADOR
    const clubes = await Club.find(filtro)
      .select("-createdAt -updatedAt -__v")
      .populate(
        "moderadores",
        "nombres apellidos email estadoUsuario avatar"
      )

    if (clubes.length === 0) {
      return res.status(404).json({
        msg: "No existen clubes registrados."
      })

    }

    res.status(200).json({
      ok: true,
      msg: "Clubes obtenidos correctamente",
      clubes
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      msg: `Error en el servidor - ${error}`
    })
  }
}

// DETALLE DE CLUB POR ID
const detalleClub = async (req, res) => {

  try {

    const { clubId } = req.params

    // VALIDAR ID
    if (!mongoose.Types.ObjectId.isValid(clubId)) {

      return res.status(400).json({
        msg: "ID inválido."
      })
    }

    // BUSCAR CLUB
    const club = await Club.findById(clubId)
      .select("-createdAt -updatedAt -__v")
      .populate(
        "moderadores",
        "nombres apellidos email estadoUsuario avatar"
      )

    // VALIDAR EXISTENCIA
    if (!club) {

      return res.status(404).json({
        msg: "Club no encontrado."
      })
    }

    res.status(200).json({
      ok: true,
      msg: "Info del club obtenida correctamente",
      club
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}  

//Asignar moderadores a clubes literarios (solo lo hace el administrador)
const asignarModeradorClub = async (req, res) => {

  try {

    const { clubId, moderadorId } = req.params

    // VALIDAR IDS
    if (
      !mongoose.Types.ObjectId.isValid(clubId) ||
      !mongoose.Types.ObjectId.isValid(moderadorId)
    ) {
      return res.status(400).json({
        msg: "IDs inválidos."
      })
    }

    // BUSCAR CLUB
    const club = await Club.findById(clubId)

    if (!club) {
      return res.status(404).json({
        msg: "Club no encontrado."
      })
    }

    // VALIDAR ESTADO DEL CLUB
    if (club.estadoClub !== "Activo") {
      return res.status(403).json({
        msg: "No se pueden asignar moderadores a clubes suspendidos."
      })
    }

    // BUSCAR MODERADOR
    const moderador = await Usuarios.findOne({
      _id: moderadorId,
      rol: "Moderador"
    })

    if (!moderador) {
      return res.status(404).json({
        msg: "Moderador no encontrado."
      })
    }

    // VALIDAR ESTADO
    if (moderador.estadoUsuario !== "Activo") {
      return res.status(403).json({
        msg: "Solo se pueden asignar moderadores activos."
      })
    }

    // VALIDAR SI YA ESTÁ ASIGNADO
    const moderadorAsignado =
      club.moderadores.includes(moderadorId)

    if (moderadorAsignado) {
      return res.status(400).json({
        msg: "El moderador ya pertenece a este club."
      })
    }

    // AGREGAR MODERADOR
    club.moderadores.push(moderadorId)

    await club.save()

    res.status(200).json({
      msg: "Moderador asignado al club con éxito."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      msg: `Error en el servidor - ${error}`
    })
  }
}

// MIS CLUBES ASIGNADOS
const misClubesAsignados = async (
  req,
  res
) => {

  try {

    const usuario =
      req.usuarioHeader

    /* VALIDAR ROL */
    if (
      usuario.rol !== "Moderador"
    ) {

      return res.status(403).json({
        ok: false,
        msg:
          "Solo los moderadores pueden consultar clubes asignados."
      })
    }

    const clubes = await Club.find({
      moderadores: usuario._id
    })
      .select(
        "-createdAt -updatedAt -__v"
      )
      .populate(
        "moderadores",
        "nombres apellidos email estadoUsuario avatar"
      )

    if (clubes.length === 0) {

      return res.status(404).json({
        ok: false,
        msg:
          "No tienes clubes asignados."
      })
    }

    res.status(200).json({
      ok: true,
      msg:
        "Clubes asignados obtenidos correctamente.",
      clubes
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      ok: false,
      msg:
        `Error en el servidor - ${error}`
    })
  }
}

// DETALLE DE MI CLUB ASIGNADO
const detalleMiClub = async (req, res) => {

  try {

    const moderadorId =
      req.usuarioHeader._id

    const { clubId } = req.params

    // VALIDAR ID
    if (!mongoose.Types.ObjectId.isValid(clubId)) {

      return res.status(400).json({
        msg: "ID inválido."
      })
    }

    // BUSCAR CLUB
    const club = await Club.findOne({
      _id: clubId,
      moderadores: moderadorId
    })
      .select("-createdAt -updatedAt -__v")
      .populate(
        "moderadores",
        "nombres apellidos email estadoUsuario avatar"
      )

    if (!club) {

      return res.status(404).json({
        msg: "Club no encontrado o no tienes acceso."
      })
    }

    res.status(200).json({
      ok: true,
      msg: "Info del club obtenida correctamente",
      club
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}

// ACTUALIZAR CLUB
const actualizarClub = async (req, res) => {

  try {

    const { clubId } = req.params

    const {
      nombre,
      descripcion
    } = req.body

    // VALIDAR ID
    if (!mongoose.Types.ObjectId.isValid(clubId)) {

      return res.status(400).json({
        msg: "ID inválido."
      })
    }

    // BUSCAR CLUB
    const club = await Club.findById(clubId)

    if (!club) {

      return res.status(404).json({
        msg: "Club no encontrado."
      })
    }

    // ACTUALIZAR CAMPOS
    if (nombre) {
      club.nombre = nombre
    }

    if (descripcion) {
      club.descripcion = descripcion
    }

    // ACTUALIZAR PORTADA
    if (req.files?.portada) {

      // ELIMINAR ANTERIOR
      if (club.portadaID) {

        await eliminarImagenCloudinary(
          club.portadaID
        )
      }

      // SUBIR NUEVA
      const {
        secure_url,
        public_id
      } = await subirImagenCloudinary(
        req.files.portada.tempFilePath,
        "Clubes"
      )

      club.portada = secure_url
      club.portadaID = public_id
    }

    await club.save()

    res.status(200).json({
      ok: true,
      msg: "Club actualizado correctamente.",
      club
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}

// SUSPENDER CLUB
const suspenderClub = async (req, res) => {

  try {

    const { clubId } = req.params

    // VALIDAR ID
    if (!mongoose.Types.ObjectId.isValid(clubId)) {

      return res.status(400).json({
        msg: "ID inválido."
      })
    }

    const club = await Club.findById(clubId)

    if (!club) {

      return res.status(404).json({
        msg: "Club no encontrado."
      })
    }

    if (club.estadoClub === "Suspendido") {

      return res.status(400).json({
        msg: "El club ya está suspendido."
      })
    }

    club.estadoClub = "Suspendido"

    await club.save()

    res.status(200).json({
      ok: true,
      msg: "Club suspendido correctamente."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}

// REACTIVAR CLUB
const reactivarClub = async (req, res) => {

  try {

    const { clubId } = req.params

    // VALIDAR ID
    if (!mongoose.Types.ObjectId.isValid(clubId)) {

      return res.status(400).json({
        msg: "ID inválido."
      })
    }

    const club = await Club.findById(clubId)

    if (!club) {

      return res.status(404).json({
        msg: "Club no encontrado."
      })
    }

    club.estadoClub = "Activo"

    await club.save()

    res.status(200).json({
      ok: true,
      msg: "Club reactivado correctamente."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}

// QUITAR MODERADOR DEL CLUB
const quitarModeradorClub = async (
  req,
  res
) => {

  try {

    const {
      clubId,
      moderadorId
    } = req.params

    // VALIDAR IDS
    if (
      !mongoose.Types.ObjectId.isValid(clubId) ||
      !mongoose.Types.ObjectId.isValid(moderadorId)
    ) {

      return res.status(400).json({
        msg: "IDs inválidos."
      })
    }

    // BUSCAR CLUB
    const club = await Club.findById(clubId)

    if (!club) {

      return res.status(404).json({
        msg: "Club no encontrado."
      })
    }

    // VALIDAR SI EXISTE
    const existeModerador =
      club.moderadores.includes(moderadorId)

    if (!existeModerador) {

      return res.status(400).json({
        msg: "El moderador no pertenece al club."
      })
    }

    // ELIMINAR MODERADOR
    club.moderadores =
      club.moderadores.filter(
        (id) => id.toString() !== moderadorId
      )

    await club.save()

    res.status(200).json({
      ok: true,
      msg:
        "Moderador removido del club correctamente."
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      ok: false,
      msg:
        `Error en el servidor - ${error}`
    })
  }
}

export {
  crearClub,
  listarClubes,
  detalleClub,
  asignarModeradorClub,
  misClubesAsignados,
  detalleMiClub,
  actualizarClub,
  suspenderClub,
  reactivarClub,
  quitarModeradorClub
}