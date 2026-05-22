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

/* VISUALIZAR MIS CLUBES ASIGNADOS */
export const getMyAssignedClubs = async () => {

  const response = await api.get(
    "/clubes/mis-clubes"
  );
  return response.data.clubes;
};

/* DETALLE DE MI CLUB ASIGNADO POR ID */
export const getMyAssignedClubById = async (clubId) => {
  const response = await api.get(
    `/clubes/mis-clubes/${clubId}`
  );
  return response.data.club;
}