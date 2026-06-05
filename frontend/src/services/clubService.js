import api from "./api";

/* CREAR CLUB */
export const createClub = async (data) => {

  const response = await api.post(
    "/clubes/crear-club",
    data
  );

  return response.data;
};

/* LISTAR CLUBES */
export const getClubs = async () => {

  const response = await api.get(
    "/clubes/listar-clubes"
  );

  return response.data.clubes;
};

/* DETALLE DE CLUB POR ID */
export const getClubById = async (clubId) => {

  const response = await api.get(
    `/clubes/detalle-club/${clubId}`
  );

  return response.data.club;
};

/* ASIGNAR MODERADOR */
export const assignModerator = async (
  clubId,
  moderadorId
) => {

  const response = await api.patch(
    `/clubes/asignar-moderador/${clubId}/${moderadorId}`
  );

  return response.data;
};

/* VISUALIZAR MIS CLUBES ASIGNADOS (para moderadores) */
export const getMyAssignedClubs = async () => {
  try {
    const response = await api.get(
      "/clubes/mis-clubes"
    );
    return response.data.clubes;
  } catch (error) {
    // Si falla (no es moderador), intentar obtener todos los clubes
    if (error.response?.status === 403) {
      return await getClubs();
    }
    throw error;
  }
};

/* DETALLE DE MI CLUB ASIGNADO POR ID */
export const getMyAssignedClubById = async (clubId) => {
  const response = await api.get(
    `/clubes/mis-clubes/${clubId}`
  );
  return response.data.club;
}

/* ACTUALIZAR CLUB */
export const updateClub = async (clubId, data) => {
  const response = await api.patch(
    `/clubes/actualizar-club/${clubId}`,
    data
  );
  return response.data.club;
}

/* SUSPENDER CLUB */
export const suspendClub = async (clubId) => {
  const response = await api.patch(
    `/clubes/suspender-club/${clubId}`
  );
  return response.data.club;
}

/* REACTIVAR CLUB */
export const reactivarClub = async (clubId) => {
  const response = await api.patch(`/clubes/reactivar-club/${clubId}`);
  return response.data;
};

/* QUITAR MODERADOR DE CLUB */
export const quitarModeradorClub = async (clubId, moderadorId) => {
  const response = await api.patch(`/clubes/quitar-moderador/${clubId}/${moderadorId}`);
  return response.data;
};

/* SOLICITAR UNIÓN A UN CLUB (LECTOR/AUTOR) */
export const solicitarUnionClub = async (clubId) => {
  const response = await api.post(`/club-miembros/unirse/${clubId}`);
  return response.data;
};

// Obtener solicitudes pendientes de un club específico
export const listarSolicitudesClub = async (clubId) => {
  const response = await api.get(`/club-miembros/solicitudes/${clubId}`);
  return response.data;
};

// Aprobar a un usuario
export const aprobarSolicitudClub = async (solicitudId) => {
  const response = await api.patch(`/club-miembros/aprobar/${solicitudId}`);
  return response.data;
};

// Rechazar a un usuario
export const rechazarSolicitudClub = async (solicitudId) => {
  const response = await api.patch(`/club-miembros/rechazar/${solicitudId}`);
  return response.data;
};

// Obtener los miembros aprobados de un club específico
export const listarMiembrosClub = async (clubId) => {
  const response = await api.get(`/club-miembros/visualizar/${clubId}`);
  return response.data; 
};

export const getMisSolicitudes = async () => {
  const response = await api.get("/club-miembros/mis-solicitudes");
  return response.data;
};