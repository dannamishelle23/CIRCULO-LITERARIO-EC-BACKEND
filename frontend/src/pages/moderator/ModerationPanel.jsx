import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MdCheckCircle } from "react-icons/md"
import { listarObrasClub } from "../../services/obraService"
import { getMyAssignedClubs } from "../../services/clubService"

export default function ModerationPanel() {
  const navigate = useNavigate()

  const [clubes, setClubes] = useState([])
  const [clubSeleccionado, setClubSeleccionado] = useState("")

  const [obrasRevision, setObrasRevision] = useState([])
  const [obrasAprobadas, setObrasAprobadas] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

      if (misClubes?.length > 0) {
        setClubSeleccionado(misClubes[0]._id)
      }
    } catch (err) {
      console.error(err)
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
      const todas = response.obras || []

      setObrasRevision(
        todas.filter((o) => o.estado === "EnRevision")
      )

      setObrasAprobadas(
        todas.filter((o) => o.estado === "Aprobada")
      )

    } catch (err) {
      console.error(err)
      setError("Error al cargar las obras")
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      EnRevision: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
      Aprobada: { bg: "bg-blue-100", text: "text-blue-800", icon: "✓" }
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
          <h1 className="text-3xl font-black text-[#2c3e50]">
            Panel de Moderación
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Gestiona obras en revisión y aprobadas
          </p>

          <p className="text-xs text-gray-400 mt-2">
            🟡 {obrasRevision.length} en revisión · 🟢 {obrasAprobadas.length} aprobadas
          </p>
        </div>

        {/* SELECTOR CLUB */}
        {clubes.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-md border border-gray-100 p-4">
            <label className="block text-sm font-bold mb-2">
              Selecciona un club
            </label>

            <select
              value={clubSeleccionado}
              onChange={(e) => setClubSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {clubes.map((club) => (
                <option key={club._id} value={club._id}>
                  {club.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* ===================== */}
        {/* 🟡 EN REVISIÓN */}
        {/* ===================== */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-yellow-700 mb-4">
            🟡 En revisión
          </h2>

          {obrasRevision.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay obras pendientes de revisión.
            </p>
          ) : (
            <div className="space-y-4">
              {obrasRevision.map((obra) => {
                const badge = getEstadoBadge(obra.estado)

                return (
                  <div
                    key={obra._id}
                    className="bg-white rounded-2xl shadow-md border p-6 flex gap-4"
                  >
                    <img
                      src={obra.portada}
                      className="w-28 h-36 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {obra.titulo}
                      </h3>

                      <p className="text-sm text-gray-600">
                        {obra.sinopsis}
                      </p>

                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                        {badge.icon} {obra.estado}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/moderacion/${obra._id}`)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Revisar
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ===================== */}
        {/* APROBADAS */}
        {/* ===================== */}
        <div>
          <h2 className="text-xl font-black text-blue-700 mb-4">
            Aprobadas
          </h2>

          {obrasAprobadas.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay obras aprobadas aún.
            </p>
          ) : (
            <div className="space-y-4">
              {obrasAprobadas.map((obra) => {
                const badge = getEstadoBadge(obra.estado)

                return (
                  <div
                    key={obra._id}
                    className="bg-white rounded-2xl shadow-md border p-6 flex gap-4"
                  >
                    <img
                      src={obra.portada}
                      className="w-28 h-36 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {obra.titulo}
                      </h3>

                      <p className="text-sm text-gray-600">
                        {obra.sinopsis}
                      </p>

                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {badge.icon} {obra.estado}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/moderacion/${obra._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold"
                    >
                      Gestionar
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}