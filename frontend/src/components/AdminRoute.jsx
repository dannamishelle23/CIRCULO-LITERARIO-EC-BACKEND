import { Navigate } from "react-router-dom";

import { isAdmin } from "../services/authService";

const AdminRoute = ({ children }) => {

  return isAdmin()
    ? children
    : <Navigate to="/forbidden" replace />;
};

export default AdminRoute;