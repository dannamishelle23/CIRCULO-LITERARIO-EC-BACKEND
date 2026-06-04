import { Router } from "express";

import {
  crearCapitulo,
  listarCapitulos,
  detalleCapitulo,
  editarCapitulo,
  eliminarCapitulo
} from "../controllers/capitulos_controller.js";

import {
  verificarTokenJWT
} from "../middlewares/JWT.js";

const router = Router();

// Crear capítulo
router.post(
  "/:id",
  verificarTokenJWT,
  crearCapitulo
);

// Listar capítulos de una obra
router.get(
  "/obra/:id",
  verificarTokenJWT,
  listarCapitulos
);

// Ver un capítulo específico
router.get(
  "/detalle/:capituloId",
  verificarTokenJWT,
  detalleCapitulo
);

// Editar capítulo
router.put(
  "/:capituloId",
  verificarTokenJWT,
  editarCapitulo
);

// Eliminar capítulo
router.delete(
  "/:capituloId",
  verificarTokenJWT,
  eliminarCapitulo
);

export default router;