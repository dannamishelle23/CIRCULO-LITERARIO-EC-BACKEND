import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyAssignedClubById, listarMiembrosClub } from "../../services/clubService";
import { listarObrasClub, listarObrasEnRevision, listarObrasAprobadas, aprobarObra, rechazarObra, iniciarVotacion } from "../../services/obraService";
import { FaBookOpen, FaArrowLeft, FaShieldAlt, FaUsers, FaImage, FaCheckCircle, FaClock, FaEdit, FaThumbsUp, FaTimes, FaHourglassEnd } from "react-icons/fa";
import { toast } from "react-toastify";

export default function MyClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [obras, setObras] = useState([]);
  const [obrasEnRevision, setObrasEnRevision] = useState([]);
  const [obrasAprobadas, setObrasAprobadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState({});
  const [mostrarRechazo, setMostrarRechazo] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const clubData = await getMyAssignedClubById(id);
      setClub(clubData);

      const miembrosRes = await listarMiembrosClub(id);
      if (miembrosRes?.ok) {
        setMiembros(miembrosRes.miembros || []);
      } else {
        setMiembros([]);
      }

      const obrasRes = await listarObrasClub(id);
      setObras(obrasRes.obras || []);

      // Obtener obras en revisión
      const obrasRevisionRes = await listarObrasEnRevision(id);
      setObrasEnRevision(obrasRevisionRes.obras || []);

      // Obtener obras aprobadas
      const obrasAprobadosRes = await listarObrasAprobadas(id);
      setObrasAprobadas(obrasAprobadosRes.obras || []);
    } catch (error) {
      console.error("Error cargando club:", error);
      setClub(null);
      setMiembros([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // Manejar aprobación de obra
  const handleAprobar = async (obraId) => {
    try {
      setProcesando(true);
      await aprobarObra(obraId);
      toast.success("Obra aprobada correctamente");
      fetchData();
    } catch (error) {
      toast.error("Error al aprobar la obra");
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  // Manejar rechazo de obra
  const handleRechazar = async (obraId) => {
    const motivo = motivoRechazo[obraId];
    if (!motivo || !motivo.trim()) {
      toast.error("Debes ingresar un motivo de rechazo");
      return;
    }

    try {
      setProcesando(true);
      await rechazarObra(obraId, motivo);
      toast.success("Obra rechazada correctamente");
      setMotivoRechazo({ ...motivoRechazo, [obraId]: "" });
      setMostrarRechazo({ ...mostrarRechazo, [obraId]: false });
      fetchData();
    } catch (error) {
      toast.error("Error al rechazar la obra");
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  // Manejar inicio de votación
  const handleIniciarVotacion = async (obraId) => {
    try {
      setProcesando(true);
      await iniciarVotacion(obraId);
      toast.success("Votación iniciada correctamente");
      fetchData();
    } catch (error) {
      toast.error("Error al iniciar votación");
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  // Helper para renderizar los badges de estado de la obra con elegancia
  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "Aprobada":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
            <FaCheckCircle size={10} /> Aprobada
          </span>
        );
      case "EnRevision":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">
            <FaClock size={10} /> En Revisión
          </span>
        );
      case "EnVotacion":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
            <FaThumbsUp size={10} /> En Votación
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-100">
            {estado}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Sincronizando tu Espacio...</p>
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
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:text-[#e67e22] hover:border-orange-200 transition shadow-3xs cursor-pointer active:scale-98 group"
          >
            <FaArrowLeft size={11} className="transition-transform duration-200 group-hover:-translate-x-0.5" /> Volver
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
                      Mi Club Asignado
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">
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
            {/* SOBRE EL CLUB */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50] mb-3 pb-2 border-b border-gray-100">
                Sobre el Club
              </h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {club.descripcion}
              </p>
            </div>

            {/* SECCIÓN OBRAS EN REVISIÓN */}
            {obrasEnRevision.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-5 pb-2 border-b border-amber-100">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-amber-600" size={16} />
                    <h2 className="text-xs font-black uppercase tracking-widest text-amber-700">
                      Obras en Revisión
                    </h2>
                  </div>
                  <span className="bg-amber-100 text-amber-700 font-black text-xs px-2.5 py-1 rounded-lg">
                    {obrasEnRevision.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {obrasEnRevision.map((obra) => (
                    <div
                      key={obra._id}
                      className="border border-amber-100 bg-amber-50/50 rounded-2xl p-5 space-y-4"
                    >
                      <div className="space-y-2">
                        <h3 className="font-black text-base text-[#2c3e50] uppercase tracking-tight">
                          {obra.titulo}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {obra.sinopsis}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] text-gray-500 font-bold">Autor:</span>
                          <span className="text-xs font-bold text-[#2c3e50]">
                            {obra.autor?.nombres} {obra.autor?.apellidos}
                          </span>
                        </div>
                      </div>

                      {/* Formulario de rechazo */}
                      {mostrarRechazo[obra._id] && (
                        <div className="bg-white border border-red-200 rounded-xl p-4 space-y-3">
                          <textarea
                            value={motivoRechazo[obra._id] || ""}
                            onChange={(e) => setMotivoRechazo({ ...motivoRechazo, [obra._id]: e.target.value })}
                            placeholder="Ingresa el motivo del rechazo..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                            rows="3"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRechazar(obra._id)}
                              disabled={procesando}
                              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                            >
                              {procesando ? "Procesando..." : "Confirmar Rechazo"}
                            </button>
                            <button
                              onClick={() => setMostrarRechazo({ ...mostrarRechazo, [obra._id]: false })}
                              className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Botones de acción */}
                      {!mostrarRechazo[obra._id] && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleAprobar(obra._id)}
                            disabled={procesando}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase transition disabled:opacity-50"
                          >
                            <FaCheckCircle size={12} /> Aprobar
                          </button>
                          <button
                            onClick={() => setMostrarRechazo({ ...mostrarRechazo, [obra._id]: true })}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase transition"
                          >
                            <FaTimes size={12} /> Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN OBRAS APROBADAS */}
            {obrasAprobadas.length > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-5 pb-2 border-b border-emerald-100">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-600" size={16} />
                    <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700">
                      Obras Aprobadas - Listas para Votación
                    </h2>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 font-black text-xs px-2.5 py-1 rounded-lg">
                    {obrasAprobadas.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {obrasAprobadas.map((obra) => (
                    <div
                      key={obra._id}
                      className="border border-emerald-100 bg-emerald-50/50 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <h3 className="font-black text-base text-[#2c3e50] uppercase tracking-tight">
                          {obra.titulo}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {obra.sinopsis}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] text-gray-500 font-bold">Autor:</span>
                          <span className="text-xs font-bold text-[#2c3e50]">
                            {obra.autor?.nombres} {obra.autor?.apellidos}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleIniciarVotacion(obra._id)}
                        disabled={procesando}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase transition disabled:opacity-50 whitespace-nowrap"
                      >
                        <FaHourglassEnd size={12} /> Poner a Votación
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN OBRAS REGULARES */}
            {obrasEnRevision.length === 0 && obrasAprobadas.length === 0 && obras.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-100">
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">
                    Obras del Club
                  </h2>
                  <span className="bg-slate-100 text-[#2c3e50] font-black text-xs px-2.5 py-1 rounded-lg">
                    {obras.length} {obras.length === 1 ? 'Obra' : 'Obras'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4.5">
                  {obras.map((obra) => (
                    <div
                      key={obra._id}
                      className="group border border-gray-100 bg-gray-50/30 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-gray-200/80"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <h3 className="font-black text-base text-[#2c3e50] uppercase tracking-tight truncate group-hover:text-[#e67e22] transition-colors duration-200">
                          {obra.titulo}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estado:</span>
                          {renderEstadoBadge(obra.estado)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {obrasEnRevision.length === 0 && obrasAprobadas.length === 0 && obras.length === 0 && (
              <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/20">
                <FaBookOpen size={32} className="text-gray-300 mx-auto mb-2.5" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  No existen obras registradas en este club.
                </p>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: SIDEBAR */}
          <div className="space-y-6">
            
            {/* SECCIÓN MODERADORES */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 text-[#2c3e50]">
                <FaShieldAlt size={14} className="text-[#e67e22]" />
                <h2 className="text-xs font-bold uppercase tracking-widest">
                  Moderadores ({club.moderadores?.length || 0})
                </h2>
              </div>

              <div className="space-y-2.5">
                {club.moderadores?.length > 0 ? (
                  club.moderadores.map((mod) => (
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
                  Lectores Inscritos ({miembros.length})
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