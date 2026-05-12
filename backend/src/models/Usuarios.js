import {Schema, model, now} from 'mongoose'
import bcrypt from "bcryptjs"

const UsuarioSchema = new Schema({
    nombres: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    biografia: {
        type: String,
        trim: true
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    provincia: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    estadoUsuario: {
        type: String,
        enum: ["Activo", "Suspendido", "Eliminado"],
        default: "Activo"
    },
    token: {
        type: String,
        default: null
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    rol: {
        type: String,
        enum: ["Administrador", "Moderador", "Usuario"],
        default: "Usuario"
    },
    avatar: {
   type: String,
   default: null
    },
    avatarID: {
    type: String,
    default: null
    },

    //Campo para registrar quien creó el moderador 
    creadoPor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuarios',
    default: null
    }
}, {
    timestamps: true
})

// Método para cifrar la contraseña
UsuarioSchema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(password,salt)
    return passwordEncrypt
}

// Método para verificar si la contraseña es la misma de la BDD
UsuarioSchema.methods.matchPassword = async function(password) {
    const response = await bcrypt.compare(password,this.password)
    return response
}

// Método para crear un token 
UsuarioSchema.methods.createToken = function() {
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model('Usuarios', UsuarioSchema)