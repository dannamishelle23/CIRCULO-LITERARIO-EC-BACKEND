import mongoose from "mongoose"

const clubSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true,
    trim: true
  },

  descripcion: {
    type: String,
    required: true
  },

  generoLiterario: {
    type: String,
    required: true,
    unique: true,
    enum: [
      "Fantasia",
      "Romance",
      "Terror",
      "Ciencia Ficcion",
      "Misterio",
      "Drama",
      "Aventura",
      "Poesia",
      "Fanfic"
    ]
  },

  portada: {
    type: String,
    default: null
  },

  portadaID: {
    type: String,
    default: null
  },

  estadoClub: {
    type: String,
    enum: ["Activo", "Suspendido"],
    default: "Activo"
  },

  //Asignar moderadores a varios clubes de lectura
  moderadores: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuarios"
  }],

  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuarios",
    required: true
  },

}, {
  timestamps: true
})

export default mongoose.model("Clubes", clubSchema)