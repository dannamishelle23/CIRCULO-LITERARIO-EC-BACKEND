import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyAssignedClubById, listarMiembrosClub } from "../../services/clubService";
import { 
  listarObrasClub, 
  listarObrasEnRevision, 
  listarObrasAprobadas, 
  aprobarObra, 
  rechazarObra, 
  iniciarVotacion 
} from "../../services/obraService";
import { 
  FaBookOpen, 
  FaArrowLeft, 
  FaShieldAlt, 
  FaUsers, 
  FaImage, 
  FaCheckCircle, 
  FaClock, 
  FaThumbsUp, 
  FaTimes, 
  FaHourglassEnd,
  FaEye
} from "react-icons/fa";
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
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const clubData = await getMyAssignedClubById(id);
      setClub(clubData);
      console.log("=== REVISANDO MODERADORES ===", clubData?.moderadores);
      const miembrosRes = await listarMiembrosClub(id);
      if (miembrosRes?.ok) {
        setMiembros(miembrosRes.miembros || []);
      } else {
        setMiembros([]);
      }

      const obrasRes = await listarObrasClub(id);
      setObras(obrasRes?.obras ?? []);

      const obrasRevisionRes = await listarObrasEnRevision(id);
      setObrasEnRevision(obrasRevisionRes.obras || []);

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

  const handleAprobar = async (obraId) => {
    try {
      setProcesando(true);
      const res = await aprobarObra(obraId);
      toast.success(res?.message || "Obra aprobada correctamente");
      setObraSeleccionada(null);
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al aprobar la obra";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async (obraId) => {
    const motivo = motivoRechazo[obraId];
    if (!motivo || !motivo.trim()) {
      toast.error("Debes ingresar un motivo de rechazo");
      return;
    }

    try {
      setProcesando(true);
      const res = await rechazarObra(obraId, motivo);
      toast.success(res?.message || "Obra rechazada correctamente");
      setMotivoRechazo({ ...motivoRechazo, [obraId]: "" });
      setMostrarRechazo({ ...mostrarRechazo, [obraId]: false });
      setObraSeleccionada(null);
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al rechazar la obra";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  const handleIniciarVotacionGlobal = async () => {
    if (!id || obrasAprobadas.length === 0) return;
    try {
      setProcesando(true);
      const ids = obrasAprobadas.map(obra => obra._id);
      const res = await iniciarVotacion(id, ids);
      toast.success(res?.message || "Votación iniciada correctamente para todas las obras");
      setObraSeleccionada(null);
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al iniciar votación";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setProcesando(false);
    }
  };

  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "Aprobada":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
            <FaCheckCircle size={9} /> Aprobada
          </span>
        );
      case "EnRevision":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
            <FaClock size={9} /> En Revisión
          </span>
        );
      case "EnVotacion":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
            <FaThumbsUp size={9} /> En Votación
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-200">
            {estado}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-4 border-gray-200 border-t-[#e67e22] rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#2c3e50]">Sincronizando tu Espacio...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Club no encontrado</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* BOTÓN DE RETORNO */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:text-[#e67e22] hover:border-orange-100 transition shadow-3xs cursor-pointer active:scale-98 group"
          >
            <FaArrowLeft size={10} className="transition-transform duration-200 group-hover:-translate-x-0.5" /> Volver
          </button>
        </div>

        {/* CONTENEDOR DE PORTADA Y IDENTIDAD DEL CLUB */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs">
          <div className="w-full relative h-60 sm:h-72 md:h-80 bg-slate-900 overflow-hidden">
            {club.portada ? (
              <>
                <img 
                  src={club.portada} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-30 select-none"
                />
                <img 
                  src={club.portada} 
                  alt={`Portada de ${club.nombre}`} 
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 bg-gradient-to-br from-slate-50 to-slate-100">
                <FaImage size={32} className="text-slate-300" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sin imagen de portada</p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 bg-white relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9px] font-black bg-[#e67e22] text-white px-2.5 py-0.5 rounded uppercase tracking-wider">
                    Mi Club Asignado
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {club.estadoClub ?? "Activo"}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-black text-[#2c3e50] uppercase tracking-tight">
                  {club.nombre}
                </h1>
                
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Género Principal: <span className="text-[#e67e22] font-black">{club.generoLiterario}</span>
                </p>
              </div>

              <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100 shrink-0 self-start sm:self-center shadow-3xs hidden sm:block">
                <FaBookOpen size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CONTENIDO PRINCIPAL (IZQUIERDA) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SOBRE EL CLUB */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 pb-2 border-b border-gray-50">
                Sobre el Club
              </h4>
              <p className="text-xs font-medium text-gray-500 leading-relaxed whitespace-pre-line">
                {club.descripcion}
              </p>
            </div>

            {/* SECCIÓN OBRAS EN REVISIÓN */}
            {obrasEnRevision.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-50">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-amber-500" size={14} />
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-amber-800">
                      Obras en Revisión
                    </h2>
                  </div>
                  <span className="bg-amber-50 border border-amber-100 text-amber-700 font-black text-xs px-2 py-0.5 rounded-lg">
                    {obrasEnRevision.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {obrasEnRevision.map((obra) => (
                    <div key={obra._id} className="border border-gray-100 bg-gray-50/40 rounded-xl p-5 space-y-4 transition duration-300 hover:border-amber-200">
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Contenedor Portada */}
                        <div 
                          onClick={() => setObraSeleccionada({ ...obra, estadoContexto: "EnRevision" })}
                          className="w-20 sm:w-24 aspect-[3/4] bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0 shadow-3xs flex items-center justify-center cursor-pointer hover:opacity-90 transition"
                        >
                          {obra.portada ? (
                            <img src={obra.portada} alt={`Portada de ${obra.titulo}`} className="w-full h-full object-cover" />
                          ) : (
                            <FaBookOpen size={18} className="text-gray-300" />
                          )}
                        </div>

                        {/* Detalles */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch space-y-2">
                          <div>
                            <h3 
                              onClick={() => setObraSeleccionada({ ...obra, estadoContexto: "EnRevision" })}
                              className="font-black text-sm text-[#2c3e50] uppercase tracking-tight break-words cursor-pointer hover:text-[#e67e22] transition"
                            >
                              {obra.titulo}
                            </h3>
                            <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed mt-1">
                              {obra.sinopsis}
                            </p>
                          </div>
                          
                          {/* Contenedor de Autor */}
                          <div className="pt-2 flex items-center justify-between border-t border-gray-100/80 text-xs">
                            <p className="text-gray-500 font-medium truncate">
                              Escritor: <span className="font-bold text-[#2c3e50]">{obra.autor?.nombres} {obra.autor?.apellidos}</span>
                            </p>
                            <button 
                              onClick={() => setObraSeleccionada({ ...obra, estadoContexto: "EnRevision" })}
                              className="shrink-0 text-[10px] font-black text-[#e67e22] uppercase tracking-wider hover:underline ml-2"
                            >
                              Ver más...
                            </button>
                          </div>
                        </div>
                      </div>

                      {mostrarRechazo[obra._id] ? (
                        <div className="bg-white border border-red-100 rounded-xl p-4 space-y-3">
                          <textarea
                            value={motivoRechazo[obra._id] || ""}
                            onChange={(e) => setMotivoRechazo({ ...motivoRechazo, [obra._id]: e.target.value })}
                            placeholder="Especifica detalladamente el motivo de rechazo de la obra..."
                            className="w-full px-3 py-2 border border-gray-100 bg-gray-50/30 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
                            rows="3"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRechazar(obra._id)}
                              disabled={procesando}
                              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition disabled:opacity-50 cursor-pointer"
                            >
                              {procesando ? "Enviando..." : "Confirmar Rechazo"}
                            </button>
                            <button
                              onClick={() => setMostrarRechazo({ ...mostrarRechazo, [obra._id]: false })}
                              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleAprobar(obra._id)}
                            disabled={procesando}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-3xs"
                          >
                            <FaCheckCircle size={11} /> Aprobar Obra
                          </button>
                          <button
                            onClick={() => setMostrarRechazo({ ...mostrarRechazo, [obra._id]: true })}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 text-[10px] font-black uppercase tracking-wider transition cursor-pointer shadow-3xs"
                          >
                            <FaTimes size={11} /> Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN OBRAS LISTAS PARA VOTACIÓN */}
            {obrasAprobadas.length > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-50">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-500" size={14} />
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                      Obras Listas para Votación
                    </h2>
                  </div>
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-black text-xs px-2 py-0.5 rounded-lg">
                    {obrasAprobadas.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {obrasAprobadas.map((obra) => (
                    <div key={obra._id} className="border border-gray-100 bg-gray-50/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition duration-300 hover:border-emerald-200">
                      
                      <div className="flex gap-4 items-center flex-1 min-w-0">
                        <div 
                          onClick={() => setObraSeleccionada({ ...obra, estadoContexto: "Aprobada" })}
                          className="w-14 sm:w-16 aspect-[3/4] bg-white border border-gray-200 rounded-md overflow-hidden shrink-0 shadow-3xs flex items-center justify-center cursor-pointer hover:opacity-90 transition"
                        >
                          {obra.portada ? (
                            <img src={obra.portada} alt={`Portada de ${obra.titulo}`} className="w-full h-full object-cover" />
                          ) : (
                            <FaBookOpen size={14} className="text-gray-300" />
                          )}
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 
                            onClick={() => setObraSeleccionada({ ...obra, estadoContexto: "Aprobada" })}
                            className="font-black text-sm text-[#2c3e50] uppercase tracking-tight truncate cursor-pointer hover:text-[#e67e22]"
                          >
                            {obra.titulo}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium line-clamp-1 leading-relaxed">
                            {obra.sinopsis}
                          </p>
                          <div className="flex items-center justify-between pt-0.5 text-xs">
                            <p className="text-gray-500 font-medium truncate">
                              Por: <span className="font-bold text-[#2c3e50]">{obra.autor?.nombres} {obra.autor?.apellidos}</span>
                            </p>
                            <button 
                              onClick={() => setObraSeleccionada({ ...obra, estadoContexto: "Aprobada" })}
                              className="text-[9px] font-black text-[#e67e22] uppercase tracking-wider hover:underline ml-2 shrink-0"
                            >
                              Detalles...
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Botón Global de Votación */}
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <button
                      onClick={handleIniciarVotacionGlobal}
                      disabled={procesando}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider transition disabled:opacity-50 whitespace-nowrap shadow-3xs cursor-pointer"
                    >
                      <FaHourglassEnd size={12} /> Abrir Votación para Todas
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* HISTORIAL GENERAL DE OBRAS */}
            {obrasEnRevision.length === 0 && obrasAprobadas.length === 0 && obras.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Obras Publicadas del Club
                  </h2>
                  <span className="bg-slate-50 border border-gray-100 text-[#2c3e50] font-black text-xs px-2.5 py-0.5 rounded-lg">
                    {obras.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {obras.map((obra) => (
                    <div key={obra._id} className="group border border-gray-50 bg-gray-50/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all duration-300 hover:bg-white hover:shadow-3xs hover:border-gray-200/60">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div 
                          onClick={() => setObraSeleccionada({ ...obra, estadoContexto: obra.estado })}
                          className="w-10 aspect-[3/4] bg-white border border-gray-100 rounded overflow-hidden shrink-0 flex items-center justify-center cursor-pointer"
                        >
                          {obra.portada ? (
                            <img src={obra.portada} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FaBookOpen size={10} className="text-gray-200" />
                          )}
                        </div>

                        <div className="space-y-0.5 min-w-0 flex-1">
                          <h3 
                            onClick={() => setObraSeleccionada({ ...obra, estadoContexto: obra.estado })}
                            className="font-black text-sm text-[#2c3e50] uppercase tracking-tight truncate group-hover:text-[#e67e22] transition-colors cursor-pointer"
                          >
                            {obra.titulo}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Estado:</span>
                              {renderEstadoBadge(obra.estado)}
                            </div>
                            
                            <button 
                              onClick={() => setObraSeleccionada({ ...obra, estadoContexto: obra.estado })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-100 text-[9px] font-black uppercase tracking-wider text-gray-500 hover:text-[#e67e22] transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
                            >
                              <FaEye size={10} className="opacity-80" /> Ver Información
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ESTADO VACÍO */}
            {obrasEnRevision.length === 0 && obrasAprobadas.length === 0 && obras.length === 0 && (
              <div className="py-12 text-center border border-dashed border-gray-200 rounded-2xl bg-white shadow-3xs">
                <FaBookOpen size={24} className="text-gray-300 mx-auto mb-2" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  No se registran obras en el repositorio.
                </p>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA (SIDEBAR) */}
          <div className="space-y-6">
            
            {/* PANEL DE MODERADORES */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50 text-[#2c3e50]">
                <FaShieldAlt size={12} className="text-[#e67e22]" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Moderación ({club?.moderadores?.length || 0})
                </h2>
              </div>

              <div className="space-y-2">
                {club?.moderadores?.length > 0 ? (
                  club.moderadores.map((mod) => {
                    const inicialMod = mod.nombres ? mod.nombres.charAt(0).toUpperCase() : "M";
                    const fotoMod = mod.avatar || mod.usuario?.avatar;
                    const nombreMod = mod.nombres || mod.usuario?.nombres;
                    const apellidoMod = mod.apellidos || mod.usuario?.apellidos;
                    const emailMod = mod.email || mod.usuario?.email;

                    return (
                      <div key={mod._id} className="flex items-center gap-3 p-2 bg-gray-50/40 border border-gray-50 rounded-xl hover:bg-gray-50 transition">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#e67e22] font-black text-xs flex items-center justify-center border border-amber-100 shrink-0 overflow-hidden select-none">
                          {fotoMod ? (
                            <img src={fotoMod} alt={`Avatar de ${nombreMod}`} className="w-full h-full object-cover" />
                          ) : (
                            inicialMod
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-[#2c3e50] uppercase tracking-tight truncate">
                            {nombreMod} {apellidoMod}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 truncate tracking-wide mt-0.5 lowercase">
                            {emailMod || "moderador@circulo.ec"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[10px] font-bold text-gray-300 italic text-center py-2 uppercase tracking-wide">
                    Sin moderadores a cargo
                  </p>
                )}
              </div>
            </div>

            {/* PANEL DE LECTORES INSCRITOS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50 text-[#2c3e50]">
                <FaUsers size={12} className="text-blue-500" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Lectores Inscritos ({miembros.length})
                </h2>
              </div>
              
              {miembros.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                  {miembros.map((m) => {
                    const u = m.usuario || m; 
                    if (!u) return null;
                    
                    const inicial = u.nombres ? u.nombres.charAt(0).toUpperCase() : "L";
                    const fotoLector = u.avatar;

                    return (
                      <div key={m._id} className="flex items-center gap-3 p-2 bg-gray-50/30 border border-gray-50 rounded-xl hover:bg-gray-50 transition">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 text-[#2c3e50] font-black text-xs flex items-center justify-center border border-gray-200 shrink-0 overflow-hidden select-none">
                          {fotoLector ? (
                            <img src={fotoLector} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            inicial
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-[#2c3e50] capitalize truncate">
                            {u.nombres} {u.apellidos}
                          </p>
                          <p className="text-[9px] font-bold text-gray-400 truncate tracking-wide">
                            @{u.username || "lector"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center border border-dashed border-gray-100 rounded-xl bg-gray-50/20">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Comunidad vacía
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ================= MODAL DETALLES DE OBRA UNIFICADO ================= */}
      {obraSeleccionada && (() => {
        const autorData = obraSeleccionada.autor?.usuario || obraSeleccionada.autor;
        const fotoAutor = autorData?.avatar;
        const usernameAutor = autorData?.username || "autor.anonimo";
        const inicialAutor = obraSeleccionada.autor?.nombres ? obraSeleccionada.autor.nombres.charAt(0).toUpperCase() : "A";

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 shadow-2xl animate-scale-up">
              
              {/* CABECERA */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <FaBookOpen className="text-[#e67e22]" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Inspección Detallada de Obra
                  </span>
                </div>
                <button 
                  onClick={() => setObraSeleccionada(null)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition cursor-pointer"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* CONTENIDO MODAL */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-28 aspect-[3/4] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                    {obraSeleccionada.portada ? (
                      <img src={obraSeleccionada.portada} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FaBookOpen size={32} className="text-gray-300" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <h3 className="text-lg font-black text-[#2c3e50] uppercase tracking-tight break-words">
                      {obraSeleccionada.titulo}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Estado Actual:</span>
                      {renderEstadoBadge(obraSeleccionada.estadoContexto || obraSeleccionada.estado)}
                    </div>
                    <div className="pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-md bg-amber-50 text-[#e67e22] font-black text-[9px] flex items-center justify-center border border-amber-100 shrink-0 overflow-hidden">
                          {fotoAutor ? (
                            <img src={fotoAutor} alt="" className="w-full h-full object-cover" />
                          ) : (
                            inicialAutor
                          )}
                        </div>
                        <span className="text-xs font-bold text-gray-600">Autor/a:</span>
                      </div>
                      <p className="text-xs font-black text-[#2c3e50] capitalize">
                        {obraSeleccionada.autor?.nombres} {obraSeleccionada.autor?.apellidos}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 lowercase tracking-wide">
                        @{usernameAutor}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 pb-1 border-b border-gray-50">
                    Sinopsis
                  </h4>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed bg-gray-50/30 p-4 rounded-xl border border-gray-50">
                    {obraSeleccionada.sinopsis || "No hay sinopsis registrada."}
                  </p>
                </div>
              </div>

              {/* ACCIONES MODAL */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                {obraSeleccionada.estadoContexto === "EnRevision" && (
                  <>
                    <button
                      onClick={() => handleAprobar(obraSeleccionada._id)}
                      disabled={procesando}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-3xs"
                    >
                      <FaCheckCircle size={12} /> {procesando ? "Procesando..." : "Aprobar"}
                    </button>
                    <button
                      onClick={() => {
                        setMostrarRechazo({ ...mostrarRechazo, [obraSeleccionada._id]: true });
                        setObraSeleccionada(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-3xs"
                    >
                      <FaTimes size={12} /> Rechazar
                    </button>
                  </>
                )}
                <button
                  onClick={() => setObraSeleccionada(null)}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-50 transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </section>
  );
}