# Círculo Literario EC

DESARROLLO DE UN SISTEMA WEB PARA LA GESTIÓN DE CLUBES DE LECTURA DIGITALES Y PROMOCIÓN DE AUTORES EMERGENTES ECUATORIANOS

---

## Descripción

Círculo Literario EC es una plataforma diseñada para que escritores puedan participar en clubes literarios según géneros específicos, publicar sus obras por capítulos, someterlas a revisión por moderadores y participar en procesos de votación para seleccionar obras destacadas.

El sistema implementa control de acceso basado en roles, autenticación mediante JWT, almacenamiento de imágenes en Cloudinary y persistencia de datos utilizando MongoDB.

---

# Tecnologías Utilizadas

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Cloudinary
- Express Validator
- Bcrypt
- Vitest

---

# Arquitectura General

Frontend (React)

↓

Backend (Node.js + Express)

↓

MongoDB Atlas

↓

Cloudinary

---

# Estructura del Proyecto

<img width="194" height="307" alt="image" src="https://github.com/user-attachments/assets/f40886d7-cb21-46af-89c8-0a569d96acac" />

---

# Módulos del Sistema

## Usuarios

Permite:

- Registro de usuarios
- Inicio de sesión
- Gestión de perfil
- Avatar de usuario
- Perfil público

### Archivos relacionados

```txt
controllers/usuario_controller.js
models/Usuarios.js
routes/usuario_routes.js
validators/usuario_validator.js
