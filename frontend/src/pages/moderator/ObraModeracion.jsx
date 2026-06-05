import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MdCheckCircle, MdArrowBack } from "react-icons/md"
import { obtenerObra, aprobarObra, iniciarVotacion } from "../../services/obraService"

export default function ModerationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [obra, setObra] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")

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
      setError("Error al cargar la obra")
    } finally {
      setLoading(false)
    }
  }

  const handleAprobar = async () => {
    try {
      setProcesando(true)
      await aprobarObra(id)
      setTipoMensaje("success")
      setMensaje("✓ Obra aprobada correctamente")
      setTimeout(() => navigate("/admin/moderacion"), 2000)
    } catch (error) {
      setTipoMensaje("error")
      const msg = error.response?.data?.msg || "Error al aprobar"
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
      setTimeout(() => navigate("/admin/moderacion"), 2000)
    } catch (error) {
      setTipoMensaje("error")
      const msg = error.response?.data?.msg || "Error al iniciar votación"
      setMensaje("✗ " + msg)
    } finally {
      setProcesando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEF2E1] flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  if (error || !obra) {
    return (
      <div className="min-h-screen bg-[#FEF2E1] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Obra no encontrada"}</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-[#e67e22] text-white rounded-lg hover:bg-orange-600 transition mx-auto"
          >
            <MdArrowBack /> Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* VOLVER */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#e67e22] hover:text-orange-600 font-bold mb-6 transition"
        >
          <MdArrowBack size={20} /> Volver
        </button>

        {/* MENSAJE */}
        {mensaje && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium border ${
              tipoMensaje === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {mensaje}
          </div>
        )}

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PORTADA */}
          <div className="md:col-span-1">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-96">
              <img
                src={obra.portada}
                alt={obra.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* INFO Y ACCIONES */}
          <div className="md:col-span-2 space-y-6">
            {/* TÍTULO Y ESTADO */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h1 className="text-3xl font-black text-[#2c3e50] mb-2">
                {obra.titulo}
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                Autor: <strong>{obra.autor.nombres} {obra.autor.apellidos}</strong>
              </p>
              <div className="inline-block px-4 py-2 rounded-full font-bold text-sm bg-yellow-100 text-yellow-800">
                ⏳ {obra.estado}
              </div>
            </div>

            {/* SINOPSIS */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#2c3e50] mb-3">Sinopsis</h3>
              <p className="text-gray-700 leading-relaxed">
                {obra.sinopsis}
              </p>
            </div>

            {/* PRÓLOGO */}
            {obra.prologo && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="font-bold text-[#2c3e50] mb-3">Prólogo</h3>
                <p className="text-gray-700 leading-relaxed italic">
                  {obra.prologo}
                </p>
              </div>
            )}

            {/* ACCIONES DE MODERACIÓN */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#2c3e50] mb-4">Acciones de Moderación</h3>

              {obra.estado === "EnRevision" && (
                <div className="space-y-3">
                  <button
                    onClick={handleAprobar}
                    disabled={procesando}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                  >
                    <MdCheckCircle size={20} />
                    Aprobar Obra
                  </button>
                  <p className="text-xs text-gray-600 text-center">
                    La obra pasará al estado "Aprobada" y podrá iniciar votación
                  </p>
                </div>
              )}

              {obra.estado === "Aprobada" && (
                <div className="space-y-3">
                  <button
                    onClick={handleIniciarVotacion}
                    disabled={procesando}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
                  >
                    🗳️ Iniciar Votación
                  </button>
                  <p className="text-xs text-gray-600 text-center">
                    La votación durará 7 días. Los miembros del club podrán votar
                  </p>
                </div>
              )}

              {obra.estado === "EnVotacion" && (
                <div className="p-4 bg-purple-50 rounded-lg text-purple-700 text-sm">
                  ✓ La obra está en votación. Votación finaliza el{" "}
                  {new Date(obra.fechaFinVotacion).toLocaleDateString()}
                </div>
              )}

              {obra.estado === "Rechazada" && (
                <div className="p-4 bg-red-50 rounded-lg text-red-700 text-sm">
                  ✕ Esta obra ha sido rechazada
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
