import dotenv from "dotenv"
dotenv.config()

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL
const BREVO_REPLY_TO_EMAIL = process.env.BREVO_REPLY_TO_EMAIL || BREVO_FROM_EMAIL

if (!BREVO_API_KEY) {
  throw new Error("Debe definir BREVO_API_KEY en el entorno para enviar correos con Brevo API REST.")
}

const sendMail = async (to, subject, html, text = '') => {
  try {
    const recipients = Array.isArray(to)
      ? to.map(email => ({ email }))
      : [{ email: to }]

    const payload = {
      sender: {
        name: BREVO_FROM_NAME,
        email: BREVO_FROM_EMAIL
      },
      to: recipients,
      subject,
      htmlContent: html,
      textContent: text || subject,
      replyTo: {
        email: BREVO_REPLY_TO_EMAIL
      }
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Brevo API error ${response.status}: ${JSON.stringify(data)}`)
    }

    console.log("Email enviado:", data.messageId)
    return data
  } catch (error) {
    console.error("Error enviando correo:", error)
    throw error
  }
}

export default sendMail
