# 📚 Círculo Literario EC

**DESARROLLO DE UN SISTEMA WEB PARA LA GESTIÓN DE CLUBES DE LECTURA DIGITALES Y PROMOCIÓN DE AUTORES EMERGENTES ECUATORIANOS**

---

## 📖 Descripción

**Círculo Literario EC** es una plataforma web diseñada para que escritores ecuatorianos emergentes puedan:

- 👥 Participar en clubes literarios según géneros específicos
- 📝 Publicar sus obras por capítulos
- ✅ Someterlas a revisión por moderadores especializados
- 🗳️ Participar en procesos de votación para seleccionar obras destacadas
- 💬 Recibir comentarios de la comunidad durante 2 semanas de publicación

El sistema implementa control de acceso basado en roles (Admin, Moderador, Lector/Autor), autenticación mediante JWT, almacenamiento de imágenes en Cloudinary y persistencia de datos usando MongoDB.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación segura
- **Brevo API** - Envío de emails
- **Cloudinary** - Almacenamiento de imágenes
- **Express Validator** - Validación de datos
- **Bcrypt** - Encriptación de contraseñas
- **Vitest** - Testing unitario
- **Multer** - Manejo de archivos

### Herramientas de Despliegue
- **Render** - Backend hosting
- **MongoDB Atlas** - Base de datos cloud
- **Cloudinary** - CDN de imágenes

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                 Frontend (React + Vite)                 │
│            Netlify: circuloliterarioec.netlify.app      │
└────────────────────────┬────────────────────────────────┘
                         │ (Axios API Calls)
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Backend (Node.js + Express)                  │
│              Render: https://api-circulo.render.com     │
└────┬────────────────────────┬────────────────┬──────────┘
     │                        │                │
     ▼                        ▼                ▼
┌──────────────┐    ┌──────────────┐   ┌──────────────┐
│   MongoDB    │    │  Cloudinary  │   │  Brevo API   │
│   Atlas      │    │  (Imágenes)  │   │  (Emails)    │
└──────────────┘    └──────────────┘   └──────────────┘
```

---

## 📁 Estructura del Proyecto

```
Circulo-Literario-EC-new/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── nodemailer.js          (Configuración de Brevo API)
│   │   ├── controllers/               (Lógica de negocio)
│   │   ├── models/                    (Esquemas MongoDB)
│   │   ├── routers/                   (Definición de rutas)
│   │   ├── middlewares/               (JWT, validación, roles)
│   │   ├── validators/                (Validación de datos)
│   │   ├── helpers/                   (Funciones auxiliares)
│   │   ├── utils/                     (Utilidades)
│   │   ├── scripts/                   (Crear admin inicial)
│   │   ├── database.js                (Conexión MongoDB)
│   │   ├── index.js                   (Punto de entrada)
│   │   └── server.js                  (Configuración Express)
│   ├── .env                           (Variables de entorno)
│   └── package.json

```

---

## 🚀 Instalación y Ejecución Local

### Requisitos Previos
- Node.js v16+
- MongoDB local o MongoDB Atlas
- Cuenta en Cloudinary
- Cuenta en Brevo (para envío de emails)
- Git

### Backend (Local)

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tuusuario/Circulo-Literario-EC-new.git
cd Circulo-Literario-EC-new/backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno** - Crear `.env`:
```env
# SERVIDOR
PORT=3000

# BASE DE DATOS
MONGODB_URI_LOCAL=mongodb://localhost:27017/circulo-literario-ec
MONGODB_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/circulo-literario-ec

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion

# BREVO (Emails)
BREVO_API_KEY=tu_clave_api_brevo
BREVO_FROM_NAME=Círculo Literario EC
BREVO_FROM_EMAIL=noreply@circuloliterario.ec
BREVO_REPLY_TO_EMAIL=noreply@circuloliterario.ec

# CLOUDINARY (Imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# FRONTEND
URL_FRONTEND=http://localhost:5173

# ADMIN INICIAL
ADMIN_NOMBRES=Tu Nombre
ADMIN_APELLIDOS=Tu Apellido
ADMIN_EMAIL=admin@circuloliterario.ec
ADMIN_PASSWORD=PasswordSeguro123!
ADMIN_USERNAME=admin_circulo
ADMIN_FECHA_NACIMIENTO=1990-01-01
ADMIN_PROVINCIA=Pichincha
```

4. **Ejecutar servidor:**
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### Ejecutar pruebas del backend
```bash
cd backend
npm test
```

La suite actual ejecuta 99 pruebas en 14 archivos de test, cubriendo controladores, middlewares y rutas de aceptación.

## 🌐 Despliegue en Producción

### Backend en Render

1. **Crear aplicación en Render.com:**
   - Conectar repositorio GitHub
   - Seleccionar rama `main`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Configurar variables de entorno en Render:**
   - `MONGODB_URL` - URI de MongoDB Atlas
   - `BREVO_API_KEY` - Clave API Brevo
   - `BREVO_FROM_NAME` - Nombre para emails
   - `BREVO_FROM_EMAIL` - Email remitente
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `JWT_SECRET` - Secreto JWT (generado aleatorio, diferente a local)
   - `URL_FRONTEND=https://circuloliterarioec.netlify.app` 

3. **Deploy automático** - Se activa con cada push a `main`

---

## 📚 Módulos del Sistema

### 1. **Autenticación (Auth)**
**Rutas:** `/api/auth/*`

- Registro de usuarios
- Confirmación de email
- Recuperación de contraseña
- Inicio de sesión con JWT

### 2. **Usuarios**
**Rutas:** `/api/usuario/*`

- Gestión de perfiles
- Creación de moderadores (Admin)
- Gestión de usuarios (Admin/Moderador)
- Suspensión y reactivación de cuentas

### 3. **Clubes Literarios**
**Rutas:** `/api/club/*`

- Creación de clubes (Admin)
- Asignación de moderadores (Admin)
- Listado y detalles de clubes
- Suspensión y reactivación de clubes

### 4. **Membresía en Clubes**
**Rutas:** `/api/clubMiembros/*`

- Solicitudes de unión (Usuarios)
- Aprobación/rechazo (Moderador)
- Listado de miembros

### 5. **Obras Literarias**
**Rutas:** `/api/obras/*`

- Crear obras (Autor)
- Postular para revisión
- Aprobación/rechazo (Moderador)
- Votación de obras
- Publicación

### 6. **Capítulos**
**Rutas:** `/api/capitulos/*`

- Crear capítulos en obras
- Editar y eliminar capítulos
- Organización secuencial

### 7. **Comentarios**
**Rutas:** `/api/comentarios/*`

- Comentarios en obras publicadas
- Válido solo durante 2 semanas después de publicación
- Edición y eliminación por autor

---

## 👥 Tipos de Usuarios y Permisos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Administrador** | Gestiona todo el sistema | Crear clubes, moderadores, usuarios. Suspender/reactivar. |
| **Moderador** | Gestiona un club específico | Revisar obras, iniciar/cerrar votaciones, aprobar membresías. |
| **Autor/Lector** | Usuario regular | Crear obras, participar en votaciones, comentar. |
| **Visitante** | Sin autenticar | Solo ver información pública (home, comunidad, beneficios). |

---

## 🔐 Seguridad Implementada

- ✅ Contraseñas hasheadas con Bcrypt
- ✅ Autenticación JWT con tokens
- ✅ Validación de datos en backend
- ✅ Control de acceso basado en roles
- ✅ Verificación de email para confirmación
- ✅ Recuperación de contraseña segura
- ✅ Protección contra CORS

---

## 🧪 Testing

### Ejecutar tests unitarios:
```bash
npm run test
```

### Archivos de test:
- `backend/src/utils/calcularEdad.test.js`
- `backend/src/validators/auth_validator.test.js`
- `backend/src/controllers/comentarios_controller.test.js`

---

## 📧 Configuración de Brevo API

El sistema usa **Brevo (anteriormente Sendinblue)** para envío de emails vía REST API.

**Obtener clave API:**
1. Registrarse en [brevo.com](https://www.brevo.com)
2. Ir a **Settings** → **SMTP & API**
3. Generar nueva clave API
4. Usar en variable `BREVO_API_KEY`

**Emails que envía:**
- Confirmación de registro
- Recuperación de contraseña
- Credenciales de moderador

---

## 🖼️ Almacenamiento de Imágenes con Cloudinary

**Obtener credenciales:**
1. Crear cuenta en [cloudinary.com](https://cloudinary.com)
2. Ir al **Dashboard**
3. Copiar `Cloud Name`, `API Key`, `API Secret`

**Uso en el sistema:**
- Portadas de obras
- Avatares de usuarios
- Imágenes de clubs

---

## 🚨 Solución de Problemas

### "Email no confirma cuenta"
- Verificar que `BREVO_API_KEY` sea válida

### "Imágenes no se cargan"
- Verificar credenciales de Cloudinary
- Revisar permisos de la carpeta en Cloudinary

### "Erro de CORS"
- Verificar que backend está en modo development
- Revisar configuración de CORS en `server.js`

---

## 📝 API Endpoints Principales

**Base URL:** `https://api-circulo.render.com/api`

### Autenticación
- `POST /auth/registro` - Registrarse
- `GET /auth/confirmar/:token` - Confirmar email
- `POST /auth/login` - Iniciar sesión
- `POST /auth/recuperar-password` - Recuperar contraseña

### Usuarios
- `GET /usuario/perfil` - Mi perfil
- `GET /usuario/perfil/:id` - Perfil público
- `PATCH /usuario/actualizar-perfil/:id` - Actualizar perfil

### Clubes
- `POST /club/crear-club` - Crear club (Admin)
- `GET /club/listar-clubes` - Listar clubes
- `GET /club/detalle-club/:id` - Detalles del club

### Obras
- `POST /obras` - Crear obra
- `GET /obras/obras-votacion/:clubId` - Obras en votación
- `GET /obras/obras-publicadas/:clubId` - Obras publicadas
- `POST /obras/:id/votar` - Votar obra

---

## 📞 Contacto y Soporte

Para más información sobre el proyecto, visita:
- **Sitio:** https://circuloliterarioec.netlify.app
- **Email:** gdbooksreviews@gmail.com

---

## 👩‍💻 Créditos y Agradecimientos

### Autora Principal
**Danna López** - Desarrolladora
- Diseño y desarrollo del sistema completo
- Gestión de base de datos
- Integración de APIs
- Despliegue en producción

### Agradecimientos Especiales

Un profundo agradecimiento a:

💝 **Gabriela Ayala** - Mi mejor amiga, por su apoyo incondicional, motivación constante y ser mi mayor impulsora en este proyecto.

🤝 **Todas las personas que colaboraron y probaron este proyecto:**
- Contribuidores que revisaron código
- A las personas que aportaron feedback
- Toda la comunidad ecuatoriana de lectores y autores que inspiraron esta plataforma

Este proyecto es un esfuerzo colaborativo dedicado a promover la literatura ecuatoriana y crear una comunidad vibrante de escritores emergentes.

---

## 📄 Licencia

Proyecto desarrollado para uso educativo y comercial.

**Última actualización:** Junio 2026
