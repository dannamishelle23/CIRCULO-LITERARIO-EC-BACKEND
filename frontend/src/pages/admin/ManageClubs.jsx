import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClub, getClubs, assignModerator } from "../../services/clubService";
import { getModerators } from "../../services/userService";
import { FaBookOpen, FaPlus, FaUserCheck, FaEye } from "react-icons/fa";
import PanelMenu from "../../components/PanelMenu";

export default function ManageClubs() {
  const [clubes, setClubes] = useState([]);
  const [moderadores, setModeradores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [generoLiterario, setGeneroLiterario] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

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

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      await createClub({ nombre, generoLiterario, descripcion });
      setNombre("");
      setDescripcion("");
      setGeneroLiterario("");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignModerator = async (clubId, moderadorId) => {
    if (!moderadorId) return;
    try {
      await assignModerator(clubId, moderadorId);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PanelMenu />

        {/* HEADER PRINCIPAL */}
        <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100/40 shrink-0">
              <FaBookOpen size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black bg-[#e67e22] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Control de Espacios
              </span>
              <h1 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight mt-0.5">
                Gestión de <span className="text-[#e67e22]">Clubes Literarios</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Crea nuevas comunidades y asigna moderadores para regular la actividad literaria.
              </p>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE CREACIÓN */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs mb-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50 text-[#2c3e50]">
            <FaPlus size={14} className="text-[#e67e22]" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Crear Nuevo Club</h2>
          </div>

          <form onSubmit={handleCreateClub} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Nombre del Club</label>
              <input
                type="text"
                placeholder="Ej. Amantes de los Cuentos"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-xl px-4 py-2 text-sm font-medium outline-hidden transition"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Género Literario</label>
              <select
                value={generoLiterario}
                onChange={(e) => setGeneroLiterario(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-xl px-4 py-2 text-sm font-medium outline-hidden transition cursor-pointer"
                required
              >
                <option value="">Selecciona un género</option>
                <option value="Fantasia">Fantasía</option>
                <option value="Romance">Romance</option>
                <option value="Poesia">Poesía</option>
                <option value="Terror">Terror</option>
                <option value="Ciencia Ficcion">Ciencia Ficción</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Descripción Breve</label>
              <input
                type="text"
                placeholder="Propósito, dinámicas o enfoque del espacio..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-amber-400 focus:bg-white rounded-xl px-4 py-2 text-sm font-medium outline-hidden transition"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#2c3e50] hover:bg-[#1b2836] text-white text-xs font-bold uppercase px-4 py-2.5 rounded-xl transition tracking-wide cursor-pointer shadow-3xs"
              >
                <FaPlus size={10} /> Lanzar Club
              </button>
            </div>
          </form>
        </div>

        {/* TABLA DE CLUBES REGISTRADOS */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Detalles del Club</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Género</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Moderadores Actuales</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Vincular Moderación</th>
                  <th className="px-6 py-3.5 text-center text-[10px] font-bold uppercase tracking-widest text-[#2c3e50]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {clubes.length > 0 ? (
                  clubes.map((club) => (
                    <tr key={club._id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm font-bold text-[#2c3e50] truncate">{club.nombre}</p>
                        <p className="text-[11px] text-gray-400 font-medium line-clamp-1 mt-0.5">{club.descripcion}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-amber-50 text-[#e67e22] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {club.generoLiterario}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-gray-600 capitalize">
                          {club.moderadores?.length > 0
                            ? club.moderadores.map((m) => `${m.nombres} ${m.apellidos}`).join(", ")
                            : "Sin asignar"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 max-w-xs">
                          <select
                            onChange={(e) => handleAssignModerator(club._id, e.target.value)}
                            className="bg-slate-50 border border-gray-100 rounded-lg px-2 py-1 text-xs font-medium text-gray-600 focus:outline-hidden cursor-pointer"
                            defaultValue=""
                          >
                            <option value="">Asignar co-moderador</option>
                            {moderadores.map((mod) => (
                              <option key={mod._id} value={mod._id}>
                                {mod.nombres} {mod.apellidos}
                              </option>
                            ))}
                          </select>
                          <FaUserCheck size={12} className="text-gray-400" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => navigate(`/clubes/${club._id}`)}
                          title="Auditar Vista Completa"
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                        >
                          <FaEye size={12} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      No existen clubes literarios configurados en la plataforma.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}