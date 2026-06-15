import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        console.log(process.env.MONGODB_URL)
        const {connection} = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Base de datos conectada con éxito`)
    } catch (error) {
        console.log(error);
    }
}

export default  connection