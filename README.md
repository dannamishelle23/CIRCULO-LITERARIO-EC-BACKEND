# Circulo Literario EC
## Configuracion del frontend

Antes de ejecutar el frontend, crea un archivo `frontend/.env` tomando como base `frontend/.env.example`.

Variable requerida:

`VITE_BACKEND_URL=http://localhost:3000`

El frontend construye las rutas hacia el backend agregando `/api` internamente, por lo que la variable debe apuntar solo al host y puerto del servidor.
