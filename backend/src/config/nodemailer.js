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
  },
  tls: {
    rejectUnauthorized: false
  },
  logger: true,
  debug: true
})

const sendMail = async (to, subject, html, text = '') => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.BREVO_FROM_NAME} <${process.env.BREVO_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
      replyTo: process.env.BREVO_FROM_EMAIL
    })

    console.log("Email enviado:", info.messageId)
    return info
  } catch (error) {
    console.error("Error enviando correo:", error)
    throw error
  }
}

export default sendMail