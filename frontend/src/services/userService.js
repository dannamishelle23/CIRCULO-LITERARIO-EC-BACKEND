import api from "./api";

/* OBTENER MODERADORES */
export const getUsers = async () => {
  try {
    const response = await api.get("/usuario/listar-moderadores");
    return response.data;
  } catch (error) {
    console.error("Error al obtener moderadores:", error);
    throw error;
  }
};

/* CREAR MODERADOR */
export const createUser = async (data) => {
  try {
    const response = await api.post(
      "/usuario/crear-moderador",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear moderador:", error);
    throw error;
  }
};

/* Estas funciones aún no existen en backend */
export const deleteUser = async () => {
  console.warn("Ruta eliminar moderador no implementada");
};

export const changeRole = async () => {
  console.warn("Ruta cambiar rol no implementada");
};

export const blockUser = async () => {
  console.warn("Ruta bloquear moderador no implementada");
};