import fs from 'fs';

// --- SIMULACIÓN DE VARIABLES DE ENTORNO Y DATOS ---
const fakeToken = "TOKEN_DE_PRUEBA_123456";
const fakeBackend = "http://localhost:3000/"; 

// --- URLS CONSTRUIDAS  ---
const urlConfirmacion = `${fakeBackend}confirmar-cuenta/${fakeToken}`;
const urlRecuperacion = `${fakeBackend}recuperar-contraseña/${fakeToken}`;

// --- PLANTILLA 1: REGISTRO  ---
const htmlRegister = `
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
`;

// --- PLANTILLA 2: RECUPERACIÓN ---
const htmlRecovery = `
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
`;

// --- GENERADOR DE LA PÁGINA DE GALERÍA ---
const finalView = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Galería de Correos - Círculo Literario EC</title>
    <style>
        body { background-color: #e5e7eb; padding: 40px 20px; margin: 0; }
        .wrapper { max-width: 900px; margin: 0 auto; }
        .tag { font-family: sans-serif; background: #2c3e50; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-bottom: 15px; display: inline-block; }
        .section { margin-bottom: 60px; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="section">
            <span class="tag">VISTA PREVIA: REGISTRO</span>
            ${htmlRegister}
        </div>

        <div class="section">
            <span class="tag">VISTA PREVIA: RECUPERACIÓN</span>
            ${htmlRecovery}
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync('vistas_previa.html', finalView);

console.log("-----------------------------------------");
console.log("Archivo 'vistas_previa.html' generado.");
console.log("Ábrelo para ver tus plantillas originales.");
console.log("-----------------------------------------");