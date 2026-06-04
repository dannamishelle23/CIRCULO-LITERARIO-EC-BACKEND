import Capitulo from "../models/Capitulos.js";
import Obra from "../models/Obras.js";

// =========================
// CREAR CAPÍTULO
// =========================
export const crearCapitulo = async (req, res) => {
  try {

    const { id } = req.params; // obraId

    const {
      titulo,
      contenido,
      numeroCapitulo
    } = req.body;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada"
      });
    }

    if (!obra.activo) {
      return res.status(400).json({
        msg: "La obra está eliminada"
      });
    }

    if (
      obra.autor.toString() !==
      req.usuarioHeader._id.toString()
    ) {
      return res.status(403).json({
        msg: "No eres el autor de esta obra"
      });
    }

    if (
      ["EnRevision", "EnVotacion", "Publicada"]
      .includes(obra.estado)
    ) {
      return res.status(400).json({
        msg: "No puedes agregar capítulos en esta etapa"
      });
    }

    const existeCapitulo =
      await Capitulo.findOne({
        obra: id,
        numeroCapitulo,
        activo: true
      });

    if (existeCapitulo) {
      return res.status(400).json({
        msg: "Ya existe un capítulo con ese número"
      });
    }

    const capitulo = new Capitulo({
      obra: id,
      titulo,
      contenido,
      numeroCapitulo
    });

    await capitulo.save();

    res.status(201).json({
      ok: true,
      msg: "Capítulo creado correctamente",
      capitulo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al crear capítulo",
      error
    });
  }
};

// =========================
// LISTAR CAPÍTULOS
// =========================
export const listarCapitulos = async (req, res) => {

  try {

    const { id } = req.params;

    const capitulos =
      await Capitulo.find({
        obra: id,
        activo: true
      })
      .sort({
        numeroCapitulo: 1
      });

    res.status(200).json({
      ok: true,
      capitulos
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al listar capítulos",
      error
    });
  }
};

// =========================
// DETALLE CAPÍTULO
// =========================
export const detalleCapitulo = async (req, res) => {

  try {

    const { capituloId } = req.params;

    const capitulo =
      await Capitulo.findById(capituloId)
      .populate({
        path: "obra",
        select: "titulo estado"
      });

    if (!capitulo) {
      return res.status(404).json({
        msg: "Capítulo no encontrado"
      });
    }

    if (!capitulo.activo) {
      return res.status(404).json({
        msg: "Capítulo eliminado"
      });
    }

    res.status(200).json({
      ok: true,
      capitulo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al obtener capítulo",
      error
    });
  }
};

// =========================
// EDITAR CAPÍTULO
// =========================
export const editarCapitulo = async (req, res) => {

  try {

    const { capituloId } = req.params;

    const {
      titulo,
      contenido,
      numeroCapitulo
    } = req.body;

    const capitulo =
      await Capitulo.findById(capituloId)
      .populate("obra");

    if (!capitulo) {
      return res.status(404).json({
        msg: "Capítulo no encontrado"
      });
    }

    const obra = capitulo.obra;

    if (
      obra.autor.toString() !==
      req.usuarioHeader._id.toString()
    ) {
      return res.status(403).json({
        msg: "No eres el autor"
      });
    }

    if (
      ["EnRevision", "EnVotacion", "Publicada"]
      .includes(obra.estado)
    ) {
      return res.status(400).json({
        msg: "No puedes editar capítulos en esta etapa"
      });
    }

    const repetido =
      await Capitulo.findOne({
        obra: obra._id,
        numeroCapitulo,
        _id: { $ne: capituloId },
        activo: true
      });

    if (repetido) {
      return res.status(400).json({
        msg: "Ya existe otro capítulo con ese número"
      });
    }

    capitulo.titulo = titulo;
    capitulo.contenido = contenido;
    capitulo.numeroCapitulo =
      numeroCapitulo;

    await capitulo.save();

    res.status(200).json({
      ok: true,
      msg: "Capítulo actualizado",
      capitulo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al editar capítulo",
      error
    });
  }
};

// =========================
// ELIMINAR CAPÍTULO
// =========================
export const eliminarCapitulo = async (req, res) => {

  try {

    const { capituloId } = req.params;

    const capitulo =
      await Capitulo.findById(capituloId)
      .populate("obra");

    if (!capitulo) {
      return res.status(404).json({
        msg: "Capítulo no encontrado"
      });
    }

    const obra = capitulo.obra;

    if (
      obra.autor.toString() !==
      req.usuarioHeader._id.toString()
    ) {
      return res.status(403).json({
        msg: "No eres el autor"
      });
    }

    if (
      ["EnRevision", "EnVotacion", "Publicada"]
      .includes(obra.estado)
    ) {
      return res.status(400).json({
        msg: "No puedes eliminar capítulos en esta etapa"
      });
    }

    capitulo.activo = false;

    await capitulo.save();

    res.status(200).json({
      ok: true,
      msg: "Capítulo eliminado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error al eliminar capítulo",
      error
    });
  }
};