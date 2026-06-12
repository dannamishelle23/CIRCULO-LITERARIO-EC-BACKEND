import express from 'express';
import { 
  obtenerComentariosObra, 
  agregarComentarioObra,
  editarComentarioObra,
  eliminarComentarioObra
} from '../controllers/comentarios_controller.js'; 
import { verificarTokenJWT } from '../middlewares/JWT.js'; // Ajusta a tu middleware de autenticación

const router = express.Router();

// Obtener los comentarios de una obra específica
router.get('/obra/:obraId', verificarTokenJWT, obtenerComentariosObra);

// Agregar un comentario a una obra específica (válido solo durante las 2 semanas de publicación)
router.post('/obra/:obraId', verificarTokenJWT, agregarComentarioObra);

// Editar un comentario de una obra específica (válido solo durante las 2 semanas de publicación)
router.put('/obra/:obraId/comentario/:comentarioId', verificarTokenJWT, editarComentarioObra);

// Eliminar un comentario de una obra específica (válido solo durante las 2 semanas de publicación)
router.delete('/obra/:obraId/comentario/:comentarioId', verificarTokenJWT, eliminarComentarioObra);

export default router;