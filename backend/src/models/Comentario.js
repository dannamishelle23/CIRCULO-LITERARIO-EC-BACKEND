// models/Comentario.js
import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
  obra: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Obras', 
    required: true 
  },
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuarios', 
    required: true 
  },
  texto: { 
    type: String, 
    required: true 
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  }
});

export const Comentario = mongoose.model('Comentario', comentarioSchema);