import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PanelMenu from "../../components/PanelMenu"
import { getClubs, solicitarUnionClub, listarMiembrosClub } from "../../services/clubService"

import {
  MdAutoStories,
  MdChevronRight,
  MdCheckCircle,
  MdAccessTime,
  MdImage,
  MdInfoOutline,
  MdHowToVote,
  MdMenuBook
} from "react-icons/md"

export default function UserPanel() {
  const usuario = JSON.parse(localStorage.getItem("usuario"))
  const navigate = useNavigate()

  const [clubes, setClubes] = useState([])
  const [misSolicitudes, setMisSolicitudes] = useState({}) 
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [mensajeFeedback, setMensajeFeedback] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const clubesRes = await getClubs()
        const activos = clubesRes.filter(c => c.estadoClub === "Activo")
        setClubes(activos)

        const estadoMiembro = {}

        await Promise.all(
          activos.map(async (club) => {
            try {
              const res = await listarMiembrosClub(club._id)

              const soyMiembro = res.miembros?.some(
                m => m.usuario?._id === usuario?._id
              )

              estadoMiembro[club._id] = soyMiembro ? "Aprobado" : null
            } catch (err) {
              estadoMiembro[club._id] = null
            }
          })
        )

        setMisSolicitudes(estadoMiembro)

      } catch (error) {
        console.error("Error al cargar clubes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleJoinClub = async (clubId) => {
    try {
      setActionLoadingId(clubId)
      setMensajeFeedback(null)

      const res = await solicitarUnionClub(clubId)

      if (res.ok) {
        setMensajeFeedback({
          type: "success",
          text: res.msg || "¡Solicitud enviada correctamente al moderador!"
        })

        setMisSolicitudes(prev => ({
          ...prev,
          [clubId]: "Pendiente"
        }))
      }

    } catch (error) {
      const msg = error.response?.data?.msg || "Error al procesar solicitud"
      setMensajeFeedback({ type: "error", text: msg })
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Sincronizando espacios...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <PanelMenu />

        {/* --- HEADER --- */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl opacity-60 -mr-5 -mt-5 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100 hidden sm:block">
                <MdAutoStories size={32} />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-2xl md:text-3xl font-black text-[#2c3e50] uppercase tracking-tight">
                  Panel de Lectores
                </h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  ¡Hola, <span className="text-[#e67e22] font-black">{usuario?.nombres}</span>! Explora y únete a nuevos espacios literarios
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- ALERTAS DE FEEDBACK --- */}
        {mensajeFeedback && (
          <div className={`p-4 rounded-2xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
            mensajeFeedback.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-red-50 text-red-700 border-red-100"
          }`}>
            <MdInfoOutline size={16} />
            {mensajeFeedback.text}
          </div>
        )}

        {/* --- GRID DE TARJETAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubes.map(club => {
            const estado = misSolicitudes[club._id]
            const isLoading = actionLoadingId === club._id

            return (
              <div 
                key={club._id} 
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xs flex flex-col justify-between group hover:shadow-xs hover:border-gray-200 transition duration-300"
              >
                <div>
                  {/* CONTENEDOR PORTADA */}
                  <div className="h-40 bg-slate-900 w-full relative overflow-hidden flex items-center justify-center">
                    {club.portada ? (
                      <>
                        <img 
                          src={club.portada} 
                          alt="" 
                          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-40 scale-105 select-none"
                        />
                        <img 
                          src={club.portada} 
                          alt={`Portada de ${club.nombre}`} 
                          className="absolute inset-0 w-full h-full object-cover z-10 transition duration-500 group-hover:scale-102"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-gradient-to-br from-slate-50 to-slate-100">
                        <MdImage size={32} className="text-slate-200" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sin Portada</span>
                      </div>
                    )}
                    
                    {/* BADGE DE GÉNERO */}
                    <span className="absolute top-3 right-3 z-20 text-[9px] font-black bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md uppercase tracking-widest">
                      {club.generoLiterario}
                    </span>

                    {/* BADGE DE MIEMBRO (ARRIBA A LA IZQUIERDA) SI ESTÁ APROBADO */}
                    {estado === "Aprobado" && (
                      <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 text-[9px] font-black bg-emerald-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md uppercase tracking-widest shadow-2xs border border-white/10">
                        <MdCheckCircle size={10} /> Miembro Aprobado
                      </span>
                    )}
                  </div>

                  {/* DATOS DEL CLUB */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-black text-lg text-[#2c3e50] uppercase tracking-tight group-hover:text-[#e67e22] transition duration-200 truncate">
                      {club.nombre}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 min-h-[32px]">
                      {club.descripcion}
                    </p>
                  </div>
                </div>

                {/* BOTONES ACCIONES */}
                <div className="px-5 pb-5 pt-2">
                  {estado === "Aprobado" ? (
                    <div className="flex flex-col gap-2.5">
                      {/* Opción 1: Ver Detalle Interno */}
                      <button
                        type="button"
                        onClick={() => navigate(`/club-usuario/${club._id}`)}
                        className="w-full py-3 rounded-xl border border-gray-200 bg-gray-50/60 text-[#2c3e50] hover:bg-white hover:border-orange-200 hover:text-[#e67e22] transition text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-3xs"
                      >
                        <MdMenuBook size={16} /> Detalle del Club
                      </button>

                      {/* Opción 2: Obras Postuladas / Votación */}
                      <button
                        type="button"
                        onClick={() => navigate(`/obras-votacion/${club._id}`)}
                        className="w-full py-3 rounded-xl border border-transparent bg-[#e67e22] text-white hover:bg-orange-600 transition text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-3xs"
                      >
                        <MdHowToVote size={16} /> Obras en Votación y Lectura
                      </button>
                    </div>
                  ) : (
                    /* Botón original de Unirse / Pendiente */
                    <button
                      type="button"
                      onClick={() => handleJoinClub(club._id)}
                      disabled={isLoading || estado === "Pendiente"}
                      className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider flex justify-center items-center gap-2 border transition duration-200 active:scale-98 cursor-pointer ${
                        estado === "Pendiente"
                          ? "bg-amber-50 text-amber-600 border-amber-100 cursor-not-allowed"
                          : "bg-[#2c3e50] text-white border-transparent hover:bg-[#e67e22] shadow-3xs"
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : estado === "Pendiente" ? (
                        <>
                          Solicitud Enviada <MdAccessTime size={14} />
                        </>
                      ) : (
                        <>
                          Unirse a este club <MdChevronRight size={16} />
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}