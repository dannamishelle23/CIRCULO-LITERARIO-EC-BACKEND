import Capitulo from "../models/Capitulos.js";
import Obra from "../models/Obras.js";

// =========================
// CREAR CAPÍTULO
// =========================
export const crearCapitulo = async (req, res) => {
  try {
    const { id } = req.params; // obraId
    const { titulo, contenido, numero } = req.body;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada" });
    }

    // 🔥 bloquear si está en votación o publicada
    if (["EnVotacion", "Publicada"].includes(obra.estado)) {
      return res.status(400).json({
        msg: "No puedes agregar capítulos en esta etapa",
      });
    }

    // solo autor puede crear capítulos
    if (obra.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ msg: "No eres el autor de esta obra" });
    }

    const capitulo = new Capitulo({
      titulo,
      contenido,
      numero,
      obra: id,
      autor: req.usuario._id,
    });

    await capitulo.save();

    res.status(201).json({
      ok: true,
      msg: "Capítulo creado correctamente",
      capitulo,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear capítulo", error });
  }
};

// =========================
// LISTAR CAPÍTULOS POR OBRA
// =========================
export const listarCapitulos = async (req, res) => {
  try {
    const { id } = req.params;

    const capitulos = await Capitulo.find({ obra: id })
      .sort({ numero: 1 });

    res.json({
      ok: true,
      capitulos,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al listar capítulos", error });
  }
};

// =========================
// EDITAR CAPÍTULO
// =========================
export const editarCapitulo = async (req, res) => {
  try {
    const { capituloId } = req.params;

    const capitulo = await Capitulo.findById(capituloId).populate("obra");

    if (!capitulo) {
      return res.status(404).json({ msg: "Capítulo no encontrado" });
    }

    const obra = capitulo.obra;

    // bloqueo por estado de obra
    if (["EnVotacion", "Publicada"].includes(obra.estado)) {
      return res.status(400).json({
        msg: "No puedes editar capítulos en esta etapa",
      });
    }

    // solo autor de obra
    if (obra.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ msg: "No eres el autor" });
    }

    const { titulo, contenido, numero } = req.body;

    const capituloActualizado = await Capitulo.findByIdAndUpdate(
      capituloId,
      { titulo, contenido, numero },
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Capítulo actualizado",
      capitulo: capituloActualizado,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al editar capítulo", error });
  }
};

// =========================
// ELIMINAR CAPÍTULO
// =========================
export const eliminarCapitulo = async (req, res) => {
  try {
    const { capituloId } = req.params;

    const capitulo = await Capitulo.findById(capituloId).populate("obra");

    if (!capitulo) {
      return res.status(404).json({ msg: "Capítulo no encontrado" });
    }

    const obra = capitulo.obra;

    if (["EnVotacion", "Publicada"].includes(obra.estado)) {
      return res.status(400).json({
        msg: "No puedes eliminar capítulos en esta etapa",
      });
    }

    if (obra.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ msg: "No eres el autor" });
    }

    await Capitulo.findByIdAndDelete(capituloId);

    res.json({
      ok: true,
      msg: "Capítulo eliminado",
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar capítulo", error });
  }
};