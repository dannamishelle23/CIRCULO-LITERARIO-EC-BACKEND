import Obra from "../models/Obras.js";

const verificarAutorObra = async (req, res, next) => {
  try {

    const usuarioId = req.usuarioHeader._id;
    const obraId = req.params.id;

    if (!obraId) {
      return res.status(400).json({
        msg: "ID de obra no proporcionado"
      });
    }

    const obra = await Obra.findById(obraId);

    if (!obra) {
      return res.status(404).json({
        msg: "Obra no encontrada"
      });
    }

    if (
      obra.autor.toString() !==
      usuarioId.toString()
    ) {
      return res.status(403).json({
        msg: "No eres el autor de esta obra"
      });
    }

    req.obra = obra;

    next();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      msg: "Error verificando autor de la obra",
      error: error.message
    });
  }
};

export default verificarAutorObra;