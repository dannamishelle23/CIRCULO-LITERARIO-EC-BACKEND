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
import { FaUsersCog, FaEye, FaPlus, FaBan, FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import PanelMenu from "../../components/PanelMenu";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));
  const esAdministrador = usuarioLogueado?.rol === "Administrador" || usuarioLogueado?.rol === "Admin";

  const fetchUsers = async () => {
    try {
      const moderadores = await getModerators();
      const usuarios = await getUsers();
      setUsers([...moderadores, ...usuarios]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspendModerator = async (id) => {
    if (!window.confirm("¿Deseas revocar temporalmente los accesos de este moderador?")) return;
    try {
      await suspendModerator(id);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlock = async (id) => {
    if (!window.confirm("¿Seguro que deseas suspender la cuenta de este usuario?")) return;
    try {
      await blockUser(id);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Esta acción es irreversible. ¿Eliminar permanentemente la cuenta?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReactivate = async (id) => {
    if (!window.confirm("¿Reactivar accesos y cuenta del usuario seleccionado?")) return;
    try {
      await reactivateUser(id);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const moderadores = users.filter((user) => user.rol === "Moderador");
  const lectoresAutores = users.filter((user) => user.rol === "Usuario");

  const renderTable = (title, data) => (
    <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 bg-slate-50 border-b border-gray-100">
        <h2 className="text-xs font-black uppercase tracking-wider text-[#2c3e50]">{title} ({data.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/40">
            <tr>
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Usuario</th>
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Correo Electrónico</th>
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Rol</th>
              <th className="px-6 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Estado</th>
              <th className="px-6 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Operaciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-xs font-medium text-gray-400 uppercase tracking-widest">
                  Sin registros válidos bajo este rol.
                </td>
              </tr>
            ) : (
              data.map((user) => {
                const esSuspendido = user.estadoUsuario === "Suspendido";
                const inicial = user.nombres ? user.nombres.charAt(0).toUpperCase() : "U";

                return (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#2c3e50] font-bold text-xs flex items-center justify-center border border-gray-200 select-none">
                          {inicial}
                        </div>
                        <span className="text-sm font-bold text-[#2c3e50] capitalize">
                          {user.nombres} {user.apellidos}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-amber-50 text-[#e67e22] px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border border-amber-100/40">
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        esSuspendido 
                          ? "bg-red-50 text-red-600 border-red-100" 
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}>
                        {user.estadoUsuario ?? "Activo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-1.5">
                        {!esSuspendido ? (
                          user._id !== usuarioLogueado?._id && (
                            <button
                              onClick={() => user.rol === "Moderador" ? handleSuspendModerator(user._id) : handleBlock(user._id)}
                              title="Suspender Cuenta"
                              className="p-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition cursor-pointer"
                            >
                              <FaBan size={12} />
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => handleReactivate(user._id)}
                            title="Reactivar Cuenta"
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                          >
                            <FaCheckCircle size={12} />
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/detalle/${user.rol === "Moderador" ? "moderador" : "usuario"}/${user._id}`)}
                          title="Ver Ficha Completa"
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                        >
                          <FaEye size={12} />
                        </button>

                        {esAdministrador && user.rol === "Usuario" && user._id !== usuarioLogueado?._id && (
                          <button
                            onClick={() => handleDelete(user._id)}
                            title="Destruir Registro"
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                          >
                            <FaTrashAlt size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PanelMenu />

        {/* HEADER DE BIENVENIDA */}
        <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100/40 shrink-0">
              <FaUsersCog size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black bg-[#e67e22] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Workspace Global
              </span>
              <h1 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight mt-0.5">
                Control de <span className="text-[#e67e22]">Usuarios</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Supervisa el estado de las cuentas, regula privilegios y gestiona el equipo de moderación.
              </p>
            </div>
          </div>

          {esAdministrador && (
            <div className="shrink-0 flex sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/crear-moderador")}
                className="inline-flex items-center gap-2 bg-[#2c3e50] hover:bg-[#1b2836] text-white text-xs font-bold uppercase px-4 py-2.5 rounded-xl transition tracking-wide cursor-pointer shadow-3xs"
              >
                <FaPlus size={10} /> Añadir Moderador
              </button>
            </div>
          )}
        </div>

        {/* TABLAS SEPARADAS */}
        {renderTable("Gestión de Moderadores del Sistema", moderadores)}
        {renderTable("Gestión de Lectores y Autores", lectoresAutores)}
      </div>
    </section>
  );
}