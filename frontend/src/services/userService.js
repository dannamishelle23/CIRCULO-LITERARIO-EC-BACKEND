import api from "./api";

//MODERADORES

// CREAR MODERADOR
export const createModerator = async (data) => {

  const response = await api.post(
    "/usuarios/crear-moderador",
    data
  );

  return response.data;
};

// LISTAR MODERADORES
export const getModerators = async () => {

  const response = await api.get(
    "/usuarios/listar-moderadores"
  );

  return response.data["Moderadores registrados"];
};

// DETALLE MODERADOR
export const getModeratorById = async (id) => {

  try {

    const response = await api.get(
      `/usuarios/detalle-moderador/${id}`
    );

    return response.data.moderador;

  } catch (error) {

    console.error(error);

    throw error;
  }
};

// SUSPENDER MODERADOR
export const suspendModerator = async (id) => {

  const response = await api.patch(
    `/usuarios/deshabilitar-moderador/${id}`
  );

  return response.data;
};

//USUARIOS

// LISTAR USUARIOS
export const getUsers = async () => {

  const response = await api.get(
    "/usuarios/listar-usuarios"
  );

  return response.data["Usuarios registrados"];
};

// DETALLE USUARIO
export const getUserById = async (id) => {

  try {

    const response = await api.get(
      `/usuarios/detalle-usuario/${id}`
    );

    return response.data.usuario;

  } catch (error) {

    console.error(error);

    throw error;
  }
};

// SUSPENDER USUARIO
export const blockUser = async (id) => {

  const response = await api.patch(
    `/usuarios/suspender-usuario/${id}`
  );

  return response.data;
};

// REACTIVAR USUARIO
export const reactivateUser = async (id) => {

  const response = await api.patch(
    `/usuarios/reactivar-usuario/${id}`
  );

  return response.data;
};

// ELIMINAR USUARIO
export const deleteUser = async (id) => {

  const response = await api.delete(
    `/usuarios/eliminar-usuario/${id}`
  );

  return response.data;
};
