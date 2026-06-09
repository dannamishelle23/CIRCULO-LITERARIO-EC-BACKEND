import ClubMiembros from "../models/ClubMiembros.js";
import Clubes from "../models/Clubes.js";

const verificarMiembroClub = async (req, res, next) => {
  try {

    const usuarioId = req.usuarioHeader._id;
    const clubId = req.params.clubId || req.body.club || req.body.clubId;

    if (!clubId) {
      return res.status(400).json({
        msg: "Club no especificado"
      });
    }

    // SI ES MODERADOR DEL CLUB -> PERMITIR
    const club = await Clubes.findById(clubId);

    const esModerador = club?.moderadores?.some(
      mod => mod.toString() === usuarioId.toString()
    );

    if (esModerador) {
      return next();
    }

    // SI ES MIEMBRO APROBADO -> PERMITIR
    const miembro = await ClubMiembros.findOne({
      club: clubId,
      usuario: usuarioId,
      estadoSolicitud: "Aprobado"
    });

    if (!miembro) {
      return res.status(403).json({
        msg: "No eres miembro aprobado de este club"
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      msg: "Error verificando club",
      error
    });
  }
};

export default verificarMiembroClub;