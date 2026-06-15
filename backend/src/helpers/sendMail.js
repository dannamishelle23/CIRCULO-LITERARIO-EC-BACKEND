import sendMail from "../config/nodemailer.js"

//Correo enviado a los usuarios (lectores) para confirmar su cuenta en el registro
const sendMailToRegister = (userMail, token) => {
    const urlConfirmacion = `${process.env.URL_FRONTEND}/auth/confirmar/${token}`;

    return sendMail(
        userMail,
        "Confirmación de cuenta en nuestra plataforma.",
        `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            
            <div style="background-color: #2c3e50; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Círculo Literario EC</h1>
            </div>

            <div style="padding: 40px; line-height: 1.6;">
                <h2 style="color: #2c3e50; margin-top: 0;">¡Bienvenido a Círculo Literario EC!</h2>
                <p>Gracias por unirte a nuestra comunidad. Para comenzar esta aventura literaria y activar todas las funciones de tu cuenta, solo necesitas confirmar tu dirección de correo electrónico.</p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${urlConfirmacion}" 
                       style="background-color: #e67e22; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                       Confirmar mi cuenta
                    </a>
                </div>

                <p style="font-size: 0.9em; color: #7f8c8d;">Si el botón no funciona, también puedes copiar y pegar este enlace en tu navegador:</p>
                <p style="font-size: 0.8em; word-break: break-all;"><a href="${urlConfirmacion}" style="color: #3498db;">${urlConfirmacion}</a></p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #95a5a6; border-top: 1px solid #eee;">
                <p style="margin: 5px 0;">Círculo Literario EC — 2026</p>
                <p style="margin: 5px 0;">Si no creaste esta cuenta, puedes ignorar este correo con total tranquilidad.</p>
            </div>
        </div>
        `
    )
}

//Correo enviado a todos los usuarios en caso de olvido de contraseña
const sendMailToRecoveryPassword = (userMail, token) => {
    const urlRecuperacion = `${process.env.URL_FRONTEND}/reset/password/${token}`;

    return sendMail(
        userMail,
        "Restablece tu contraseña - Círculo Literario EC 🔑",
        `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            
            <div style="background-color: #2c3e50; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Círculo Literario EC</h1>
            </div>

            <div style="padding: 40px; line-height: 1.6;">
                <h2 style="color: #2c3e50; margin-top: 0;">¿Olvidaste tu contraseña?</h2>
                <p>No te preocupes. Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                <p>Para elegir una nueva clave, simplemente haz clic en el siguiente botón:</p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${urlRecuperacion}" 
                       style="background-color: #3498db; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                       Restablecer contraseña
                    </a>
                </div>

                <p style="font-size: 0.9em; color: #7f8c8d;">Este enlace expirará pronto por razones de seguridad. Si el botón no funciona, copia y pega esto en tu navegador:</p>
                <p style="font-size: 0.8em; word-break: break-all;"><a href="${urlRecuperacion}" style="color: #3498db;">${urlRecuperacion}</a></p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="font-size: 0.85em; color: #e74c3c;"><strong>¿No solicitaste este cambio?</strong> Puedes ignorar este correo de forma segura; tu contraseña actual no cambiará.</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #95a5a6; border-top: 1px solid #eee;">
                <p style="margin: 5px 0;">Círculo Literario EC — 2026</p>
                <p style="margin: 5px 0;">Comunidad de lectores y escritores.</p>
            </div>
        </div>
        `
    )
}

//Correo enviado a los moderadores para proporcionarles sus credenciales de acceso
const sendMailToCreateModerator = (userMail, userName, password) => {
    const urlLogin = `${process.env.URL_FRONTEND}/login`;
    const textBody = `Bienvenido al equipo de Moderación.

Se te ha asignado un rol de moderador y estas son tus credenciales de acceso:

Nombre de usuario: ${userName}
Correo electrónico: ${userMail}
Contraseña temporal: ${password}

Ingresa al sistema en: ${urlLogin}

Te recomendamos cambiar tu contraseña una vez que hayas ingresado por primera vez desde tu perfil.

Círculo Literario EC`;

    return sendMail(
        userMail,
        "Bienvenido al equipo de Moderación - Círculo Literario EC 📚",
        `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            
            <div style="background-color: #2c3e50; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Círculo Literario EC</h1>
            </div>

            <div style="padding: 40px; line-height: 1.6;">
                <h2 style="color: #2c3e50; margin-top: 0;">Bienvenido al equipo de Moderación</h2>
                <p>Se te ha asignado un rol de moderador y estas son tus credenciales de acceso para gestionar la plataforma:</p>
                
                <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2c3e50;">
                    <p style="margin: 5px 0;"><strong>Nombre de usuario:</strong> ${userName}</p>
                    <p style="margin: 5px 0;"><strong>Correo electrónico:</strong> ${userMail}</p>
                    <p style="margin: 5px 0;"><strong>Contraseña temporal:</strong> <span style="color: #e67e22; font-weight: bold;">${password}</span></p>
                </div>

                <p>Te recomendamos cambiar tu contraseña una vez que hayas ingresado por primera vez desde tu perfil.</p>

                <div style="text-align: center; margin: 35px 0;">
                    <a href="${urlLogin}" 
                       style="background-color: #2c3e50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                       Ingresar al sistema
                    </a>
                </div>

                <p style="font-size: 0.9em; color: #7f8c8d;">Si el botón no te redirige, usa este enlace:</p>
                <p style="font-size: 0.8em; word-break: break-all;"><a href="${urlLogin}" style="color: #3498db;">${urlLogin}</a></p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #95a5a6; border-top: 1px solid #eee;">
                <p style="margin: 5px 0;">Círculo Literario EC — 2026</p>
                <p style="margin: 5px 0;">Panel Administrativo / Moderación</p>
            </div>
        </div>
        `,
        textBody
    );
};


export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToCreateModerator
}
