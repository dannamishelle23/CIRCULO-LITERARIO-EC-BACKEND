import api from "./api";

//Maneja login y localstorage
export const login = async (data) => {

  const response = await api.post("/auth/login", data);

  // GUARDAR TOKEN
  if (response.data.usuario?.token) {
    localStorage.setItem(
      "token",
      response.data.usuario.token
    );
  }

  // GUARDAR USUARIO COMPLETO
  if (response.data.usuario) {
    localStorage.setItem(
      "usuario",
      JSON.stringify(response.data.usuario)
    );
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

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  return usuario?.rol?.toLowerCase() === "administrador";
};

/*VALIDAR SI ES LECTOR*/
export const isLector = () => {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  return usuario?.rol?.toLowerCase() === "lector";
};

/*VALIDAR SI ES AUTOR*/
export const isAutor = () => {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  return usuario?.rol?.toLowerCase() === "autor";
};

/*OBTENER ROL*/
export const getRole = () => {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  return usuario?.rol;
};

/*LOGOUT*/
export const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};