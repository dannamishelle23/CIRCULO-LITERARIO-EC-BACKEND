import api from "./api";

// Obtener capítulos por obra
export const getCapitulos = async (obraId) => {
  const res = await api.get(`/capitulos/obra/${obraId}`);
  return res.data;
};

// Crear capítulo
export const createCapitulo = async (obraId, data) => {
  const res = await api.post(`/capitulos/${obraId}`, data);
  return res.data;
};

// Actualizar capítulo
export const updateCapitulo = async (id, data) => {
  const res = await api.put(`/capitulos/${id}`, data);
  return res.data;
};

// Eliminar capítulo
export const deleteCapitulo = async (id) => {
  const res = await api.delete(`/capitulos/${id}`);
  return res.data;
};