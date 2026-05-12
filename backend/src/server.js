// Requerir módulos
import express from 'express'
import cors from 'cors';

import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"

import authRouter from './routers/auth_routes.js'
import routerUsuarios from './routers/usuario_routes.js'

// Inicializaciones
const app = express()

// Configuraciones 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Middlewares 
app.use(express.json())
app.use(cors())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))

// Variables globales
app.set('port',process.env.PORT || 3000)


// Ruta principal
app.get('/',(req,res)=> res.send("Server on"))

// Rutas para la autenticación de usuarios
app.use('/api/auth', authRouter)

//Rutas para usuarios (lectores y autores)
app.use('/api/usuarios', routerUsuarios)

// Manejo de una ruta que no sea encontrada
app.use((req,res) => res.status(404).send("Error 404: Endpoint no encontrado."))

// Exportar la instancia de express por medio de app
export default app