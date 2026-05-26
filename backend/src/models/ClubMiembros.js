import { Schema, model } from "mongoose"

const ClubMiembrosSchema = new Schema({

  club: {
    type: Schema.Types.ObjectId,
    ref: "Club",
    required: true
  },

  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuarios",
    required: true
  },

  estadoSolicitud: {
    type: String,
    enum: [
      "Pendiente",
      "Aprobado",
      "Rechazado"
    ],
    default: "Pendiente"
  },

  fechaSolicitud: {
    type: Date,
    default: Date.now
  },

  aprobadoPor: {
    type: Schema.Types.ObjectId,
    ref: "Usuarios",
    default: null
  }

}, {
  timestamps: true
})

export default model(
  "ClubMiembros",
  ClubMiembrosSchema
)