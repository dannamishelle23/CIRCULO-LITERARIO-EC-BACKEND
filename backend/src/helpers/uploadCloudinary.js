import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"

// Subir archivos a Cloudinary
const subirImagenCloudinary = async (
  filePath,
  folder = "General"
) => {

  const { secure_url, public_id } =
    await cloudinary.uploader.upload(
      filePath,
      { folder }
    )

  await fs.unlink(filePath)

  return {
    secure_url,
    public_id
  }
}

// Subir base64
const subirBase64Cloudinary = async (
  base64,
  folder = "General"
) => {

  const buffer = Buffer.from(
    base64.replace(
      /^data:image\/\w+;base64,/,
      ''
    ),
    'base64'
  )

  const { secure_url } =
    await new Promise((resolve, reject) => {

      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image'
          },
          (err, res) => {

            if (err) reject(err)
            else resolve(res)
          }
        )

      stream.end(buffer)
    })

  return secure_url
}

// Eliminar imagen de Cloudinary
const eliminarImagenCloudinary = async (public_id) => {

  if (!public_id) return

  await cloudinary.uploader.destroy(public_id)
}

export {
  subirImagenCloudinary,
  subirBase64Cloudinary,
  eliminarImagenCloudinary
}