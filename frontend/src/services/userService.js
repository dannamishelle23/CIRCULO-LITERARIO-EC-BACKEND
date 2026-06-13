import api from "./api";

//MODERADORES

// CREAR MODERADOR
export const createModerator = async (data) => {

  const response = await api.post(
    "/usuarios/crear-moderador",
    data
  );

  return response.data.data.moderador;
};

// LISTAR MODERADORES
export const getModerators = async () => {

  const response = await api.get(
    "/usuarios/listar-moderadores"
  );

  return response.data.data.moderadores;
};

// DETALLE MODERADOR
export const getModeratorById = async (id) => {

  try {

    const response = await api.get(
      `/usuarios/detalle-moderador/${id}`
    );

    return response.data.data.moderador;

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

  return response.data.data.usuarios;
};

// DETALLE USUARIO
export const getUserById = async (id) => {

  try {

    const response = await api.get(
      `/usuarios/detalle-usuario/${id}`
    );

    return response.data.data.usuario;

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

// ==========================================
// GESTIÓN EXCLUSIVA DE PERFIL (NUEVO)
// ==========================================
// Actualiza los datos de perfil e incluye soporte para la subida de archivos (Avatar).
export const updateProfile = async (id, formData) => {
  try {
    const response = await api.put(
      `/usuarios/actualizar-perfil/${id}`, // Asegúrate de que esta ruta coincida con tu enrutador de Express
      formData,
      {
        headers: {
          // Obligatorio para que Axios configure correctamente los boundaries del archivo binario
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error en updateProfile service:", error);
    throw error;
  }
};

// VER PERFIL PÚBLICO DE USUARIO
export const getPerfilUsuario = async (id) => {
  const response = await api.get(`/usuarios/perfil/${id}`);
  return response.data;
};