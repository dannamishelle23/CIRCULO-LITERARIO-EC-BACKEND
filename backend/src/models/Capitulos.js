import { Schema, model } from "mongoose";

const CapituloSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    contenido: {
      type: String,
      required: true,
    },

    numero: {
      type: Number,
      required: true,
    },

    obra: {
      type: Schema.Types.ObjectId,
      ref: "Obras",
      required: true,
    },

    autor: {
      type: Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },

    estado: {
      type: String,
      enum: ["Borrador", "Publicado"],
      default: "Borrador",
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//Evita capítulos duplicados por número en la misma obra
CapituloSchema.index({ obra: 1, numero: 1 }, { unique: true });

export default model("Capitulos", CapituloSchema);