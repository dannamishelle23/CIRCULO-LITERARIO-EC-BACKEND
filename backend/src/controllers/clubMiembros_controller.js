import mongoose from "mongoose"
import ClubMiembros from "../models/ClubMiembros.js"
import Club from "../models/Clubes.js"

// SOLICITAR UNIÓN A CLUB (lector/autor)
const solicitarUnionClub = async (req,res) => {

  try {
    const usuario = req.usuarioHeader
    const { clubId } = req.params

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ msg: "ID inválido." })
    }

    const club = await Club.findById(clubId)

    if (!club) {
      return res.status(404).json({ msg: "Club no encontrado." })
    }

    if (club.estadoClub !== "Activo") {
      return res.status(403).json({
        msg: "No puedes unirte a un club inactivo."
      })
    }

    const solicitudExistente = await ClubMiembros.findOne({
      club: clubId,
      usuario: usuario._id
    })

    if (solicitudExistente) {
      return res.status(400).json({
        msg: "Ya tienes una solicitud o membresía en este club."
      })
    }

    const nuevaSolicitud = new ClubMiembros({
      club: clubId,
      usuario: usuario._id
    })

    await nuevaSolicitud.save()

    res.status(201).json({
      ok: true,
      msg: "¡Solicitud enviada al moderador correctamente!"
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}


// LISTAR SOLICITUDES PENDIENTES (moderador)
const listarSolicitudesClub = async (req,res) => {

  try {
    const moderador = req.usuarioHeader
    const { clubId } = req.params

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return res.status(400).json({ msg: "ID inválido." })
    }

    const club = await Club.findById(clubId)

    if (!club) {
      return res.status(404).json({ msg: "Club no encontrado." })
    }

    const esModeradorClub = club.moderadores
      .some(id => id.toString() === moderador._id.toString())

    if (!esModeradorClub) {
      return res.status(403).json({
        msg: "No tienes permisos sobre este club."
      })
    }

    const solicitudes = await ClubMiembros.find({
      club: clubId,
      estadoSolicitud: "Pendiente"
    }).populate("usuario", "nombres apellidos email username")

    res.status(200).json({ ok: true, solicitudes })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}


// APROBAR SOLICITUD
const aprobarSolicitudClub = async (req,res) => {

  try {
    const moderador = req.usuarioHeader
    const { solicitudId } = req.params

    if (!mongoose.Types.ObjectId.isValid(solicitudId)) {
      return res.status(400).json({ msg: "ID inválido." })
    }

    const solicitud = await ClubMiembros.findById(solicitudId).populate("club")

    if (!solicitud) {
      return res.status(404).json({ msg: "Solicitud no encontrada." })
    }

    const esModeradorClub = solicitud.club.moderadores
      .some(id => id.toString() === moderador._id.toString())

    if (!esModeradorClub) {
      return res.status(403).json({
        msg: "No tienes permisos sobre este club."
      })
    }

    if (solicitud.estadoSolicitud !== "Pendiente") {
      return res.status(400).json({
        msg: "La solicitud ya fue procesada."
      })
    }

    solicitud.estadoSolicitud = "Aprobado"
    solicitud.aprobadoPor = moderador._id

    await solicitud.save()

    res.status(200).json({
      ok: true,
      msg: "Usuario aprobado correctamente."
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}


// RECHAZAR SOLICITUD
const rechazarSolicitudClub = async (req,res) => {

  try {
    const moderador = req.usuarioHeader
    const { solicitudId } = req.params

    if (!mongoose.Types.ObjectId.isValid(solicitudId)) {
      return res.status(400).json({ msg: "ID inválido." })
    }

    const solicitud = await ClubMiembros.findById(solicitudId).populate("club")

    if (!solicitud) {
      return res.status(404).json({ msg: "Solicitud no encontrada." })
    }

    const esModeradorClub = solicitud.club.moderadores
      .some(id => id.toString() === moderador._id.toString())

    if (!esModeradorClub) {
      return res.status(403).json({
        msg: "No tienes permisos sobre este club."
      })
    }

    if (solicitud.estadoSolicitud !== "Pendiente") {
      return res.status(400).json({
        msg: "La solicitud ya fue procesada."
      })
    }

    solicitud.estadoSolicitud = "Rechazado"
    solicitud.aprobadoPor = moderador._id

    await solicitud.save()

    res.status(200).json({
      ok: true,
      msg: "Solicitud rechazada correctamente."
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      ok: false,
      msg: `Error en el servidor - ${error}`
    })
  }
}


// LISTAR MIEMBROS APROBADOS (CORREGIDO)
const listarMiembrosClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const miembros = await ClubMiembros.find({
      club: clubId,
      estadoSolicitud: "Aprobado"
    })
    .populate("usuario", "nombres apellidos username avatar");

    res.status(200).json({
      ok: true,
      miembros
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en servidor"
    });
  }
};

// LISTAR MIS SOLICITUDES DE CLUBES (LECTOR/AUTOR)
const misSolicitudesUsuario = async (req, res) => {
  try {
    const usuario = req.usuarioHeader;

    const solicitudes = await ClubMiembros.find({
      usuario: usuario._id
    }).select("club estadoSolicitud");

    res.status(200).json({
      ok: true,
      solicitudes
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error en servidor"
    });
  }
};

export {
  solicitarUnionClub,
  listarSolicitudesClub,
  aprobarSolicitudClub,
  rechazarSolicitudClub,
  listarMiembrosClub,
  misSolicitudesUsuario
}