import { Schema, model } from "mongoose";

const CapituloSchema = new Schema(
{
  obra: {
    type: Schema.Types.ObjectId,
    ref: "Obras",
    required: true
  },

  titulo: {
    type: String,
    required: true,
    trim: true
  },

  contenido: {
    type: String,
    required: true
  },

  numeroCapitulo: {
    type: Number,
    required: true
  },

  activo: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
}
);

export default model(
  "Capitulos",
  CapituloSchema
);