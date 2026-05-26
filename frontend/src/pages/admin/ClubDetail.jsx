import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClubById, listarMiembrosClub } from "../../services/clubService";
import { FaBookOpen, FaArrowLeft, FaShieldAlt, FaUsers, FaImage } from "react-icons/fa";

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [moderadores, setModeradores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const clubData = await getClubById(id);
      setClub(clubData);
      setModeradores(clubData?.moderadores || []);

      const miembrosRes = await listarMiembrosClub(id);
      if (miembrosRes?.ok) {
        setMiembros(miembrosRes.miembros || []);
      } else {
        setMiembros([]);
      }
    } catch (error) {
      console.error("Error cargando club:", error);
      setClub(null);
      setMiembros([]);
      setModeradores([]);
    } bits: {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Sincronizando Club...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Club no encontrado</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* BOTÓN DE RETORNO */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-3xs cursor-pointer active:scale-98"
          >
            <FaArrowLeft size={12} /> Volver al Tablero
          </button>
        </div>

        {/* --- CONTENEDOR DE PORTADA Y ÁREA DE IDENTIDAD --- */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          
          {/* SECCIÓN DE IMAGEN PANORÁMICA GRANDE */}
          <div className="w-full relative h-64 sm:h-80 md:h-96 bg-slate-900 overflow-hidden">
            {club.portada ? (
              <>
                <img 
                  src={club.portada} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover blur-md scale-105 opacity-40 select-none"
                />
                <img 
                  src={club.portada} 
                  alt={`Portada de ${club.nombre}`} 
                  className="absolute inset-0 w-full h-full object-contain md:object-cover z-10 transition duration-500 hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 pointer-events-none" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2 bg-gradient-to-br from-slate-50 to-slate-100">
                <FaImage size={40} className="text-slate-300" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sin imagen de portada configurada</p>
              </div>
            )}
          </div>

          {/* ÁREA DE IDENTIDAD */}
          <div className="p-6 md:p-8 bg-white border-t border-gray-50 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100 shrink-0 hidden sm:block shadow-2xs">
                  <FaBookOpen size={28} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[9px] font-black bg-[#e67e22] text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      Comunidad Literaria
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                      club.estadoClub === "Suspendido" 
                        ? "bg-red-50 text-red-600 border-red-100" 
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {club.estadoClub ?? "Activo"}
                    </span>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-black text-[#2c3e50] uppercase tracking-tight">
                    {club.nombre}
                  </h1>
                  
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Género Principal: <span className="text-[#e67e22] font-black">{club.generoLiterario}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DISTRIBUCIÓN DEL ESPACIO DE TRABAJO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA: CONTENIDO */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50] mb-3 pb-2 border-b border-gray-100">
                Sobre este Club
              </h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {club.descripcion}
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: SIDEBAR */}
          <div className="space-y-6">
            
            {/* SECCIÓN MODERADORES */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 text-[#2c3e50]">
                <FaShieldAlt size={14} className="text-[#e67e22]" />
                <h2 className="text-xs font-bold uppercase tracking-widest">
                  Moderación ({moderadores.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {moderadores.length > 0 ? (
                  moderadores.map((mod) => (
                    <div
                      key={mod._id}
                      className="bg-gray-50/60 border border-gray-100 rounded-xl p-3.5 transition hover:bg-gray-50"
                    >
                      <p className="text-xs font-black text-[#2c3e50] uppercase tracking-tight">
                        {mod.nombres} {mod.apellidos}
                      </p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5 lowercase">
                        {mod.email || "moderador@circulo.ec"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-semibold text-gray-400 text-center py-2 uppercase tracking-wider">
                    Sin moderadores asignados
                  </p>
                )}
              </div>
            </div>

            {/* SECCIÓN MIEMBROS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 text-[#2c3e50]">
                <FaUsers size={14} className="text-blue-500" />
                <h2 className="text-xs font-bold uppercase tracking-widest">
                  Comunidad de Lectores ({miembros.length})
                </h2>
              </div>
              
              {miembros.length > 0 ? (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {miembros.map((m) => {
                    const u = m.usuario;
                    if (!u) return null;
                    const inicial = u.nombres ? u.nombres.charAt(0).toUpperCase() : "L";

                    return (
                      <div 
                        key={m._id} 
                        className="flex items-center gap-3 p-2 bg-slate-50/50 border border-gray-100 rounded-xl hover:bg-slate-50 transition"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#2c3e50] font-black text-xs flex items-center justify-center border border-gray-200 select-none shrink-0 overflow-hidden">
                          {u.avatar ? (
                            <img src={u.avatar} alt={`Avatar`} className="w-full h-full object-cover" />
                          ) : (
                            inicial
                          )}
                        </div>
                        
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#2c3e50] capitalize truncate">
                            {u.nombres} {u.apellidos}
                          </p>
                          <p className="text-[10px] font-medium text-gray-400 truncate">
                            @{u.username || "lector"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Sin miembros inscritos aún
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}