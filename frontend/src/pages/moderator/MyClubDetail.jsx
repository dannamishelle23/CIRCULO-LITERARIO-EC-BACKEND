import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyAssignedClubById } from "../../services/clubService";
import { FaBookOpen, FaArrowLeft, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function MyClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);

  const fetchClub = async () => {
    try {
      const response = await getMyAssignedClubById(id);
      setClub(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClub();
  }, []);

  if (!club) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Sincronizando tu Espacio...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN DE RETORNO AL PANEL */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-3xs cursor-pointer"
          >
            <FaArrowLeft size={12} /> Volver al Tablero
          </button>
        </div>

        {/* CABECERA DE IDENTIDAD DEL CLUB */}
        <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100/40 shrink-0">
              <FaBookOpen size={32} />
            </div>
            <div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-black bg-[#e67e22] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Mi Club Asignado
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                  club.estadoClub === "Suspendido" 
                    ? "bg-red-50 text-red-600 border-red-100" 
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                }`}>
                  {club.estadoClub ?? "Activo"}
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight mt-1">
                {club.nombre}
              </h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                Género Literario: <span className="text-gray-600">{club.generoLiterario}</span>
              </p>
            </div>
          </div>
        </div>

        {/* CONTENEDOR MODULAR (DOS COLUMNAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA: CONTROL DE CONTENIDO (2/3 de ancho) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sobre el club */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#2c3e50] mb-3 pb-2 border-b border-gray-50">
                Sobre este Club
              </h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {club.descripcion}
              </p>
            </div>

            {/* ESPACIO PROXIMO: OBRAS, CRONOGRAMAS O FOROS DE DISCUSIÓN */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#2c3e50] mb-3 pb-2 border-b border-gray-50">
                Lecturas en Curso & Actividad
              </h2>
              <div className="py-8 text-center border border-dashed border-gray-100 rounded-xl">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  No hay obras ni lecturas activas registradas en este espacio.
                </p>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: PARTICIPACIÓN Y MODERADORES (1/3 de ancho) */}
          <div className="space-y-6">
            
            {/* Equipo de Moderación */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50 text-[#2c3e50]">
                <FaShieldAlt size={14} className="text-[#e67e22]" />
                <h2 className="text-xs font-bold uppercase tracking-widest">
                  Moderadores Asignados ({club.moderadores?.length || 0})
                </h2>
              </div>

              <div className="space-y-2.5">
                {club.moderadores?.length > 0 ? (
                  club.moderadores.map((mod) => (
                    <div
                      key={mod._id}
                      className="bg-slate-50/60 border border-gray-100 rounded-xl p-3.5 transition hover:bg-slate-50"
                    >
                      <p className="text-sm font-bold text-[#2c3e50] capitalize">
                        {mod.nombres} {mod.apellidos}
                      </p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                        {mod.email}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-semibold text-gray-400 text-center py-2 uppercase tracking-wider">
                    Sin co-moderadores asignados
                  </p>
                )}
              </div>
            </div>

            {/* ESPACIO PROXIMO: LISTA DE MIEMBROS INSCRITOS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50 text-[#2c3e50]">
                <FaUsers size={14} className="text-blue-500" />
                <h2 className="text-xs font-bold uppercase tracking-widest">
                  Lectores Inscritos
                </h2>
              </div>
              
              <div className="py-6 text-center border border-dashed border-gray-100 rounded-xl">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Los miembros inscritos aparecerán aquí.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}