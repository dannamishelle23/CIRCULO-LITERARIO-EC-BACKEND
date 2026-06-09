import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MdCheckCircle, MdArrowBackIosNew, MdClose, MdHowToVote, MdHourglassEmpty, MdErrorOutline } from "react-icons/md"
import { obtenerObra, aprobarObra, rechazarObra, iniciarVotacion } from "../../services/obraService"

export default function ModerationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [obra, setObra] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")
  const [motivoRechazo, setMotivoRechazo] = useState("")
  const [mostrarRechazo, setMostrarRechazo] = useState(false)

  useEffect(() => {
    cargarObra()
  }, [id])

  const cargarObra = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await obtenerObra(id)
      setObra(response.obra)
    } catch (err) {
      console.error("Error al cargar obra:", err)
      setError("No se pudo recuperar la información de la obra.")
    } finally {
      setLoading(false)
    }
  }

  const manejarExitoNavegacion = () => {
    setTimeout(() => {
      // Regresa al club o listado de origen de forma limpia
      navigate(-1) 
    }, 2000)
  }

  const handleAprobar = async () => {
    try {
      setProcesando(true)
      await aprobarObra(id)
      setTipoMensaje("success")
      setMensaje("Obra aprobada correctamente")
      manejarExitoNavegacion()
    } catch (error) {
      setTipoMensaje("error")
      const msg = error.response?.data?.msg || "Error al aprobar"
      setMensaje("✗ " + msg)
    } finally {
      setProcesando(false)
    }
  }

  const handleRechazar = async () => {
    try {
      if (!motivoRechazo.trim()) {
        setTipoMensaje("error")
        setMensaje("Debes ingresar un motivo de rechazo válido.")
        return
      }

      setProcesando(true)
      await rechazarObra(id, motivoRechazo)

      setTipoMensaje("success")
      setMensaje("Obra rechazada correctamente")
      manejarExitoNavegacion()
    } catch (error) {
      setTipoMensaje("error")
      const msg = error.response?.data?.msg || "Error al rechazar"
      setMensaje("✗ " + msg)
    } finally {
      setProcesando(false)
    }
  }

  const handleIniciarVotacion = async () => {
    try {
      setProcesando(true)
      await iniciarVotacion(id)
      setTipoMensaje("success")
      setMensaje("✓ Votación iniciada correctamente")
      manejarExitoNavegacion()
    } catch (error) {
      setTipoMensaje("error")
      const msg = error.response?.data?.msg || "Error al iniciar votación"
      setMensaje("✗ " + msg)
    } finally {
      setProcesando(false)
    }
  }

  // Helper para pintar las insignias de estado de moderación
  const renderBadgeEstado = (estado) => {
    switch (estado) {
      case "EnRevision":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">
            <MdHourglassEmpty size={14} /> En Revisión
          </span>
        )
      case "Aprobada":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
            <MdCheckCircle size={14} /> Aprobada
          </span>
        )
      case "EnVotacion":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
            <MdHowToVote size={14} /> En Votación
          </span>
        )
      case "Rechazada":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
            <MdClose size={14} /> Rechazada
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            {estado}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Cargando Manuscrito...</p>
        </div>
      </div>
    )
  }

  if (error || !obra) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans px-4">
        <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-sm w-full">
          <MdErrorOutline size={40} className="text-red-500 mx-auto mb-3" />
          <p className="text-sm font-black text-[#2c3e50] uppercase tracking-wide mb-4">
            {error || "Obra no encontrada"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:text-[#e67e22] hover:border-orange-200 transition w-full justify-center shadow-3xs cursor-pointer active:scale-98"
          >
            <MdArrowBackIosNew size={11} /> Volver Atrás
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* ENCABEZADO DE CONTROL ACCIONES */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:text-[#e67e22] hover:border-orange-200 transition shadow-3xs cursor-pointer active:scale-98 group"
          >
            <MdArrowBackIosNew size={11} className="transition-transform duration-200 group-hover:-translate-x-0.5" /> Volver
          </button>
        </div>

        {/* NOTIFICACIONES FLUIDAS */}
        {mensaje && (
          <div
            className={`p-4 rounded-xl text-center text-xs font-black uppercase tracking-wider border transition-all duration-300 shadow-3xs ${
              tipoMensaje === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            {mensaje}
          </div>
        )}

        {/* CONTENEDOR PRINCIPAL DOS COLUMNAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA: PORTADA */}
          <div className="md:col-span-1">
            <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white p-3 group">
              <div className="rounded-2xl overflow-hidden h-96 relative bg-slate-100">
                <img
                  src={obra.portada}
                  alt={obra.titulo}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN DETALLADA */}
          <div className="md:col-span-2 space-y-5">
            
            {/* PANEL DE DETALLES DE IDENTIDAD */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[10px] font-black bg-[#e67e22] text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Panel de Moderación
                </span>
                {renderBadgeEstado(obra.estado)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#2c3e50] uppercase tracking-tight leading-tight">
                  {obra.titulo}
                </h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                  Por: <span className="text-[#2c3e50] font-black">{obra.autor.nombres} {obra.autor.apellidos}</span>
                </p>
              </div>
            </div>

            {/* PANEL SINOPSIS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50] mb-3 pb-2 border-b border-gray-100">
                Sinopsis de la Obra
              </h2>
              <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {obra.sinopsis}
              </p>
            </div>

            {/* PANEL PRÓLOGO */}
            {obra.prologo && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs bg-gradient-to-br from-white to-amber-50/10">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50] mb-3 pb-2 border-b border-amber-100/50">
                  Prólogo 
                </h2>
                <p className="text-sm text-gray-600 font-medium leading-relaxed italic whitespace-pre-line">
                  {obra.prologo}
                </p>
              </div>
            )}

            {/* ESPACIO DE ACCIONES DINÁMICAS SEGÚN ESTADO */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50] pb-2 border-b border-gray-100">
                PROCESO DE VOTACION
              </h2>

              {/* ACCIONES PARA: EN REVISIÓN */}
              {obra.estado === "EnRevision" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAprobar}
                      disabled={procesando}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-3xs cursor-pointer active:scale-98"
                    >
                      <MdCheckCircle size={16} /> Aprobar Obra
                    </button>

                    <button
                      onClick={() => setMostrarRechazo(!mostrarRechazo)}
                      disabled={procesando}
                      className={`inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border shadow-3xs cursor-pointer active:scale-98 ${
                        mostrarRechazo
                          ? "bg-gray-100 text-gray-700 border-gray-300"
                          : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                      }`}
                    >
                      {mostrarRechazo ? "Cancelar Rechazo" : "Rechazar Obra"}
                    </button>
                  </div>

                  {mostrarRechazo && (
                    <div className="pt-2 space-y-3 border-t border-dashed border-gray-100 animate-fadeIn">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">
                        Motivo del Rechazo obligatorio
                      </label>
                      <textarea
                        value={motivoRechazo}
                        onChange={(e) => setMotivoRechazo(e.target.value)}
                        placeholder="Escribe de forma constructiva las razones del rechazo para informar al autor..."
                        rows={4}
                        className="w-full border border-gray-200 rounded-xl p-3.5 text-sm text-gray-700 focus:border-red-400 focus:ring-1 focus:ring-red-400 focus:outline-none transition-all duration-200 bg-gray-50/50"
                      />
                      <button
                        onClick={handleRechazar}
                        disabled={procesando}
                        className="w-full inline-flex items-center justify-center px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition duration-200 cursor-pointer shadow-3xs active:scale-98"
                      >
                        Confirmar Desaprobación
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ACCIONES PARA: APROBADA */}
              {obra.estado === "Aprobada" && (
                <div className="space-y-3 p-1">
                  <button
                    onClick={handleIniciarVotacion}
                    disabled={procesando}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-3xs cursor-pointer active:scale-98"
                  >
                    <MdHowToVote size={16} /> Habilitar Votación
                  </button>
                  <p className="text-[11px] font-semibold text-gray-400 text-center leading-normal">
                    La votación tendrá una duración de 7 días. Todos los integrantes activos del club asignado estarán habilitados para votar.
                  </p>
                </div>
              )}

              {/* ACCIONES PARA: EN VOTACIÓN */}
              {obra.estado === "EnVotacion" && (
                <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl text-purple-700 text-xs font-bold leading-relaxed flex items-start gap-2.5">
                  <span className="mt-0.5">🗳️</span>
                  <div>
                    El manuscrito está participando activamente en la fase de votaciones de la comunidad. 
                    Este proceso concluirá oficialmente el <span className="font-black">{new Date(obra.fechaFinVotacion).toLocaleDateString()}</span>.
                  </div>
                </div>
              )}

              {/* ACCIONES PARA: RECHAZADA */}
              {obra.estado === "Rechazada" && (
                <div className="p-4 bg-red-50/60 border border-red-100 rounded-xl space-y-2">
                  <div className="text-red-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <MdClose size={16} /> Evaluación: Obra No Admitida
                  </div>
                  {obra.motivoRechazo && (
                    <p className="text-xs text-red-600 font-medium leading-relaxed pl-5 whitespace-pre-line">
                      <span className="font-bold underline block mb-1">Argumentación técnica del moderador:</span>
                      {obra.motivoRechazo}
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}