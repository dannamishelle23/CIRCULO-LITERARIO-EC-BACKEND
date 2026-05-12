import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: process.env.BREVO_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
})

const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.BREVO_FROM_NAME} <${process.env.BREVO_FROM_EMAIL}>`,
      to,
      subject,
      html,
    })

    console.log("Email enviado:", info.messageId)
  } catch (error) {
    console.error("Error enviando correo:", error.message)
    throw error
  }
}

export default sendMail