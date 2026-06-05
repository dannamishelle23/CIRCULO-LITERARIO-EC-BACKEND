import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MdCheckCircle } from "react-icons/md"
import { listarObrasClub } from "../../services/obraService"
import { getMyAssignedClubs } from "../../services/clubService"

export default function ModerationPanel() {
  const navigate = useNavigate()
  const [clubes, setClubes] = useState([])
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [clubSeleccionado, setClubSeleccionado] = useState("")

  useEffect(() => {
    cargarClubes()
  }, [])

  useEffect(() => {
    if (clubSeleccionado) {
      cargarObras()
    }
  }, [clubSeleccionado])

  const cargarClubes = async () => {
    try {
      setLoading(true)
      setError("")
      const misClubes = await getMyAssignedClubs()
      setClubes(misClubes || [])
      if (misClubes && misClubes.length > 0) {
        setClubSeleccionado(misClubes[0]._id)
      }
    } catch (err) {
      console.error("Error al cargar clubes:", err)
      setError("Error al cargar los clubes")
      setClubes([])
    } finally {
      setLoading(false)
    }
  }

  const cargarObras = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await listarObrasClub(clubSeleccionado)
      // Filtrar solo obras en revisión o aprobadas
      const obrasModeracion = (response.obras || []).filter(
        (o) => o.estado === "EnRevision" || o.estado === "Aprobada" || o.estado === "EnVotacion"
      )
      setObras(obrasModeracion)
    } catch (err) {
      console.error("Error al cargar obras:", err)
      setError("Error al cargar las obras")
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      "EnRevision": { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
      "Aprobada": { bg: "bg-blue-100", text: "text-blue-800", icon: "✓" },
      "EnVotacion": { bg: "bg-purple-100", text: "text-purple-800", icon: "🗳️" }
    }
    return badges[estado] || { bg: "bg-gray-100", text: "text-gray-800", icon: "?" }
  }

  if (loading && clubes.length === 0) {
    return (
      <div className="min-h-screen bg-[#FEF2E1] flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#e67e22]">Moderación</p>
              <h1 className="mt-3 text-3xl font-black text-[#2c3e50]">Panel de Moderación</h1>
              <p className="mt-2 text-sm text-gray-500">
                Revisa y aprueba las obras en espera de moderación
              </p>
            </div>
            <div className="rounded-3xl bg-[#e67e22] p-4 text-white text-5xl">
              ⏳
            </div>
          </div>
        </div>

        {/* SELECTOR DE CLUB */}
        {clubes.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <label className="block text-sm font-bold text-[#2c3e50] mb-2">
              Selecciona un club
            </label>
            <select
              value={clubSeleccionado}
              onChange={(e) => setClubSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e67e22]"
            >
              {clubes.map((club) => (
                <option key={club._id} value={club._id}>
                  {club.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* LISTADO */}
        {error ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
              {error}
            </div>
          </div>
        ) : obras.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <MdCheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#2c3e50]">¡Todo al día!</h2>
            <p className="mt-3 text-gray-500">
              No hay obras pendientes de moderación en este momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {obras.map((obra) => {
              const badge = getEstadoBadge(obra.estado)
              return (
                <div
                  key={obra._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* PORTADA */}
                    <div className="md:col-span-1">
                      {obra.portada && (
                        <img
                          src={obra.portada}
                          alt={obra.titulo}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* CONTENIDO */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-[#2c3e50]">{obra.titulo}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text} whitespace-nowrap`}>
                          {badge.icon} {obra.estado}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {obra.sinopsis}
                      </p>

                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>👤 {obra.autor.nombres} {obra.autor.apellidos}</span>
                        {obra.fechaPostulacion && (
                          <span>📅 {new Date(obra.fechaPostulacion).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {/* ACCIÓN */}
                    <div className="md:col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => navigate(`/moderacion/${obra._id}`)}
                        className="w-full px-4 py-3 bg-[#e67e22] text-white font-bold rounded-lg hover:bg-orange-600 transition"
                      >
                        Revisar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
