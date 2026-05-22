import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, blockUser, reactivateUser } from "../../services/userService";
import { getMyAssignedClubs } from "../../services/clubService";
import { 
  FaUsersCog, 
  FaEye, 
  FaBookOpen, 
  FaUserFriends, 
  FaBan, 
  FaCheckCircle 
} from "react-icons/fa";
import PanelMenu from "../../components/PanelMenu";

export default function ModeratorDashboard() {
  const [users, setUsers] = useState([]);
  const [clubes, setClubes] = useState([]);
  const [activeTab, setActiveTab] = useState("clubes"); // 'clubes' o 'usuarios'
  const navigate = useNavigate();

  const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));

  const fetchData = async () => {
    try {
      const usuarios = await getUsers();
      const clubesAsignados = await getMyAssignedClubs();
      setUsers(usuarios);
      setClubes(clubesAsignados);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBlock = async (id) => {
    const confirmBlock = window.confirm("¿Seguro que deseas suspender temporalmente a este usuario?");
    if (!confirmBlock) return;
    try {
      await blockUser(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReactivate = async (id) => {
    const confirmReactivate = window.confirm("¿Deseas reactivar la cuenta de este usuario?");
    if (!confirmReactivate) return;
    try {
      await reactivateUser(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const lectoresAutores = users.filter((user) => user.rol === "Usuario");

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        <PanelMenu />

        {/* HEADER DE BIENVENIDA */}
        <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100/40">
              <FaUsersCog size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black bg-[#e67e22] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Workspace
              </span>
              <h1 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight mt-0.5">
                Panel de <span className="text-[#e67e22]">Moderación</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Monitorea el comportamiento de la comunidad y tus espacios asignados.
              </p>
            </div>
          </div>
        </div>

        {/* BARRA DE PESTAÑAS (TABS INTERNAS) */}
        <div className="flex border-b border-gray-200 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("clubes")}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "clubes"
                ? "border-[#e67e22] text-[#e67e22]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <FaBookOpen size={14} />
            Mis Clubes Asignados ({clubes.length})
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("usuarios")}
            className={`flex items-center gap-2 pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === "usuarios"
                ? "border-[#e67e22] text-[#e67e22]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <FaUserFriends size={14} />
            Gestión de Usuarios ({lectoresAutores.length})
          </button>
        </div>

        {/* PESTAÑA 1: CLUBES */}
        {activeTab === "clubes" && (
          <div className="transition-opacity duration-200">
            {clubes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubes.map((club) => (
                  <div
                    key={club._id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-amber-200 transition flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-black text-[#2c3e50] truncate">
                        {club.nombre}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 mt-1 mb-4">
                        {club.descripcion}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                      <div className="flex gap-1.5">
                        <span className="bg-amber-50 text-[#e67e22] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {club.generoLiterario}
                        </span>
                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {club.estadoClub ?? "Activo"}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/mis-clubes/${club._id}`)}
                        className="inline-flex items-center gap-1 bg-[#2c3e50] hover:bg-[#1b2836] text-white text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition tracking-wide cursor-pointer shadow-3xs"
                      >
                        Ver Información
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                <p className="text-sm font-medium text-gray-400">No registras clubes asignados bajo tu dirección actualmente.</p>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 2: GESTIÓN DE USUARIOS */}
        {activeTab === "usuarios" && (
          <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 overflow-hidden transition-opacity duration-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/70">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Lector / Autor</th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Correo Electrónico</th>
                    <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Estado</th>
                    <th className="px-6 py-3.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {lectoresAutores.length > 0 ? (
                    lectoresAutores.map((user) => {
                      const esSuspendido = user.estadoUsuario === "Suspendido";
                      const inicial = user.nombres ? user.nombres.charAt(0).toUpperCase() : "U";

                      return (
                        <tr key={user._id} className="hover:bg-slate-50/50 transition">
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#2c3e50] font-bold text-xs flex items-center justify-center border border-gray-200 select-none shrink-0">
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              esSuspendido 
                                ? "bg-red-50 text-red-600 border-red-100" 
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}>
                              {user.estadoUsuario ?? "Activo"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center items-center gap-2">
                              
                              {!esSuspendido ? (
                                user._id !== usuarioLogueado?._id && (
                                  <button
                                    onClick={() => handleBlock(user._id)}
                                    title="Suspender Cuenta"
                                    className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition cursor-pointer"
                                  >
                                    <FaBan size={14} />
                                  </button>
                                )
                              ) : (
                                <button
                                  onClick={() => handleReactivate(user._id)}
                                  title="Reactivar Cuenta"
                                  className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                                >
                                  <FaCheckCircle size={14} />
                                </button>
                              )}

                              <button
                                onClick={() => navigate(`/detalle/usuario/${user._id}`)}
                                title="Ver detalles completos"
                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                              >
                                <FaEye size={14} />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        No existen lectores registrados en el club todavía.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}