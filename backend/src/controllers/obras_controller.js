import Obra from "../models/Obras.js";
import Capitulo from "../models/Capitulos.js";
import Club from "../models/Clubes.js";
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
      fechaFinVotacion: obra.fechaFinVotacion
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
      ["EnVotacion", "Publicada"]
      .includes(obra.estado)
    ) {
      return res.status(400).json({
        msg:
          "No puedes editar una obra en votación o publicada."
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
          "La obra debe tener mínimo 3 capítulos."
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
// APROBAR OBRA
// =========================
export const aprobarObra = async (req, res) => {
  try {

    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada."
      });
    }

    if (
      obra.estado !== "EnRevision"
    ) {
      return res.status(400).json({
        msg:
          "Solo las obras en revisión pueden aprobarse."
      });
    }

    obra.estado = "Aprobada";
    obra.fechaAprobacion =
      new Date();

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

    if (
      obra.estado !== "Aprobada"
    ) {
      return res.status(400).json({
        msg:
          "La obra debe estar aprobada."
      });
    }

    const hoy = new Date();

    const fechaFin =
      new Date(hoy);

    fechaFin.setDate(
      fechaFin.getDate() + 7
    );

    obra.estado = "EnVotacion";
    obra.fechaInicioVotacion = hoy;
    obra.fechaFinVotacion = fechaFin;

    await obra.save();

    res.status(200).json({
      ok: true,
      msg:
        "La votación estará activa durante 7 días.",
      obra
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg:
        "Error al iniciar la votación."
    });
  }
};