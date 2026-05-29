import Obra from "../models/Obras.js";
import Capitulo from "../models/Capitulos.js";
import { subirImagenCloudinary } from "../helpers/uploadCloudinary.js";

export const crearObra = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { titulo, sinopsis, prologo, club } = req.body;

    if (!titulo || !sinopsis || !prologo || !club) {
      return res.status(400).json({
        msg: "Faltan campos obligatorios",
        body: req.body,
      });
    }

    if (!req.files?.portada) {
      return res.status(400).json({
        msg: "La portada es obligatoria",
      });
    }

    // SUBIR IMAGEN A CLOUDINARY
    const { secure_url, public_id } = await subirImagenCloudinary(
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
      club,
      estado: "Borrador",
    });

    await obra.save();

    res.status(201).json({
      ok: true,
      msg: "Obra creada correctamente",
      obra,
    });
  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      msg: "Error al crear obra",
      error: error.message,
    });
  }
};

// =========================
// OBTENER OBRA (VISIBILIDAD CONTROLADA)
// =========================
export const obtenerObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id)
      .populate("autor", "nombre")
      .populate("club", "nombre");

    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada" });
    }

    let response = {
      _id: obra._id,
      titulo: obra.titulo,
      sinopsis: obra.sinopsis,
      prologo: obra.prologo,
      portada: obra.portada,
      estado: obra.estado,
      autor: obra.autor,
      club: obra.club,
      votos: obra.votos.length,
    };

    // SOLO SI ES PUBLICADA → mostrar capítulos completos
    if (obra.estado === "Publicada") {
      const capitulos = await Capitulo.find({ obra: id });
      response.capitulos = capitulos;
    }

    res.json({ ok: true, obra: response });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener obra", error });
  }
};

// =========================
// LISTAR OBRAS POR CLUB
// =========================
export const listarObrasClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const obras = await Obra.find({ club: clubId, activo: true });

    res.json({ ok: true, obras });
  } catch (error) {
    res.status(500).json({ msg: "Error al listar obras", error });
  }
};

// =========================
// ACTUALIZAR OBRA (SOLO AUTOR)
// =========================
export const actualizarObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada" });
    }

    if (obra.autor.toString() !== req.usuarioHeader._id.toString()) {
      return res.status(403).json({ msg: "No eres el autor" });
    }

    // ❌ evitar cambios peligrosos
    const cambios = req.body;
    delete cambios.estado;
    delete cambios.autor;
    delete cambios.votos;
    delete cambios.club;

    const obraActualizada = await Obra.findByIdAndUpdate(id, cambios, {
      new: true,
    });

    res.json({ ok: true, obra: obraActualizada });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar obra", error });
  }
};

// =========================
// POSTULAR A REVISIÓN
// =========================
export const postularObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada" });
    }

    if (obra.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ msg: "No eres el autor" });
    }

    const capitulos = await Capitulo.countDocuments({ obra: id });

    if (capitulos < 3) {
      return res.status(400).json({
        msg: "Debes tener mínimo 3 capítulos",
      });
    }

    if (obra.estado !== "Borrador") {
      return res.status(400).json({
        msg: "La obra ya fue postulada o está en proceso",
      });
    }

    obra.estado = "EnRevision";
    await obra.save();

    res.json({ ok: true, msg: "Enviada a revisión", obra });
  } catch (error) {
    res.status(500).json({ msg: "Error al postular obra", error });
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
      return res.status(404).json({ msg: "Obra no encontrada" });
    }

    if (obra.estado !== "EnRevision") {
      return res.status(400).json({
        msg: "Solo obras en revisión pueden ser aprobadas",
      });
    }

    obra.estado = "Aprobada";
    await obra.save();

    res.json({ ok: true, msg: "Obra aprobada", obra });
  } catch (error) {
    res.status(500).json({ msg: "Error al aprobar obra", error });
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
      return res.status(404).json({ msg: "Obra no encontrada" });
    }

    if (obra.estado !== "Aprobada") {
      return res.status(400).json({
        msg: "La obra debe estar aprobada primero",
      });
    }

    obra.estado = "EnVotacion";
    await obra.save();

    res.json({
      ok: true,
      msg: "Votación iniciada (7 días)",
      obra,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al iniciar votación", error });
  }
};