import { Comentario } from '../models/Comentario.js';
import Obra from '../models/Obras.js';

// 1. OBTENER COMENTARIOS DE UNA OBRA
export const obtenerComentariosObra = async (req, res) => {
  try {
    const { obraId } = req.params;
    
    const comentarios = await Comentario.find({ obra: obraId })
      .populate('usuario', 'nombres apellidos avatar username')
      .sort({ fechaCreacion: 1 }); 
      
    res.status(200).json(comentarios);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ msg: "Error al cargar los comentarios." });
  }
};

// 2. CREAR COMENTARIO (Validar que estén habilitados durante dos semanas)
export const agregarComentarioObra = async (req, res) => {
  try {
    const { obraId } = req.params;
    const userId = req.usuarioHeader._id;
    const { texto } = req.body;

    // Buscar la obra para verificar su fecha de publicación
    const obra = await Obra.findById(obraId);
    if (!obra || obra.estado !== "Publicada") {
      return res.status(404).json({ msg: "La obra no está disponible para comentarios." });
    }

    // Calcular si pasaron 2 semanas (14 días)
    const fechaLimite = new Date(obra.fechaPublicacion);
    fechaLimite.setDate(fechaLimite.getDate() + 14); 

    if (new Date() > fechaLimite) {
      return res.status(400).json({ 
        msg: "El periodo de debate/foro para esta lectura ha finalizado." 
      });
    }

    // Crear y guardar el comentario
    const nuevoComentario = new Comentario({
      obra: obraId,
      usuario: userId,
      texto
    });

    await nuevoComentario.save();

    // Poblamos para devolver el usuario y responder limpio
    const comentarioPoblado = await nuevoComentario.populate('usuario', 'nombres apellidos avatar username');

    res.status(201).json({ 
      msg: "Comentario publicado.", 
      comentario: comentarioPoblado 
    });

  } catch (error) {
    console.error("Error al agregar comentario:", error);
    res.status(500).json({ msg: "Error al guardar el comentario." });
  }
};

// 3. EDITAR COMENTARIO (Solo dentro de las 2 semanas y solo el autor del comentario)
export const editarComentarioObra = async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const userId = req.usuarioHeader._id;
    const { texto } = req.body;

    // Buscar el comentario
    const comentario = await Comentario.findById(comentarioId).populate('obra');
    if (!comentario) {
      return res.status(404).json({ msg: "Comentario no encontrado." });
    }

    // Verificar que el usuario sea dueño del comentario
    if (comentario.usuario.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "No tienes permiso para editar este comentario." });
    }

    // Verificar que la obra siga en estado "Publicada"
    if (!comentario.obra || comentario.obra.estado !== "Publicada") {
      return res.status(400).json({ msg: "La obra no está disponible para esta acción." });
    }

    // Calcular si pasaron 2 semanas (14 días) desde la publicación
    const fechaLimite = new Date(comentario.obra.fechaPublicacion);
    fechaLimite.setDate(fechaLimite.getDate() + 14);

    if (new Date() > fechaLimite) {
      return res.status(400).json({ 
        msg: "El periodo de debate ha finalizado. Ya no se puede editar este comentario." 
      });
    }

    // Actualizar el texto
    comentario.texto = texto;
    await comentario.save();

    // Poblamos de nuevo para devolver el usuario actualizado en la respuesta
    await comentario.populate('usuario', 'nombres apellidos avatar username');

    res.status(200).json({ 
      msg: "Comentario actualizado correctamente.", 
      comentario 
    });

  } catch (error) {
    console.error("Error al editar comentario:", error);
    res.status(500).json({ msg: "Error al editar el comentario." });
  }
};

// 4. ELIMINAR COMENTARIO (Solo dentro de las 2 semanas y solo el autor del comentario)
export const eliminarComentarioObra = async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const userId = req.usuarioHeader._id;

    // Buscar el comentario
    const comentario = await Comentario.findById(comentarioId).populate('obra');
    if (!comentario) {
      return res.status(404).json({ msg: "Comentario no encontrado." });
    }

    // Verificar que el usuario sea dueño del comentario
    if (comentario.usuario.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "No tienes permiso para eliminar este comentario." });
    }

    // Verificar que la obra siga en estado "Publicada"
    if (!comentario.obra || comentario.obra.estado !== "Publicada") {
      return res.status(400).json({ msg: "La obra no está disponible para esta acción." });
    }

    // Calcular si pasaron 2 semanas (14 días) desde la publicación
    const fechaLimite = new Date(comentario.obra.fechaPublicacion);
    fechaLimite.setDate(fechaLimite.getDate() + 14);

    if (new Date() > fechaLimite) {
      return res.status(400).json({ 
        msg: "El periodo de debate ha finalizado. Ya no se puede eliminar este comentario." 
      });
    }

    // Eliminar el comentario
    await Comentario.findByIdAndDelete(comentarioId);

    res.status(200).json({ 
      msg: "Comentario eliminado correctamente.", 
      _id: comentarioId 
    });

  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ msg: "Error al eliminar el comentario." });
  }
};