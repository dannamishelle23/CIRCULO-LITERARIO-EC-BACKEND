import Obra from "../models/Obras.js";
import Capitulo from "../models/Capitulos.js";
import Club from "../models/Clubes.js";
import ClubMiembros from "../models/ClubMiembros.js";
import { subirImagenCloudinary } from "../helpers/uploadCloudinary.js";

// =========================
// CREAR OBRA
// =========================
export const crearObra = async (req, res) => {
  try {

    const { titulo, sinopsis, prologo, club } = req.body;

    if (!titulo || !sinopsis || !prologo || !club) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios."
      });
    }

    const clubExiste = await Club.findById(club);

    if (!clubExiste) {
      return res.status(404).json({
        msg: "Club no encontrado."
      });
    }

    if (clubExiste.estadoClub !== "Activo") {
      return res.status(400).json({
        msg:
          "No puedes publicar obras en un club suspendido."
      });
    }

    const miembro = await ClubMiembros.findOne({
        club,
        usuario:
          req.usuarioHeader._id,
        estadoSolicitud:
          "Aprobado"
      });

    if (!miembro) {
      return res.status(403).json({
        msg:
          "Debes ser miembro aprobado del club."
      });
    }

    if (!req.files?.portada) {
      return res.status(400).json({
        msg: "La portada es obligatoria."
      });
    }

    const { secure_url, public_id } =
      await subirImagenCloudinary(
        req.files.portada.tempFilePath,
        "obras"
      );

    const obra = new Obra({
      titulo,
      sinopsis,
      prologo,
      portada: secure_url,
      portadaID: public_id,
      autor: req.usuarioHeader._id,
      club
    });

    await obra.save();

    res.status(201).json({
      ok: true,
      msg: "Obra creada correctamente.",
      obra
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      msg: "Error al crear obra."
    });
  }
};

// =========================
// OBTENER OBRA
// =========================
export const obtenerObra = async (req, res) => {
  try {

    const { id } = req.params;

    const obra = await Obra.findById(id)
      .populate(
        "autor",
        "nombres apellidos username avatar"
      )
      .populate(
        "club",
        "nombre generoLiterario"
      );

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada."
      });
    }

    const response = {
      _id: obra._id,
      titulo: obra.titulo,
      sinopsis: obra.sinopsis,
      prologo: obra.prologo,
      portada: obra.portada,
      estado: obra.estado,
      autor: obra.autor,
      club: obra.club,
      votos: obra.votos.length,
      fechaInicioVotacion: obra.fechaInicioVotacion,
      fechaFinVotacion: obra.fechaFinVotacion,
      motivoRechazo: obra.motivoRechazo
    };

    if (
      obra.estado === "Publicada"
    ) {
      const capitulos = await Capitulo.find({
        obra: obra._id,
        activo: true
      }).sort({
        numeroCapitulo: 1
      });

      response.capitulos = capitulos;
    }

    res.status(200).json({
      ok: true,
      obra: response
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al obtener obra."
    });
  }
};

// =========================
// LISTAR OBRAS DE UN CLUB
// =========================
export const listarObrasClub = async (req, res) => {
  try {

    const { clubId } = req.params;

    const obras = await Obra.find({
      club: clubId,
      activo: true,
      estado: {
        $in: [
          "Aprobada",
          "EnVotacion",
          "Ganadora",
          "Publicada"
        ]
      }
    })
      .populate(
        "autor",
        "nombres apellidos username avatar"
      )
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      ok: true,
      obras
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al listar obras."
    });
  }
};

// =========================
// LISTAR OBRAS EN REVISIÓN DE UN CLUB (para moderadores)
// =========================
export const listarObrasEnRevision = async (req, res) => {
  try {
    const { clubId } = req.params;

    const obras = await Obra.find({
      club: clubId,
      activo: true,
      estado: "EnRevision"
    })
      .populate("autor", "nombres apellidos username avatar email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      ok: true,
      obras
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al listar obras en revisión."
    });
  }
};

// =========================
// LISTAR OBRAS APROBADAS DE UN CLUB (para poner a votación)
// =========================
export const listarObrasAprobadas = async (req, res) => {
  try {
    const { clubId } = req.params;

    const obras = await Obra.find({
      club: clubId,
      activo: true,
      estado: "Aprobada"
    })
      .populate("autor", "nombres apellidos username avatar email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      ok: true,
      obras
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al listar obras aprobadas."
    });
  }
};

// =========================
// ACTUALIZAR OBRA
// =========================
export const actualizarObra = async (req, res) => {
  try {

    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada."
      });
    }

    if (
      obra.autor.toString() !==
      req.usuarioHeader._id.toString()
    ) {
      return res.status(403).json({
        msg: "No eres el autor."
      });
    }

    if (
      ["EnRevision","EnVotacion", "Publicada"]
      .includes(obra.estado)
    ) {
      return res.status(400).json({
        msg:
          "No puedes editar una obra en este estado."
      });
    }

    const cambios = req.body;

    delete cambios.estado;
    delete cambios.autor;
    delete cambios.votos;
    delete cambios.club;

    const obraActualizada =
      await Obra.findByIdAndUpdate(
        id,
        cambios,
        {
          new: true
        }
      );

    res.status(200).json({
      ok: true,
      msg: "Obra actualizada.",
      obra: obraActualizada
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al actualizar obra."
    });
  }
};

// =========================
// POSTULAR OBRA
// =========================
export const postularObra = async (req, res) => {
  try {

    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada."
      });
    }

    if (obra.autor.toString() !==
      req.usuarioHeader._id.toString()
    ) {
      return res.status(403).json({
        msg: "No eres el autor."
      });
    }

    const totalCapitulos =
      await Capitulo.countDocuments({
        obra: id,
        activo: true
      });

    if (totalCapitulos < 3) {
      return res.status(400).json({
        msg:
          "La obra debe tener al menos 3 capítulos para ser postulada."
      });
    }

    if (
      !["Borrador", "Rechazada"]
      .includes(obra.estado)
    ) {
      return res.status(400).json({
        msg:
          "La obra no puede volver a postularse."
      });
    }

    obra.estado = "EnRevision";
    obra.fechaPostulacion = new Date();
    obra.motivoRechazo = null;

    await obra.save();

    res.status(200).json({
      ok: true,
      msg: "Obra enviada a revisión.",
      obra
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al postular obra."
    });
  }
};

// =========================
// LISTAR MIS OBRAS EN UN CLUB (incluye borrador)
// =========================
export const listarMisObrasClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const obras = await Obra.find({
      club: clubId,
      autor: req.usuarioHeader._id,
      activo: true
    })
      .populate("club", "nombre generoLiterario")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      obras
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al listar mis obras del club"
    });
  }
};

// =========================
// APROBAR OBRA
// =========================
export const aprobarObra = async (req, res) => {
  console.log("ENTRO A APROBAR OBRA");
  try {

    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada."
      });
    }

    if (obra.estado !== "EnRevision") {
      return res.status(400).json({
        msg: "Solo las obras en revisión pueden aprobarse."
      });
    }

    const club = await Club.findById(obra.club);

    const esModeradorDelClub =
      club.moderadores.some(
        mod =>
          mod.toString() ===
          req.usuarioHeader._id.toString()
      );

    if (!esModeradorDelClub) {
      return res.status(403).json({
        msg: "No eres moderador de este club."
      });
    }

    obra.estado = "Aprobada";
    obra.fechaAprobacion = new Date();
    obra.aprobadoPor = req.usuarioHeader._id;

    await obra.save();

    res.status(200).json({
      ok: true,
      msg: "Obra aprobada.",
      obra
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al aprobar obra."
    });
  }
};

export const rechazarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada."
      });
    }

    if (obra.estado !== "EnRevision") {
      return res.status(400).json({
        msg: "Solo se pueden rechazar obras en revisión."
      });
    }

    const club = await Club.findById(obra.club);

    const esModeradorDelClub =
      club.moderadores.some(
        mod => mod.toString() === req.usuarioHeader._id.toString()
      );

    if (!esModeradorDelClub) {
      return res.status(403).json({
        msg: "No eres moderador de este club."
      });
    }

    obra.estado = "Rechazada";
    obra.motivoRechazo = motivo || "Sin motivo";
    obra.rechazadoPor = req.usuarioHeader._id;

    await obra.save();

    res.status(200).json({
      ok: true,
      msg: "Obra rechazada correctamente.",
      obra
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al rechazar obra."
    });
  }
};

// =========================
// INICIAR VOTACIÓN
// =========================
export const iniciarVotacion = async (req, res) => {
  try {

    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada."
      });
    }

    if (obra.estado !== "Aprobada") {
      return res.status(400).json({
        msg: "La obra debe estar aprobada."
      });
    }

    const club = await Club.findById(obra.club);

    const esModeradorDelClub =
      club.moderadores.some(
        mod =>
          mod.toString() ===
          req.usuarioHeader._id.toString()
      );

    if (!esModeradorDelClub) {
      return res.status(403).json({
        msg: "No eres moderador de este club."
      });
    }

    const hoy = new Date();

    const fechaFin = new Date(hoy);

    fechaFin.setDate(
      fechaFin.getDate() + 7
    );

    obra.estado = "EnVotacion";
    obra.fechaInicioVotacion = hoy;
    obra.fechaFinVotacion = fechaFin;

    await obra.save();

    res.status(200).json({
      ok: true,
      msg: "La votación estará activa durante 7 días.",
      obra
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al iniciar la votación."
    });
  }
};