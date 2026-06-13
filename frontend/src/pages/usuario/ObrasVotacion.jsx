import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { 
  MdArrowBack, 
  MdHowToVote, 
  MdMenuBook, 
  MdImage,
  MdStar,
  MdClose,
  MdPerson,
  MdVisibility,
  MdThumbUp,
  MdDeleteForever,
  MdBook
} from "react-icons/md"

import { 
  obtenerObrasVotacionClub, 
  votarObra, 
  obtenerObrasPublicadasClub 
} from "../../services/obraService"

export default function ObrasVotacion() {
  const { id: clubId } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("votacion")
  const [obrasVotacion, setObrasVotacion] = useState([])
  const [obrasPublicadas, setObrasPublicadas] = useState([])
  const [votacionCerrada, setVotacionCerrada] = useState(false)
  const [accionCargando, setAccionCargando] = useState(null)
  
  const [obraModal, setObraModal] = useState(null)

  const cargarObras = async () => {
    try {
      setLoading(true)
      
      if (activeTab === "votacion") {
          const res = await obtenerObrasVotacionClub(clubId)

          // Si el backend indica que la votación está cerrada por lectura publicada
          if (res && res.votacionCerrada) {
            setVotacionCerrada(true)
            setObrasVotacion([])
            // mostrar mensaje informativo
            toast.info(res.msg || "La votación está cerrada hasta finalizar la lectura actual.")
          } else {
            setVotacionCerrada(false)
            const listaBruta = Array.isArray(res) ? res : (res.obras || [])

            const obrasConVoto = listaBruta.map(obra => ({
              ...obra,
              yaVotado: !!obra.yaVotado
            }));

            setObrasVotacion(obrasConVoto)
          }
        
        if (obraModal) {
          const obraActualizada = obrasConVoto.find(o => o._id === obraModal._id);
          setObraModal(obraActualizada || null);
        }
      } else {
        const res = await obtenerObrasPublicadasClub(clubId)
        const listaBruta = Array.isArray(res) ? res : (res.obras || [])
        setObrasPublicadas(listaBruta)
        
        if (obraModal) {
          const obraActualizada = listaBruta.find(o => o._id === obraModal._id);
          setObraModal(obraActualizada || null);
        }
      }
    } catch (error) {
      console.error("Error al cargar obras:", error)
      const msg = error.response?.data?.msg || "Error al cargar las obras del club"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarObras()
  }, [clubId, activeTab])

  const handleVotar = async (obraId) => {
    try {
      setAccionCargando(obraId)
      const res = await votarObra(obraId)
      
      toast.success(res.msg || "¡Operación realizada correctamente!")
      
      await cargarObras()
      
      if (obraModal && obraModal._id === obraId) {
        setObraModal(null)
      }
    } catch (error) {
      console.error("Error al procesar voto:", error)
      const msg = error.response?.data?.msg || "Error al procesar la solicitud"
      toast.error(msg)
    } finally {
      setAccionCargando(null)
    }
  }

  const hasVotedAny = obrasVotacion.some(obra => obra.yaVotado);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black text-[#2c3e50] uppercase tracking-wider bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-2xs hover:bg-gray-50 transition cursor-pointer active:scale-95"
        >
          <MdArrowBack size={16} /> Volver al panel
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-2xs space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10" />
          <h1 className="text-2xl md:text-3xl font-black text-[#2c3e50] uppercase tracking-tight relative z-10">
            OBRAS LITERARIAS
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider relative z-10">
            Gestiona y visualiza las propuestas y lecturas del club.
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-2xs gap-1">
          <button
            onClick={() => { if (!votacionCerrada) setActiveTab("votacion") }}
            className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "votacion"
                ? "bg-[#2c3e50] text-white shadow-md scale-[1.02]"
                : (votacionCerrada ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50")
            }`}
          disabled={votacionCerrada}
          >
            <MdHowToVote size={18} /> Obras en Votación
            {votacionCerrada && <span className="ml-2 text-[10px] font-bold text-gray-400">(cerrada)</span>}
          </button>
          <button
            onClick={() => setActiveTab("publicadas")}
            className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === "publicadas"
                ? "bg-[#e67e22] text-white shadow-md scale-[1.02]"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <MdMenuBook size={18} /> Obras Publicadas
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-2xs min-h-[400px]">
          
          {activeTab === "votacion" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h2 className="text-base font-black text-[#2c3e50] uppercase tracking-tight">Postulaciones de la semana</h2>
                <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-3 py-1 rounded-full uppercase">Fase Activa</span>
              </div>

              {obrasVotacion.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                  <MdHowToVote size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No hay manuscritos en votación</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {obrasVotacion.map((obra) => {
                    console.log("DEBUG - Obra estado:", obra.estado); 
                    const isPublished = obra?.estado ? obra.estado.toString().toLowerCase() === "publicada" : true;

                    return (
                      <div key={obra._id} className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col gap-4 relative overflow-hidden">
                        
                        <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-black bg-[#e67e22] text-white px-3 py-1 rounded-full shadow-lg z-10">
                          <MdStar size={14} /> {obra.votos || 0}
                        </div>

                        <div className="flex gap-4">
                          <div className="w-20 h-28 bg-slate-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-50">
                            {obra.portada ? (
                              <img src={obra.portada} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300"><MdImage size={32} /></div>
                            )}
                          </div>

                          <div className="flex flex-col justify-center min-w-0 flex-1">
                            <h3 className="font-black text-sm text-[#2c3e50] uppercase tracking-tight truncate mb-1 group-hover:text-[#e67e22] transition">{obra.titulo}</h3>
                            
                            <div className="flex items-center gap-2 text-gray-400 mb-3">
                              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                                {obra.autorAvatar ? (
                                  <img src={obra.autorAvatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <MdPerson size={12} className="text-gray-500" />
                                )}
                              </div>
                              <p className="text-[10px] font-bold uppercase truncate">Por: {obra.autor}</p>
                            </div>
                            
                            <button
                              onClick={() => setObraModal(obra)}
                              className="inline-flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#2c3e50] bg-gray-50 hover:bg-amber-50 hover:text-[#e67e22] py-2 rounded-xl border border-gray-100 transition cursor-pointer"
                            >
                              <MdVisibility size={14} /> Leer Detalles
                            </button>
                          </div>
                        </div>

                        {isPublished ? (
                          <button
                            disabled
                            className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
                          >
                            Ya Publicada <MdBook size={14} />
                          </button>
                        ) : hasVotedAny ? (
                          obra.yaVotado ? (
                            <button
                              disabled={accionCargando === obra._id}
                              onClick={() => handleVotar(obra._id)}
                              className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition duration-200 shadow-sm active:scale-95 cursor-pointer bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                            >
                              {accionCargando === obra._id ? (
                                <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                              ) : (
                                <>Eliminar Voto <MdDeleteForever size={16} /></>
                              )}
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60"
                            >
                              Votar Ahora <MdThumbUp size={14} />
                            </button>
                          )
                        ) : (
                          <button
                            disabled={accionCargando === obra._id}
                            onClick={() => handleVotar(obra._id)}
                            className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition duration-200 shadow-sm active:scale-95 cursor-pointer bg-[#2c3e50] text-white hover:bg-[#e67e22]"
                          >
                            {accionCargando === obra._id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>Votar Ahora <MdThumbUp size={14} /></>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "publicadas" && (
            <div className="space-y-6">
              <h2 className="text-base font-black text-[#2c3e50] uppercase tracking-tight border-b border-gray-50 pb-4">OBRA GANADORA DE LA SEMANA </h2>
              {obrasPublicadas.length === 0 ? (
                <div className="text-center py-20">
                  <MdMenuBook size={48} className="mx-auto text-gray-100 mb-4" />
                  <p className="text-xs font-black text-gray-400 uppercase">Aún no hay obras publicadas</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {obrasPublicadas.map((obra) => (
                    <div key={obra._id} className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition duration-300 flex flex-col gap-4 relative overflow-hidden">
                      <div className="flex gap-4">
                        <div className="w-20 h-28 bg-slate-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-50 flex items-center justify-center">
                          {obra.portada ? (
                            <img src={obra.portada} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><MdImage size={32} /></div>
                          )}
                        </div>

                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <h3 className="font-black text-sm text-[#2c3e50] uppercase tracking-tight truncate mb-1 group-hover:text-[#e67e22] transition">{obra.titulo}</h3>
                          
                          <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                              {obra.autorAvatar ? (
                                <img src={obra.autorAvatar} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <MdPerson size={12} className="text-gray-500" />
                              )}
                            </div>
                            <p className="text-[10px] font-bold uppercase truncate">Por: {obra.autor}</p>
                          </div>
                          
                          <button
                            onClick={() => setObraModal(obra)}
                            className="inline-flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#2c3e50] bg-gray-50 hover:bg-orange-50 hover:text-[#e67e22] py-2 rounded-xl border border-gray-100 transition cursor-pointer"
                          >
                            <MdVisibility size={14} /> Ver Obra
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal detallado */}
      {obraModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl border border-white/20 relative overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  {obraModal.autorAvatar ? (
                    <img src={obraModal.autorAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <MdPerson size={32} className="text-amber-600" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-[#2c3e50] uppercase tracking-tight">{obraModal.autor}</h4>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Autor</p>
                </div>
              </div>
              
              <button
                onClick={() => setObraModal(null)}
                className="bg-gray-100 p-3 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition active:scale-90 cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8">
              
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-40 h-56 bg-slate-25 rounded-[10px] shadow-xl overflow-hidden flex-shrink-0 border-4 border-white flex items-center justify-center">
                  {obraModal.portada ? (
                    <img src={obraModal.portada} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200"><MdImage size={48} /></div>
                  )}
                </div>
                
                <div className="space-y-4 text-center md:text-left flex-1">
                  {activeTab === "votacion" ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                      <MdHowToVote /> En proceso de votación
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      <MdBook /> Obra Publicada
                    </div>
                  )}
                  <h2 className="text-2xl md:text-4xl font-black text-[#2c3e50] leading-tight uppercase tracking-tighter">
                    {obraModal.titulo}
                  </h2>
                  {activeTab === "votacion" && (
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-1 text-[#e67e22] font-black">
                        <MdStar size={20} />
                        <span className="text-xl">{obraModal.votos || 0}</span>
                        <span className="text-[10px] uppercase ml-1 opacity-60">Votos</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <h5 className="text-[11px] font-black text-[#2c3e50] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-amber-500"></span> Sinopsis de la obra
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-6 rounded-[32px] border border-gray-100 italic">
                    "{obraModal.sinopsis || "El autor no ha proporcionado una sinopsis para esta obra."}"
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-[11px] font-black text-[#2c3e50] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-[#2c3e50]"></span> Prólogo 
                  </h5>
                  <div className="text-sm text-gray-600 leading-relaxed font-medium p-2 whitespace-pre-wrap">
                    {obraModal.prologo || "No hay prólogo disponible para previsualizar."}
                  </div>
                </div>
              </div>
            </div>

            {activeTab === "votacion" && (
              <div className="p-6 md:p-8 bg-gray-50/80 border-t border-gray-100 backdrop-blur-md">
                {obraModal.estado === "Publicada" ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                  >
                    Ya Publicada <MdBook size={20} />
                  </button>
                ) : hasVotedAny ? (
                  obraModal.yaVotado ? (
                    <button
                      disabled={accionCargando === obraModal._id}
                      onClick={() => handleVotar(obraModal._id)}
                      className="w-full py-4 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition duration-300 shadow-xl active:scale-95 cursor-pointer bg-red-500 text-white shadow-red-200"
                    >
                      {accionCargando === obraModal._id ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Eliminar Voto <MdDeleteForever size={20} /></>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-4 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                    >
                      Votar <MdStar size={20} />
                    </button>
                  )
                ) : (
                  <button
                    disabled={accionCargando === obraModal._id}
                    onClick={() => handleVotar(obraModal._id)}
                    className="w-full py-4 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition duration-300 shadow-xl active:scale-95 cursor-pointer bg-[#2c3e50] text-white hover:bg-[#e67e22] shadow-[#2c3e50]/20"
                  >
                    {accionCargando === obraModal._id ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Votar <MdStar size={20} className="animate-pulse text-amber-300" /></>
                    )}
                  </button>
                )}
              </div>
            )}
            
            {activeTab === "publicadas" && (
              <div className="p-6 md:p-8 bg-gray-50/80 border-t border-gray-100 backdrop-blur-md">
                <button
                  onClick={() => {
                    navigate(`/clubes/${clubId}/leer-obra/${obraModal._id}`) 
                  }}
                  className="w-full py-4 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition duration-300 shadow-xl active:scale-95 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-200"
                >
                  Ir a leer la obra <MdMenuBook size={20} />
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  )
}