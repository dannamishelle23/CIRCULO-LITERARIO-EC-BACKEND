import api from "./api";

// 📥 obtener capítulos por obra
export const getCapitulos = async (obraId) => {
  const res = await api.get(`/obras/${obraId}/capitulos`);
  return res.data;
};

// ➕ crear capítulo
export const createCapitulo = async (obraId, data) => {
  const res = await api.post(`/obras/${obraId}/capitulos`, data);
  return res.data;
};

// ✏️ actualizar capítulo
export const updateCapitulo = async (id, data) => {
  const res = await api.put(`/capitulos/${id}`, data);
  return res.data;
};

// ❌ eliminar capítulo
export const deleteCapitulo = async (id) => {
  const res = await api.delete(`/capitulos/${id}`);
  return res.data;
};