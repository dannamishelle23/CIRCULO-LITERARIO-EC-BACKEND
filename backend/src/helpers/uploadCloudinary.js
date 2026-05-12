import { v2 as cloudinary} from 'cloudinary'
import fs from "fs-extra"

//Subir archivos a Cloudinary
const subirImagenCloudinary = async(filePath, folder = "Usuarios") => {
  const {secure_url, public_id} = await cloudinary.uploader.upload(filePath, {folder})
  await fs.unlink(filePath)
  return {secure_url, public_id}
}

//Subir base64 a cloudinary
const subirBase64Cloudinary = async(base64, folder = "Usuarios") => {
    //Convertir la imagen a base 64
    const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const {secure_url} = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({folder, resource_type: 'image'}, (err, res) =>{
        if (err) reject(err);
        else resolve(res);
    })
        stream.end(buffer)
    })
    return secure_url
}

export {
    subirImagenCloudinary,
    subirBase64Cloudinary
}