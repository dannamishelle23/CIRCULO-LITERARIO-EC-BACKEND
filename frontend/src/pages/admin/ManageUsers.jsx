import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getModerators,
  getUsers,
  suspendModerator,
  blockUser,
  deleteUser,
  reactivateUser
} from "../../services/userService";

import {
  FaUsersCog,
  FaEye,
} from "react-icons/fa";
import PanelMenu from "../../components/PanelMenu";

export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const usuarioLogueado = JSON.parse(
    localStorage.getItem("usuario")
  );

  const esAdministrador =
    usuarioLogueado?.rol === "Administrador";

  /* OBTENER MODERADORES Y USUARIOS */
  const fetchUsers = async () => {

    try {

      const moderadores = await getModerators();

      const usuarios = await getUsers();

      setUsers([
        ...moderadores,
        ...usuarios
      ]);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* SUSPENDER MODERADOR */
  const handleSuspendModerator = async (id) => {

    const confirmSuspend = window.confirm(
      "¿Deseas suspender este moderador?"
    );

    if (!confirmSuspend) return;

    try {

      await suspendModerator(id);

      fetchUsers();

    } catch (error) {
      console.error(error);
    }
  };

  /* SUSPENDER USUARIO */
  const handleBlock = async (id) => {

    const confirmBlock = window.confirm(
      "¿Deseas suspender este usuario?"
    );

    if (!confirmBlock) return;

    try {

      await blockUser(id);

      fetchUsers();

    } catch (error) {
      console.error(error);
    }
  };

  /* ELIMINAR USUARIO */
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "¿Deseas eliminar este usuario?"
    );

    if (!confirmDelete) return;

    try {

      await deleteUser(id);

      fetchUsers();

    } catch (error) {
      console.error(error);
    }
  };

  /* REACTIVAR */
  const handleReactivate = async (id) => {

    const confirmReactivate = window.confirm(
      "¿Deseas reactivar esta cuenta?"
    );

    if (!confirmReactivate) return;

    try {

      await reactivateUser(id);

      fetchUsers();

    } catch (error) {
      console.error(error);
    }
  };

  /* FILTRAR */
  const moderadores = users.filter(
    (user) => user.rol === "Moderador"
  );

  const lectoresAutores = users.filter(
    (user) => user.rol === "Usuario"
  );

  /* TABLA */
  const renderTable = (title, data) => (

    <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">

      <div className="bg-amber-700 text-white px-6 py-4">
        <h2 className="text-2xl font-bold">
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-amber-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Usuario
              </th>

              <th className="px-6 py-4 text-left">
                Correo
              </th>

              <th className="px-6 py-4 text-left">
                Rol
              </th>

              <th className="px-6 py-4 text-center">
                Estado
              </th>

              <th className="px-6 py-4 text-center">
                Acciones
              </th>

            </tr>

          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-8 text-slate-500"
                >
                  No hay usuarios
                </td>

              </tr>

            ) : (

              data.map((user) => (

                <tr
                  key={user._id}
                  className="border-b border-slate-200 hover:bg-amber-50 transition"
                >

                  {/* NOMBRE */}
                  <td className="px-6 py-5">

                    <p className="font-bold text-[#2c3e50]">
                      {user.nombres} {user.apellidos}
                    </p>

                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-5 text-slate-600">
                    {user.email}
                  </td>

                  {/* ROL */}
                  <td className="px-6 py-5">

                    <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
                      {user.rol}
                    </span>

                  </td>

                  {/* ESTADO */}
                  <td className="px-6 py-5 text-center">

                    <span
                      className={
                        user.estadoUsuario === "Suspendido"
                          ? "bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold"
                          : "bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold"
                      }
                    >
                      {user.estadoUsuario}
                    </span>

                  </td>

                  {/* ACCIONES */}
                  <td className="px-6 py-5">

                    <div className="flex justify-center gap-3 flex-wrap">

                      {/* SUSPENDER */}
                      {user.estadoUsuario === "Activo" &&
                        user._id !== usuarioLogueado._id && (

                          <button
                            onClick={() =>
                              user.rol === "Moderador"
                                ? handleSuspendModerator(user._id)
                                : handleBlock(user._id)
                            }
                            className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl transition"
                          >
                            Suspender
                          </button>

                      )}

                      {/* REACTIVAR */}
                      {user.estadoUsuario === "Suspendido" && (

                        <button
                          onClick={() =>
                            handleReactivate(user._id)
                          }
                          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl transition"
                        >
                          Reactivar
                        </button>

                      )}

                      <button
                        onClick={() =>
                          navigate(
                            `/detalle/${
                              user.rol === "Moderador"
                                ? "moderador"
                                : "usuario"
                            }/${user._id}`
                          )
                        }
                        className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl transition"
                      >
                        <FaEye />
                      </button>

                      {/* ELIMINAR SOLO USUARIOS */}
                      {esAdministrador &&
                        user.rol === "Usuario" &&
                        user._id !== usuarioLogueado._id && (

                          <button
                            onClick={() =>
                              handleDelete(user._id)
                            }
                            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-xl transition"
                          >
                            Eliminar
                          </button>

                      )}

                    </div>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );

  return (

    <section className="min-h-screen bg-[#FEF2E1] py-12 px-6">

      <div className="max-w-7xl mx-auto">

        <PanelMenu />

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <div className="flex items-center gap-4">

            <div className="bg-amber-100 p-5 rounded-2xl">
              <FaUsersCog className="text-5xl text-amber-700" />
            </div>

            <div>

              <h1 className="text-4xl font-black text-[#2c3e50]">
                Panel Administrativo
              </h1>

              <p className="text-slate-500 mt-2">
                Gestiona moderadores y usuarios
              </p>

            </div>

          </div>

          {esAdministrador && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate("/crear-moderador")}
                className="bg-amber-700 hover:bg-amber-600 text-white px-5 py-3 rounded-xl"
              >
                Añadir Moderador
              </button>
            </div>
          )}

        </div>

        {/* MODERADORES */}
        {renderTable(
          "Gestión de Moderadores",
          moderadores
        )}

        {/* USUARIOS */}
        {renderTable(
          "Gestión de Lectores y Autores",
          lectoresAutores
        )}

      </div>

    </section>
  );
}