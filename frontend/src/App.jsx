import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layout/PublicLayout";
import PrivateLayout from "./layout/PrivateLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import Confirm from "./pages/Confirm";

import Home from "./pages/Home";
import Comunidad from "./pages/Comunidad";
import Beneficios from "./pages/Beneficios";
import Contacto from "./pages/Contacto";
import Details from "./pages/Details";
import AdminUsers from "./pages/AdminUsers";
import ModeratorUsers from "./pages/ModeratorUsers";
import Profile from "./pages/Profile";
import Update from "./pages/Update";
import UserDetail from "./pages/UserDetail";
import UserPanel from "./pages/userPanel";
import Menu from "./pages/Menu";
import ObrasMenu from "./pages/ObrasMenu";
import CrearObra from "./pages/CrearObra";
import MisObras from "./pages/MisObras";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* REDIRECCIÓN */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* RUTAS PUBLICAS (con Navbar) */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/confirmar/:token" element={<Confirm />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset/password/:token" element={<Reset />} />
        </Route>

        {/* RUTAS PRIVADAS */}
        <Route element={<PrivateRoute><PrivateLayout /></PrivateRoute>}>

          <Route path="/home" element={<Home />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/beneficios" element={<Beneficios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/details" element={<Details />} />
          <Route path="/admin" element={<AdminUsers />} />
          <Route path="/moderator" element={<ModeratorUsers />} />
          <Route path="/user-dashboard" element={<UserPanel />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/obras" element={<ObrasMenu />} />
          <Route path="/crear-obra" element={<CrearObra />} />
          <Route path="/mis-obras" element={<MisObras />} />
          <Route path="/dashboard" element={<Navigate to="/user-dashboard" replace />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/configuracion" element={<Update />} />
          <Route path="/detalle/:tipo/:id" element={<UserDetail />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;