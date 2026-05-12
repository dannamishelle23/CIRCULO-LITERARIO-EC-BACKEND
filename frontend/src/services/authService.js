import api from "./api";

/*LOGIN*/
export const login = async (data) => {

  const response = await api.post("/auth/login", data);

  // GUARDAR TOKEN
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  // GUARDAR ROL
  if (response.data.user?.role) {
    localStorage.setItem("role", response.data.user.role);
  }

  return response.data;
};

/*REGISTER*/
export const register = async (data) => {

  const response = await api.post("/auth/register", data);

  return response.data;
};

/*VALIDAR SI ES ADMIN*/
export const isAdmin = () => {

  const role = localStorage.getItem("role");

  return role === "admin";
};

/*VALIDAR SI ES USUARIO*/
/*VALIDAR SI ES LECTOR*/
export const isLector = () => {

  const role = localStorage.getItem("role");

  return role === "lector";
};

/*VALIDAR SI ES AUTOR*/
export const isAutor = () => {

  const role = localStorage.getItem("role");

  return role === "autor";
};

/*OBTENER ROL*/
export const getRole = () => {

  return localStorage.getItem("role");
};

/*LOGOUT*/
export const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("role");
};