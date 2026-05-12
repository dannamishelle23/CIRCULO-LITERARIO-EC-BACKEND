import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Comunidad from "./pages/Comunidad";
import Beneficios from "./pages/Beneficios";
import Contacto from "./pages/Contacto";
import AdminUsers from "./pages/AdminUsers";
import Forbidden from "./pages/Forbidden";
import Details from "./pages/Details";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Logs from "./pages/Logs";

import Navbar from "./components/Navbar";

import { isAdmin } from "./services/authService";

function App() {

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-[#FEF2E1]">

        <Navbar />

        <Routes>

          {/* REDIRECCION */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* PUBLICAS */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* PRIVADAS */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
              <Home />
          </PrivateRoute>}
          />

          <Route
            path="/comunidad"
            element={
              <PrivateRoute>
                <Comunidad />
              </PrivateRoute>}
          />

          <Route
            path="/beneficios"
            element={
              <PrivateRoute>
                <Beneficios />
              </PrivateRoute>}
          />

          <Route
            path="/contacto"
            element={
              <PrivateRoute>
                <Contacto />
              </PrivateRoute>}
          />

          {/* DETAILS */}
          <Route
            path="/details"
            element={
              <PrivateRoute>
                <Details />
              </PrivateRoute>}
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>}
          />

          <Route
            path="/logs"
            element={
              <AdminRoute>
                <Logs />
              </AdminRoute>}
          />

          {/* FORBIDDEN */}
          <Route
            path="/forbidden"
            element={<Forbidden />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;