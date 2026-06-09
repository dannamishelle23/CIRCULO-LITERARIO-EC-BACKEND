import dotenv from 'dotenv'
dotenv.config()

import app from './server.js'
import connection from './database.js'
import crearAdmin from './scripts/crearAdmin.js'

//Conecta a la base de datos y se crea un administrador en la BDD 
const iniciarServidor = async() => {
  await connection()
  await crearAdmin()

  app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
  })
}

iniciarServidor()