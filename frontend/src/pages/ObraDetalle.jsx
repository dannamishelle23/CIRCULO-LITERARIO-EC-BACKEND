import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MdArrowBack, MdCheckCircle, MdDateRange } from "react-icons/md"
import { obtenerObra, votarObra, likeObra, obtenerVotos, obtenerLikes } from "../services/obraService"
import { useAuth } from "../context/AuthContext"

export default function ObraDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [obra, setObra] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [votos, setVotos] = useState(0)
  const [likes, setLikes] = useState(0)
  const [yaVoto, setYaVoto] = useState(false)
  const [yaLeGusta, setYaLeGusta] = useState(false)
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    cargarObra()
  }, [id])

  const cargarObra = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await obtenerObra(id)
      setObra(response.obra)
      
      // Cargar votos y likes
      try {
        const votosData = await obtenerVotos(id)
        setVotos(votosData.votos || 0)
      } catch {}
      
      try {
        const likesData = await obtenerLikes(id)
        setLikes(likesData.likes || 0)
      } catch {}
    } catch (err) {
      console.error("Error al cargar obra:", err)
      setError("Error al cargar la obra")
    } finally {
      setLoading(false)
    }
  }

  const handleVotar = async () => {
    try {
      await votarObra(id)
      setYaVoto(true)
      setVotos(votos + 1)
      setMensaje("✓ Voto registrado")
      setTimeout(() => setMensaje(""), 2000)
    } catch (error) {
      const msg = error.response?.data?.msg || "No puedes votar"
      setMensaje("✗ " + msg)
      setTimeout(() => setMensaje(""), 2000)
    }
  }

  const handleLike = async () => {
    try {
      await likeObra(id)
      setYaLeGusta(!yaLeGusta)
      setLikes(yaLeGusta ? likes - 1 : likes + 1)
    } catch (error) {
      console.error("Error al dar like:", error)
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
            className="px-4 py-2 bg-[#e67e22] text-white rounded-lg hover:bg-orange-600 transition"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  const estadoInfo = {
    "Borrador": { color: "bg-gray-100", textColor: "text-gray-800", icon: "📝" },
    "EnRevision": { color: "bg-yellow-100", textColor: "text-yellow-800", icon: "⏳" },
    "Aprobada": { color: "bg-blue-100", textColor: "text-blue-800", icon: "✓" },
    "EnVotacion": { color: "bg-purple-100", textColor: "text-purple-800", icon: "🗳️" },
    "Publicada": { color: "bg-green-100", textColor: "text-green-800", icon: "📖" },
    "Rechazada": { color: "bg-red-100", textColor: "text-red-800", icon: "✕" },
    "Ganadora": { color: "bg-amber-100", textColor: "text-amber-800", icon: "🏆" }
  }

  const estadoActual = estadoInfo[obra.estado] || estadoInfo["Borrador"]

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* BOTÓN VOLVER */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#e67e22] hover:text-orange-600 font-bold mb-6 transition"
        >
          <MdArrowBack size={20} /> Volver
        </button>

        {/* MENSAJE */}
        {mensaje && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center font-medium">
            {mensaje}
          </div>
        )}

        {/* PORTADA Y DETALLES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          {/* INFO */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            {/* ESTADO */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${estadoActual.color} ${estadoActual.textColor}`}>
                {estadoActual.icon} {obra.estado}
              </span>
            </div>

            {/* TÍTULO */}
            <h1 className="text-3xl font-black text-[#2c3e50] mb-3">
              {obra.titulo}
            </h1>

            {/* AUTOR */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              {obra.autor.avatar && (
                <img
                  src={obra.autor.avatar}
                  alt={obra.autor.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-bold text-[#2c3e50]">{obra.autor.nombres} {obra.autor.apellidos}</p>
                <p className="text-sm text-gray-500">@{obra.autor.username}</p>
              </div>
            </div>

            {/* SINOPSIS */}
            <div className="mb-6">
              <h3 className="font-bold text-[#2c3e50] mb-2">Sinopsis</h3>
              <p className="text-gray-700 leading-relaxed">
                {obra.sinopsis}
              </p>
            </div>

            {/* CLUB */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Club:</strong> {obra.club.nombre}
              </p>
            </div>

            {/* ESTADÍSTICAS */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#e67e22]">{votos}</p>
                <p className="text-xs text-gray-600">Votos</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#e67e22]">{likes}</p>
                <p className="text-xs text-gray-600">Me gusta</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-[#e67e22]">
                  {obra.capitulos?.length || 0}
                </p>
                <p className="text-xs text-gray-600">Capítulos</p>
              </div>
            </div>
          </div>
        </div>

        {/* PRÓLOGO Y FECHAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {obra.prologo && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-[#2c3e50] mb-3">Prólogo</h3>
              <p className="text-gray-700 leading-relaxed italic">
                {obra.prologo}
              </p>
            </div>
          )}

          {/* FECHAS */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-[#2c3e50] mb-4 flex items-center gap-2">
              <MdDateRange className="text-[#e67e22]" /> Fechas Importantes
            </h3>

            <div className="space-y-3 text-sm">
              {obra.fechaPostulacion && (
                <p className="text-gray-700">
                  <strong>📅 Postulada:</strong> {new Date(obra.fechaPostulacion).toLocaleDateString()}
                </p>
              )}
              {obra.fechaAprobacion && (
                <p className="text-gray-700">
                  <strong>✓ Aprobada:</strong> {new Date(obra.fechaAprobacion).toLocaleDateString()}
                </p>
              )}
              {obra.fechaInicioVotacion && (
                <p className="text-gray-700">
                  <strong>🗳️ Votación:</strong> {new Date(obra.fechaInicioVotacion).toLocaleDateString()}
                </p>
              )}
              {obra.fechaFinVotacion && (
                <p className="text-gray-700">
                  <strong>🏁 Fin votación:</strong> {new Date(obra.fechaFinVotacion).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        {obra.estado === "EnVotacion" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
            <h3 className="text-xl font-bold text-[#2c3e50] mb-4">
              🗳️ La obra está en votación
            </h3>
            <p className="text-gray-600 mb-6">
              ¡Participa votando por tu obra favorita!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={handleVotar}
                disabled={yaVoto}
                className="flex items-center gap-2 px-6 py-3 bg-[#e67e22] text-white font-bold rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-xl">👍</span>
                {yaVoto ? "Ya votaste" : "Votar"}
              </button>

              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-3 font-bold rounded-lg transition ${
                  yaLeGusta
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span className="text-xl">🔥</span>
                {yaLeGusta ? "Te gusta" : "Me gusta"}
              </button>
            </div>
          </div>
        )}

        {/* CAPÍTULOS */}
        {obra.capitulos && obra.capitulos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-8">
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-4">
              📚 Capítulos ({obra.capitulos.length})
            </h3>
            <div className="space-y-2">
              {obra.capitulos.map((capitulo, index) => (
                <div
                  key={capitulo._id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                >
                  <span className="font-bold text-[#e67e22]">
                    #{capitulo.numeroCapitulo || index + 1}
                  </span>
                  <span className="text-gray-700 flex-1">
                    {capitulo.titulo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
