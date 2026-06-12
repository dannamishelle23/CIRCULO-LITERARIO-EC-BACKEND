import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
    if (clubSeleccionado) cargarObras()
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
      setError("Error al cargar clubes")
    } finally {
      setLoading(false)
    }
  }

  const cargarObras = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await listarObrasClub(clubSeleccionado)

      const filtradas = (response.obras || []).filter(
        (o) =>
          o.estado === "EnRevision" ||
          o.estado === "Aprobada" ||
          o.estado === "EnVotacion"
      )

      setObras(filtradas)
    } catch (err) {
      setError("Error al cargar obras")
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = (estado) => {
    const map = {
      EnRevision: "⏳ En revisión",
      Aprobada: "✓ Aprobada",
      EnVotacion: "🗳 En votación",
      Rechazada: "❌ Rechazada"
    }

    return map[estado] || estado
  }

  if (loading && clubes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-[#FEF2E1] p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl mb-6">
          <h1 className="text-2xl font-black">Panel de Moderación</h1>
        </div>

        {/* SELECTOR CLUB */}
        <div className="bg-white p-4 rounded-xl mb-6">
          <select
            value={clubSeleccionado}
            onChange={(e) => setClubSeleccionado(e.target.value)}
            className="w-full border p-2 rounded"
          >
            {clubes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* LISTA */}
        {obras.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center">
            No hay obras
          </div>
        ) : (
          <div className="space-y-4">

            {obras.map((obra) => {

              const autorNombre =
                obra.autor?.nombres && obra.autor?.apellidos
                  ? `${obra.autor.nombres} ${obra.autor.apellidos}`
                  : obra.autor?.username || "Autor no disponible"

              return (
                <div
                  key={obra._id}
                  className="bg-white p-4 rounded-xl flex gap-4 items-start"
                >

                  {/* PORTADA */}
                  {obra.portada ? (
                    <img
                      src={obra.portada}
                      className="w-24 h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center text-xs">
                      Sin portada
                    </div>
                  )}

                  {/* INFO */}
                  <div className="flex-1 space-y-1">

                    <h2 className="font-bold text-lg">
                      {obra.titulo}
                    </h2>

                    <p className="text-sm text-gray-600">
                      {obra.sinopsis}
                    </p>

                    <p className="text-xs">
                      👤 {autorNombre}
                    </p>

                    <p className="text-xs text-gray-500">
                      📅 {obra.fechaPostulacion
                        ? new Date(obra.fechaPostulacion).toLocaleDateString()
                        : "Sin fecha"}
                    </p>

                    <p className="text-xs font-bold">
                      Estado: {getEstadoBadge(obra.estado)}
                    </p>

                  </div>

                  {/* ACCION */}
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        navigate(`/moderacion/${obra._id}`)
                      }
                      className="bg-orange-500 text-white px-4 py-2 rounded"
                    >
                      {obra.estado === "EnRevision"
                        ? "Revisar"
                        : "Gestionar"}
                    </button>
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