import ClubMiembros from "../models/ClubMiembros.js";

const verificarMiembroClub = async (req, res, next) => {
  try {
    const usuarioId = req.usuarioHeader._id;
    const clubId = req.params.clubId || req.body.club || req.body.clubId;

    if (!clubId) {
      return res.status(400).json({ msg: "Club no especificado" });
    }

    const miembro = await ClubMiembros.findOne({
      club: clubId,
      usuario: usuarioId,
      estadoSolicitud: "Aprobado",
    });

    if (!miembro) {
      return res.status(403).json({
        msg: "No eres miembro aprobado de este club",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ msg: "Error verificando club", error });
  }
};

export default verificarMiembroClub;