import bcrypt from "bcryptjs"
import Usuario from "../models/Usuarios.js"

//Crear un superadministrador por medio de variables de entorno
const crearAdmin = async () => {
    try {

        const adminExistente = await Usuario.findOne({ email: process.env.ADMIN_EMAIL})

        if (adminExistente) {
            console.log("Ya existe un administrador registrado con esas credenciales.")
            return
        }

        const passwordEncriptada = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

        const admin = new Usuario({
            nombres: process.env.ADMIN_NOMBRES,
            apellidos: process.env.ADMIN_APELLIDOS,
            fechaNacimiento: process.env.ADMIN_FECHA_NACIMIENTO,
            provincia: process.env.ADMIN_PROVINCIA,
            ciudad: process.env.ADMIN_CIUDAD,
            username: process.env.ADMIN_USERNAME,
            email: process.env.ADMIN_EMAIL,
            password: passwordEncriptada,
            rol: "Administrador",            //Enviar el rol de administrador
            confirmEmail: true
        })

        await admin.save()

        console.log("Administrador creado con éxito.")

    } catch (error) {
        console.log("Error creando administrador:", error)
    }
}

export default crearAdmin