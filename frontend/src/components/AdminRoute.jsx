import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const AdminRoute = ({ children }) => {

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const rol = usuario?.rol;

  return (
    rol === "Administrador" ||
    rol === "Moderador"
  )
    ? children
    : <Navigate to="/forbidden" replace />;
};

export default AdminRoute;