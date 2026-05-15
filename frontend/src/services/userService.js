import api from "./api";

/* CREAR MODERADOR */
export const createModerator = async (data) => {
  try {
    const response = await api.post(
      "/usuarios/crear-moderador",data);
    return response.data;
  } catch (error) {
    console.error("Error al crear moderador:", error);
    throw error;
  }
};

/* OBTENER MODERADORES */
export const getModerators = async () => {
  try {
    const response = await api.get("/usuarios/listar-moderadores");
    return response.data["Moderadores registrados"];
  } catch (error) {
    console.error("Error al obtener moderadores:", error);
    throw error;
  }
};

//Deshabilitar o suspender moderadores (SOLO LO HACE EL ADMINISTRADOR)
export const suspendModerator = async (id) => {
  try {
    const response = await api.post(`/usuarios/suspender-moderador/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al suspender moderador:", error);
    throw error;
  }
}

//Suspender usuario (LO HACE EL MODERADOR Y EL ADMINISTRADOR)
export const blockUser = async (id) => {
try {
  const response = await api.post(`/usuarios/suspender-usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al suspender usuario:", error);
    throw error;
  }
};

//Eliminar usuario (SOLO LO HACE EL ADMINISTRADOR)
export const deleteUser = async (id) => {
    try {
    const response = await api.delete(`/usuarios/eliminar-usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

//Reactivar cuenta de usuario (LO HACE EL MODERADOR Y EL ADMINISTRADOR)
export const reactivateUser = async (id) => {
  try {
    const response = await api.post(`/usuarios/reactivar-usuario/${id}`);
    return response.data;
  }
  catch (error) {
    console.error("Error al reactivar usuario:", error);
    throw error;
  }
}