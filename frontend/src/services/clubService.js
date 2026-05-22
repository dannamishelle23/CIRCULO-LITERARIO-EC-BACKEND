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

  return response.data["Clubes creados: "];
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