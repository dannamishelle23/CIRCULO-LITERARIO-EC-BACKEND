import Obra from "../models/Obras.js";
import Capitulo from "../models/Capitulos.js";
import Club from "../models/Clubes.js";
import ClubMiembros from "../models/ClubMiembros.js";
import { subirImagenCloudinary } from "../helpers/uploadCloudinary.js";

/* =========================
   CREAR OBRA
========================= */
export const crearObra = async (req, res) => {
  try {
    const { titulo, sinopsis, prologo, club } = req.body;

    if (!titulo || !sinopsis || !prologo || !club) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    const clubExiste = await Club.findById(club);

    if (!clubExiste || clubExiste.estadoClub !== "Activo") {
      return res.status(400).json({ msg: "Club inválido o inactivo." });
    }

    const miembro = await ClubMiembros.findOne({
      club,
      usuario: req.usuarioHeader._id,
      estadoSolicitud: "Aprobado"
    });

    if (!miembro) {
      return res.status(403).json({ msg: "Debes ser miembro aprobado del club." });
    }

    if (!req.files?.portada) {
      return res.status(400).json({ msg: "La portada es obligatoria." });
    }

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
      club
    });

    await obra.save();

    res.status(201).json({ ok: true, obra });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear obra." });
  }
};

/* =========================
   OBTENER OBRA
========================= */
export const obtenerObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id)
      .populate("autor", "nombres apellidos username avatar")
      .populate("club", "nombre generoLiterario");

    if (!obra) return res.status(404).json({ msg: "Obra no encontrada." });

    const esAutor =
      obra.autor._id.toString() === req.usuarioHeader._id.toString();

    const esVisible = ["Aprobada", "EnVotacion", "Publicada"].includes(obra.estado);

    if (!esAutor && !esVisible) {
      return res.status(403).json({ msg: "No tienes acceso a esta obra." });
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

    if (obra.estado === "Publicada") {
      const capitulos = await Capitulo.find({
        obra: obra._id,
        activo: true
      }).sort({ numeroCapitulo: 1 });

      response.capitulos = capitulos;
    }

    res.status(200).json({ ok: true, obra: response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener obra." });
  }
};

export const actualizarObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada." });
    }

    if (obra.autor.toString() !== req.usuarioHeader._id.toString()) {
      return res.status(403).json({ msg: "No eres el autor." });
    }

    if (["EnRevision", "EnVotacion", "Publicada"].includes(obra.estado)) {
      return res.status(400).json({
        msg: "No puedes editar una obra en este estado."
      });
    }

    const cambios = req.body;

    // bloquear campos críticos
    delete cambios.estado;
    delete cambios.autor;
    delete cambios.votos;
    delete cambios.club;

    const obraActualizada = await Obra.findByIdAndUpdate(
      id,
      cambios,
      { new: true }
    );

    res.status(200).json({
      ok: true,
      msg: "Obra actualizada.",
      obra: obraActualizada
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar obra." });
  }
};

/* =========================
   PERFIL PÚBLICO AUTOR
   SOLO APROBADAS (PREVIEW)
========================= */
export const listarObrasPublicasAutor = async (req, res) => {
  try {
    const { autorId } = req.params;

    const obras = await Obra.find({
      autor: autorId,
      estado: "Aprobada",
      activo: true
    })
      .populate("club", "nombre generoLiterario")
      .sort({ createdAt: -1 });

    res.status(200).json({ ok: true, obras });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al listar obras." });
  }
};

/* =========================
   CLUB - TODAS LAS OBRAS
========================= */
export const listarObrasClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const obras = await Obra.find({
      club: clubId,
      activo: true
    })
      .populate("autor", "nombres apellidos username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ ok: true, obras });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al listar obras." });
  }
};

/* =========================
   EN REVISIÓN
========================= */
export const listarObrasEnRevision = async (req, res) => {
  try {
    const { clubId } = req.params;

    const obras = await Obra.find({
      club: clubId,
      estado: "EnRevision",
      activo: true
    });

    res.status(200).json({ ok: true, obras });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

/* =========================
   APROBADAS (SELECCIÓN VOTACIÓN)
========================= */
export const listarObrasAprobadas = async (req, res) => {
  try {
    const { clubId } = req.params;

    const obras = await Obra.find({
      club: clubId,
      estado: "Aprobada",
      activo: true
    });

    res.status(200).json({ ok: true, obras });

  } catch (error) {
    res.status(500).json({ msg: "Error." });
  }
};

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

    res.status(200).json({
      ok: true,
      obras
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al listar mis obras del club"
    });
  }
};

//POSTULAR OBRA (PASA A REVISIÓN POR EL MODERADOR)
export const postularObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada." });
    }

    if (obra.autor.toString() !== req.usuarioHeader._id.toString()) {
      return res.status(403).json({ msg: "No eres el autor." });
    }

    const totalCapitulos = await Capitulo.countDocuments({
      obra: id,
      activo: true
    });

    if (totalCapitulos < 3) {
      return res.status(400).json({
        msg: "Debe tener al menos 3 capítulos."
      });
    }

    if (obra.estado !== "Borrador") {
      return res.status(400).json({
        msg: "Solo se puede postular desde borrador."
      });
    }

    obra.estado = "EnRevision";
    obra.fechaPostulacion = new Date();
    obra.motivoRechazo = null;

    await obra.save();

    res.status(200).json({
      ok: true,
      msg: "Enviada a revisión",
      obra
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error." });
  }
};

//APROBAR OBRA (MODERADOR)
export const aprobarObra = async (req, res) => {
  try {
    const { id } = req.params;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada." });
    }

    if (obra.estado !== "EnRevision") {
      return res.status(400).json({
        msg: "Solo se aprueban obras en revisión."
      });
    }

    const club = await Club.findById(obra.club);

    const esModerador = club.moderadores.some(
      m => m.toString() === req.usuarioHeader._id.toString()
    );

    if (!esModerador) {
      return res.status(403).json({ msg: "No autorizado." });
    }

    obra.estado = "Aprobada";
    obra.fechaAprobacion = new Date();
    obra.aprobadoPor = req.usuarioHeader._id;

    await obra.save();

    res.status(200).json({
      ok: true,
      msg: "Obra aprobada",
      obra
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error." });
  }
};

export const rechazarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const obra = await Obra.findById(id);

    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada." });
    }

    if (obra.estado !== "EnRevision") {
      return res.status(400).json({ msg: "No se puede rechazar." });
    }

    const club = await Club.findById(obra.club);

    const esModerador = club.moderadores.some(
      m => m.toString() === req.usuarioHeader._id.toString()
    );

    if (!esModerador) {
      return res.status(403).json({ msg: "No autorizado." });
    }

    obra.estado = "Rechazada";
    obra.motivoRechazo = motivo || "Sin motivo";

    await obra.save();

    res.status(200).json({
      ok: true,
      msg: "Obra rechazada",
      obra
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error." });
  }
};

/* =========================
   INICIAR VOTACIÓN
========================= */
export const iniciarVotacion = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { obrasIds } = req.body;

    const club = await Club.findById(clubId);

    if (!club) return res.status(404).json({ msg: "Club no encontrado." });

    const esModerador = club.moderadores.some(
      m => m.toString() === req.usuarioHeader._id.toString()
    );

    if (!esModerador) return res.status(403).json({ msg: "No autorizado." });

    const existe = await Obra.findOne({
      club: clubId,
      estado: "EnVotacion"
    });

    if (existe) {
      return res.status(400).json({ msg: "Ya hay votación activa." });
    }

    const obras = await Obra.find({
      _id: { $in: obrasIds },
      club: clubId,
      estado: "Aprobada"
    });

    if (!obras.length) {
      return res.status(400).json({ msg: "Sin obras válidas." });
    }

    const inicio = new Date();
    const fin = new Date();
    fin.setDate(fin.getDate() + 7);

    await Obra.updateMany(
      { _id: { $in: obrasIds } },
      {
        estado: "EnVotacion",
        fechaInicioVotacion: inicio,
        fechaFinVotacion: fin
      }
    );

    res.status(200).json({ ok: true, obras });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error votación." });
  }
};

/* =========================
   CERRAR VOTACIÓN
========================= */
export const cerrarVotacion = async (req, res) => {
  try {
    const { clubId } = req.params;

    const obras = await Obra.find({
      club: clubId,
      estado: "EnVotacion"
    });

    if (!obras.length) {
      return res.status(404).json({ msg: "No hay votación." });
    }

    const ahora = new Date();

    if (ahora < obras[0].fechaFinVotacion) {
      return res.status(400).json({ msg: "Aún en votación." });
    }

    let ganadora = obras[0];

    for (const o of obras) {
      if (o.votos.length > ganadora.votos.length) {
        ganadora = o;
      }
    }

    ganadora.estado = "Publicada";
    ganadora.fechaPublicacion = new Date();
    ganadora.votos = [];

    await ganadora.save();

    await Obra.updateMany(
      {
        club: clubId,
        estado: "EnVotacion",
        _id: { $ne: ganadora._id }
      },
      {
        estado: "Aprobada",
        votos: []
      }
    );

    res.status(200).json({ ok: true, ganadora });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor." });
  }
};

export const votarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.usuarioHeader._id;

    const obra = await Obra.findById(id);
    if (!obra) {
      return res.status(404).json({ msg: "Obra no encontrada." });
    }

    if (obra.estado !== "EnVotacion") {
      return res.status(400).json({ msg: "La obra no está en votación." });
    }

    // validar tiempo (1 semana)
    const ahora = new Date();
    if (obra.fechaFinVotacion && ahora > obra.fechaFinVotacion) {
      return res.status(400).json({ msg: "La votación ya terminó." });
    }

    // validar membresía del club
    const miembro = await ClubMiembros.findOne({
      club: obra.club,
      usuario: userId,
      estadoSolicitud: "Aprobado"
    });

    if (!miembro) {
      return res.status(403).json({ msg: "No eres miembro del club." });
    }

    // verificar si ya votó
    const yaVoto = obra.votos.some(v => v.usuario.toString() === userId.toString());

    if (yaVoto) {
      // QUITAR VOTO
      obra.votos = obra.votos.filter(
        v => v.usuario.toString() !== userId.toString()
      );

      await obra.save();

      return res.status(200).json({
        ok: true,
        msg: "Voto eliminado",
        votos: obra.votos.length
      });
    }

    // AGREGAR VOTO
    obra.votos.push({
      usuario: userId,
      fecha: new Date()
    });

    await obra.save();

    return res.status(200).json({
      ok: true,
      msg: "Voto registrado",
      votos: obra.votos.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al votar." });
  }
};