import { Schema, model } from "mongoose";

const ObraSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    sinopsis: {
      type: String,
      required: true,
    },

    prologo: {
      type: String,
      default: "",
    },

    portada: {
      type: String, // URL Cloudinary
      required: true,
    },

    portadaID: {
      type: String, // public_id Cloudinary
      required: true,
    },

    autor: {
      type: Schema.Types.ObjectId,
      ref: "Usuarios",
      required: true,
    },

    club: {
      type: Schema.Types.ObjectId,
      ref: "Clubes",
      required: true,
    },

    estado: {
      type: String,
      enum: [
        "Borrador",
        "EnRevision",
        "Aprobada",
        "EnVotacion",
        "Publicada",
        "Rechazada",
      ],
      default: "Borrador",
    },

    // controla si está en etapa de lectura completa
    esPublicaCompleta: {
      type: Boolean,
      default: false,
    },

    //Cuenta votos por usuario
    votos: [
      {
        usuario: {
          type: Schema.Types.ObjectId,
          ref: "Usuarios",
        },
        valor: {
          type: Number,
          default: 1,
        },
      },
    ],

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Obras", ObraSchema);