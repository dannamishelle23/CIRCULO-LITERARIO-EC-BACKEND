import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPerfilUsuario } from "../services/userService"
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaBookOpen, 
  FaCalendarAlt, 
  FaCheckCircle
} from "react-icons/fa"

export default function UserProfilePublic() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await getPerfilUsuario(id)
        setUsuario(res)
      } catch (error) {
        console.error("Error cargando perfil:", error)
        setUsuario(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">Cargando Perfil...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center max-w-sm shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Perfil no encontrado</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-[#2c3e50] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#e67e22] transition"
          >
            Regresar
          </button>
        </div>
      </div>
    )
  }

  const inicial = usuario.nombres ? usuario.nombres.charAt(0).toUpperCase() : "L"

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP BAR */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-3xs cursor-pointer active:scale-98"
          >
            <FaArrowLeft size={11} /> Volver
          </button>
        </div>

        {/* --- CABECERA PANORÁMICA --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden relative">
          <div className="h-44 bg-gradient-to-r from-[#2c3e50] via-[#34495e] to-[#1a252f] relative overflow-hidden" />

          {/* Identidad */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 w-full">
              
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-amber-50 text-[#e67e22] font-black text-4xl flex items-center justify-center border-4 border-white shadow-sm select-none shrink-0 overflow-hidden relative">
                {usuario.avatar ? (
                  <img src={usuario.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  inicial
                )}
              </div>

              {/* Contenedor de Textos */}
              <div className="flex-1 min-w-0 space-y-2 pt-2 sm:pt-0">
                
                {/* Fila de Badges */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] font-black bg-emerald-50 border border-emerald-200 text-emerald-600 px-2.5 py-1 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5 shadow-3xs">
                    <FaCheckCircle size={10} /> Estado Activo
                  </span>
                  <span className="text-[10px] font-black bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md uppercase tracking-widest shadow-3xs">
                    @{usuario.username}
                  </span>
                </div>
                
                {/* Nombre Principal */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#2c3e50] uppercase tracking-tight leading-none block pt-1">
                  {usuario.nombres} {usuario.apellidos}
                </h1>
                
                {/* Correo Electrónico */}
                <p className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 lowercase">
                  <FaEnvelope className="text-gray-300 shrink-0" size={12} /> {usuario.email}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* --- DETALLES EN PANEL GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMNA DETALLES DE USUARIO */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-3.5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2c3e50] pb-2 border-b border-gray-100">
                Información del perfil
              </h3>

              <div className="space-y-3 text-xs font-medium text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                    <FaMapMarkerAlt size={11} className="text-[#e67e22]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">Provincia</p>
                    <span className="uppercase text-xs font-black text-[#2c3e50] mt-1 inline-block">
                      {usuario.provincia || "No especificada"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                    <FaCalendarAlt size={11} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">Miembro desde</p>
                    <span className="text-xs font-bold text-slate-600 mt-1 inline-block">Mayo, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA LISTADO DE OBRAS */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs min-h-[250px] flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">
                      Obras Publicadas
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md">
                    0 Escritos
                  </span>
                </div>

                <div className="py-8 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-2">
                  <div className="w-10 h-10 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-center text-slate-300">
                    <FaBookOpen size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#2c3e50] uppercase">Sin publicaciones</p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Este usuario aún no ha compartido obras dentro de los clubes del sistema.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}