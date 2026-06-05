import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import {
  ToastContainer
} from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

import PublicLayout from "./layout/PublicLayout"
import PrivateLayout from "./layout/PrivateLayout"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Forgot from "./pages/Forgot"
import Reset from "./pages/Reset"
import Confirm from "./pages/Confirm"

import Home from "./pages/Home"
import Comunidad from "./pages/Comunidad"
import Beneficios from "./pages/Beneficios"
import Contacto from "./pages/Contacto"
import Details from "./pages/Details"

import AdminDashboard from "./pages/admin/AdminDashboard"
import CreateModerator from "./pages/CreateModerator"
import ManageUsers from "./pages/admin/ManageUsers"
import ManageClubs from "./pages/admin/ManageClubs"
import ClubDetail from "./pages/admin/ClubDetail"
import MyClubs from "./pages/moderator/MyClubs"
import MyClubDetail from "./pages/moderator/MyClubDetail"
import Forbidden from "./pages/Forbidden"

import ModeratorDashboard from "./pages/moderator/ModeratorDashboard"

import Profile from "./pages/Profile"
import UserProfilePublic from "./pages/UserProfilePublic"
import Update from "./pages/Update"
import UserDetail from "./pages/UserDetail"

import UserPanel from "./pages/usuario/userPanel"
import ClubUsuarioDetail from "./pages/usuario/ClubUsuarioDetail"

import Menu from "./pages/Menu"
import ObrasMenu from "./pages/ObrasMenu"
import CrearObra from "./pages/CrearObra"
import MisObras from "./pages/MisObras"
import ObraDetalle from "./pages/ObraDetalle"
import ObraModeracion from "./pages/moderator/ObraModeracion"
import ModerationPanel from "./pages/moderator/ModerationPanel"

import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"

function App() {

  return (

    <>

      <BrowserRouter>

        <Routes>

          {/* REDIRECCIÓN */}
          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />

          {/* ========================= */}
          {/* RUTAS PUBLICAS */}
          {/* ========================= */}

          <Route element={<PublicLayout />}>

            <Route path="/home" element={<Home />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/beneficios" element={<Beneficios />} />
            <Route path="/contacto" element={<Contacto />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/auth/confirmar/:token"
              element={<Confirm />}
            />

            <Route path="/forgot" element={<Forgot />} />

            <Route
              path="/reset/password/:token"
              element={<Reset />}
            />

          </Route>

          {/* ========================= */}
          {/* RUTAS PRIVADAS */}
          {/* ========================= */}

          <Route
            element={
              <PrivateRoute>
                <PrivateLayout />
              </PrivateRoute>
            }
          >

            <Route path="/details" element={<Details />} />

            <Route
              path="/user-dashboard"
              element={<UserPanel />}
            />

            <Route
              path="/perfil/:id"
              element={<UserProfilePublic />}
            />

            <Route path="/menu" element={<Menu />} />

            <Route path="/mis-clubes/:id" element={<ClubUsuarioDetail />} />

            <Route path="/obras" element={<ObrasMenu />} />

            <Route
              path="/crear-obra/:clubId"
              element={<CrearObra />}
            />

            <Route
              path="/mis-obras"
              element={<MisObras />}
            />

            <Route
              path="/obra/:id"
              element={<ObraDetalle />}
            />

            <Route path="/perfil" element={<Profile />} />

            <Route
              path="/configuracion"
              element={<Update />}
            />

            <Route
              path="/dashboard"
              element={
                <Navigate
                  to="/user-dashboard"
                  replace
                />
              }
            />

          </Route>

          {/* ========================= */}
          {/* RUTAS ADMIN / MODERADOR */}
          {/* ========================= */}

          <Route
            element={
              <AdminRoute>
                <PrivateLayout />
              </AdminRoute>
            }
          >

            {/* DASHBOARD ADMIN */}
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* GESTION USUARIOS */}
            <Route
              path="/admin/usuarios"
              element={<ManageUsers />}
            />

            {/* GESTION CLUBES */}
            <Route
              path="/admin/clubes"
              element={<ManageClubs />}
            />

            <Route
              path="/clubes/:id"
              element={<ClubDetail />}
            />

            <Route
              path="/mis-clubes"
              element={<MyClubs />}
            />

            <Route
              path="/mis-clubes/:id"
              element={<MyClubDetail />}
            />

            {/* CREAR MODERADOR */}
            <Route
              path="/crear-moderador"
              element={<CreateModerator />}
            />

            {/* MODERADOR */}
            <Route
              path="/moderator"
              element={<ModeratorDashboard />}
            />

            {/* PANEL DE MODERACIÓN - OBRAS */}
            <Route
              path="/admin/moderacion"
              element={<ModerationPanel />}
            />

            <Route
              path="/moderacion/:id"
              element={<ObraModeracion />}
            />

            {/* DETALLES */}
            <Route
              path="/detalle/:tipo/:id"
              element={<UserDetail />}
            />

          </Route>

          <Route
            path="/forbidden"
            element={<Forbidden />}
          />

          {/* ========================= */}
          {/* 404 */}
          {/* ========================= */}

          <Route
            path="*"
            element={<Navigate to="/home" replace />}
          />

        </Routes>

      </BrowserRouter>

      {/* TOAST GLOBAL */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

    </>

  )
}

export default App