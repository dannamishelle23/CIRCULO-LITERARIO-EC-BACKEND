import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  createClub, 
  getClubs, 
  assignModerator, 
  updateClub, 
  suspendClub, 
  reactivarClub, 
  quitarModeradorClub 
} from "../../services/clubService";
import { getModerators } from "../../services/userService";
import { 
  FaBookOpen, 
  FaPlus, 
  FaUserCheck, 
  FaEye, 
  FaEdit, 
  FaBan, 
  FaCheckCircle, 
  FaUserMinus, 
  FaTimes, 
  FaImage 
} from "react-icons/fa";
import PanelMenu from "../../components/PanelMenu";

export default function ManageClubs() {
  const [clubes, setClubes] = useState([]);
  const [moderadores, setModeradores] = useState([]);
  const navigate = useNavigate();

  // Estados para creación de club
  const [nombre, setNombre] = useState("");
  const [generoLiterario, setGeneroLiterario] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [portada, setPortada] = useState(null);

  // Estados para modal de edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editPortada, setEditPortada] = useState(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, msg: "" });

  const fetchData = async () => {
    try {
      const clubesData = await getClubs();
      const moderadoresData = await getModerators();
      setClubes(clubesData);
      setModeradores(moderadoresData.filter((mod) => mod.estadoUsuario === "Active" || mod.estadoUsuario === "Activo"));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: null, msg: "" }), 3500);
  };

  // 1. CREAR CLUB (Con soporte opcional para Portada en FormData si decides implementarlo)
  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      // Nota: Si usas req.files.portada en el backend, es mejor enviar FormData
      let dataToSend;
      if (portada) {
        dataToSend = new FormData();
        dataToSend.append("nombre", nombre);
        dataToSend.append("generoLiterario", generoLiterario);
        dataToSend.append("descripcion", descripcion);
        dataToSend.append("portada", portada);
      } else {
        dataToSend = { nombre, generoLiterario, descripcion };
      }

      await createClub(dataToSend);
      setNombre("");
      setDescripcion("");
      setGeneroLiterario("");
      setPortada(null);
      showNotification("success", "¡Club literario creado con éxito!");
      fetchData();
    } catch (error) {
      showNotification("error", error.response?.data?.msg || "Error al crear el club.");
    }
  };

  // 2. VINCULAR CO-MODERADOR
  const handleAssignModerator = async (clubId, moderadorId) => {
    if (!moderadorId) return;
    try {
      await assignModerator(clubId, moderadorId);
      showNotification("success", "Moderador asignado correctamente.");
      fetchData();
    } catch (error) {
      showNotification("error", error.response?.data?.msg || "Error al asignar moderador.");
    }
  };

  // 3. QUITAR MODERADOR DE LA LISTA DEL CLUB
  const handleRemoveModerator = async (clubId, moderadorId) => {
    if (window.confirm("¿Estás seguro de remover este moderador del club?")) {
      try {
        await quitarModeradorClub(clubId, moderadorId);
        showNotification("success", "Moderador removido con éxito.");
        fetchData();
      } catch (error) {
        showNotification("error", error.response?.data?.msg || "Error al remover moderador.");
      }
    }
  };

  // 4. SUSPENDER CLUB
  const handleSuspendClub = async (clubId) => {
    try {
      await suspendClub(clubId);
      showNotification("success", "Club suspendido temporalmente.");
      fetchData();
    } catch (error) {
      showNotification("error", error.response?.data?.msg || "Error al suspender el club.");
    }
  };

  // 5. REACTIVAR CLUB
  const handleReactivateClub = async (clubId) => {
    try {
      await reactivarClub(clubId);
      showNotification("success", "Club reactivado y disponible de nuevo.");
      fetchData();
    } catch (error) {
      showNotification("error", error.response?.data?.msg || "Error al reactivar el club.");
    }
  };

  // 6. MODAL: ABRIR EDICIÓN
  const openEditModal = (club) => {
    setEditingClub(club);
    setEditNombre(club.nombre);
    setEditDescripcion(club.descripcion);
    setEditPortada(null);
    setIsEditModalOpen(true);
  };

  // 7. ENVIAR ACTUALIZACIÓN DEL CLUB
  const handleUpdateClub = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataToSend;
      if (editPortada) {
        dataToSend = new FormData();
        dataToSend.append("nombre", editNombre);
        dataToSend.append("descripcion", editDescripcion);
        dataToSend.append("portada", editPortada);
      } else {
        dataToSend = { nombre: editNombre, descripcion: editDescripcion };
      }

      await updateClub(editingClub._id, dataToSend);
      showNotification("success", "Club actualizado correctamente.");
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      showNotification("error", error.response?.data?.msg || "Error al actualizar el club.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f4f6f8] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <PanelMenu />

        {/* NOTIFICACIONES FLOTANTES ESTÉTICAS */}
        {status.msg && (
          <div className={`fixed top-5 right-5 z-50 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold shadow-xl border animate-bounce ${
            status.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-red-50 text-red-800 border-red-100"
          }`}>
            {status.type === "success" ? <FaCheckCircle size={18} className="text-emerald-500" /> : <FaBan size={18} className="text-red-500" />}
            {status.msg}
          </div>
        )}

        {/* HEADER PRINCIPAL */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100 shadow-2xs shrink-0">
              <FaBookOpen size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black bg-[#e67e22] text-white px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                Control de Espacios
              </span>
              <h1 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight mt-0.5">
                Gestión de <span className="text-[#e67e22]">Clubes Literarios</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Crea nuevas comunidades, edita accesos, y suspende o reactiva regulaciones.
              </p>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE CREACIÓN */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 text-[#2c3e50]">
            <FaPlus size={12} className="text-[#e67e22]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Crear Nuevo Club</h2>
          </div>

          <form onSubmit={handleCreateClub} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Nombre del Club</label>
              <input
                type="text"
                placeholder="Ej. Amantes de los Cuentos"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#e67e22] focus:bg-white rounded-xl px-4 py-2.5 text-sm font-medium outline-hidden transition"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Género Literario</label>
              <select
                value={generoLiterario}
                onChange={(e) => setGeneroLiterario(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#e67e22] focus:bg-white rounded-xl px-4 py-2.5 text-sm font-medium outline-hidden transition cursor-pointer"
                required
              >
                <option value="">Selecciona un género</option>
                <option value="Fantasia">Fantasía</option>
                <option value="Romance">Romance</option>
                <option value="Poesia">Poesía</option>
                <option value="Terror">Terror</option>
                <option value="Ciencia Ficcion">Ciencia Ficción</option>
                <option value="Fanfic">Fanfic</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Portada Opcional</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPortada(e.target.files[0])}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-medium text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Descripción Breve</label>
              <input
                type="text"
                placeholder="Propósito, dinámicas o enfoque del espacio..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#e67e22] focus:bg-white rounded-xl px-4 py-2.5 text-sm font-medium outline-hidden transition"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2c3e50] hover:bg-[#1b2836] text-white text-xs font-bold uppercase px-4 py-3 rounded-xl transition tracking-wide cursor-pointer shadow-xs active:scale-98"
              >
                <FaPlus size={10} /> Lanzar Club
              </button>
            </div>
          </form>
        </div>

        {/* TABLA DE CLUBES REGISTRADOS */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Detalles del Club</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Género / Estado</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Moderadores Actuales</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Vincular Moderación</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Acciones Administrativas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {clubes.length > 0 ? (
                  clubes.map((club) => (
                    <tr key={club._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          {club.portada ? (
                            <img src={club.portada} alt={club.nombre} className="w-10 h-10 object-cover rounded-xl border border-gray-100 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-gray-100"><FaImage size={14} /></div>
                          )}
                          <div className="truncate">
                            <p className="text-sm font-bold text-[#2c3e50] truncate">{club.nombre}</p>
                            <p className="text-[11px] text-gray-400 font-medium line-clamp-1 mt-0.5">{club.descripcion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-y-1.5">
                        <div>
                          <span className="bg-amber-50 text-[#e67e22] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-amber-100/50">
                            {club.generoLiterario}
                          </span>
                        </div>
                        <div>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                            club.estadoClub === "Activo" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                          }`}>
                            {club.estadoClub || "Activo"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {club.moderadores?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {club.moderadores.map((m) => (
                              <span key={m._id} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-md text-[11px] capitalize shadow-2xs">
                                {m.nombres} {m.apellidos.split(" ")[0]}
                                <button 
                                  onClick={() => handleRemoveModerator(club._id, m._id)}
                                  title="Remover del club"
                                  className="text-red-400 hover:text-red-600 transition ml-1 cursor-pointer"
                                >
                                  <FaUserMinus size={10} />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 font-medium italic">Sin moderadores asignados</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 max-w-xs">
                          <select
                            onChange={(e) => handleAssignModerator(club._id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 focus:outline-hidden cursor-pointer focus:border-[#e67e22]"
                            defaultValue=""
                          >
                            <option value="">Añadir moderador</option>
                            {moderadores.map((mod) => (
                              <option key={mod._id} value={mod._id}>
                                {mod.nombres} {mod.apellidos}
                              </option>
                            ))}
                          </select>
                          <FaUserCheck size={14} className="text-gray-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/clubes/${club._id}`)}
                            title="Auditar Vista Completa"
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                          >
                            <FaEye size={12} />
                          </button>

                          <button
                            onClick={() => openEditModal(club)}
                            title="Editar Datos Básicos"
                            className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                          >
                            <FaEdit size={12} />
                          </button>

                          {club.estadoClub === "Suspendido" ? (
                            <button
                              onClick={() => handleReactivateClub(club._id)}
                              title="Reactivar Club"
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
                            >
                              <FaCheckCircle size={12} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSuspendClub(club._id)}
                              title="Suspender Club"
                              className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition cursor-pointer"
                            >
                              <FaBan size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      No existen clubes literarios configurados en la plataforma.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL ESTÉTICO DE EDICIÓN (TAILWIND) --- */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full border border-gray-100 shadow-2xl p-6 relative">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <FaTimes size={16} />
              </button>

              <div className="mb-4">
                <h3 className="text-lg font-black text-[#2c3e50] uppercase tracking-wide">Editar Club Literario</h3>
                <p className="text-xs text-gray-400">Modifica la información general de la comunidad.</p>
              </div>

              <form onSubmit={handleUpdateClub} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#e67e22] focus:bg-white rounded-xl px-4 py-2 text-sm font-medium outline-hidden transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Nueva Portada (Opcional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditPortada(e.target.files[0])}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Descripción</label>
                  <textarea
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#e67e22] focus:bg-white rounded-xl px-4 py-2 text-sm font-medium outline-hidden transition resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 bg-[#2c3e50] hover:bg-[#1a252f] text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-md cursor-pointer"
                  >
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}