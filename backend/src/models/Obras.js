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
        fecha: {
          type: Date,
          default: Date.now,
        }
      },
    ],

    activo: {
      type: Boolean,
      default: true,
    },

    fechaPostulacion: {
      type: Date,
      default: null
    },

    fechaAprobacion: {
      type: Date,
      default: null
    },

    fechaInicioVotacion: {
      type: Date,
      default: null
    },

    fechaFinVotacion: {
      type: Date,
      default: null
    },

    fechaPublicacion: {
      type: Date,
      default: null
    },

    fechaInicioLectura: Date,
    fechaFinLectura: Date,

    motivoRechazo: {
      type: String,
      default: null
    },
    aprobadoPor: {
      type: Schema.Types.ObjectId,
      ref: "Usuarios",
      default: null
    },
    rechazadoPor: {
      type: Schema.Types.ObjectId,
      ref: "Usuarios",
      default: null
    }
  },
  {
    timestamps: true,
  }
);

export default model("Obras", ObraSchema);