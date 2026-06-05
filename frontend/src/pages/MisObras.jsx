import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MdBook, MdEdit, MdDelete, MdCheckCircle, MdSend } from "react-icons/md"
import { listarObrasClub, postularObra, actualizarObra } from "../services/obraService"
import { getClubs } from "../services/clubService"
import ObraForm from "../components/ObraForm"

export default function MisObras() {
  const navigate = useNavigate()
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [clubSeleccionado, setClubSeleccionado] = useState("")
  const [clubes, setClubes] = useState([])
  const [editingObra, setEditingObra] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("")

  // Cargar clubes
  useEffect(() => {
    const cargarClubes = async () => {
      try {
        const misClubes = await getClubs()
        setClubes(misClubes || [])
        if (misClubes && misClubes.length > 0) {
          setClubSeleccionado(misClubes[0]._id)
        }
      } catch (err) {
        console.error("Error al cargar clubes:", err)
        setClubes([])
      }
    }
    cargarClubes()
  }, [])

  // Cargar obras cuando cambia el club
  useEffect(() => {
    if (clubSeleccionado) {
      cargarObras()
    }
  }, [clubSeleccionado])

  const cargarObras = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await listarObrasClub(clubSeleccionado)
      setObras(response.obras || [])
    } catch (err) {
      console.error("Error al cargar obras:", err)
      setError("Error al cargar las obras")
    } finally {
      setLoading(false)
    }
  }

  const handlePostular = async (obraId) => {
    try {
      setMensaje("")
      await postularObra(obraId)
      setTipoMensaje("success")
      setMensaje("Obra postulada correctamente")
      cargarObras()
      setTimeout(() => setMensaje(""), 3000)
    } catch (error) {
      setTipoMensaje("error")
      const errorMsg = error.response?.data?.msg || "Error al postular"
      setMensaje("✗ " + errorMsg)
      setTimeout(() => setMensaje(""), 3000)
    }
  }

  const handleActualizar = async (datosObra) => {
    try {
      await actualizarObra(editingObra._id, datosObra)
      setTipoMensaje("success")
      setMensaje("Obra actualizada correctamente")
      setEditingObra(null)
      setShowForm(false)
      cargarObras()
      setTimeout(() => setMensaje(""), 3000)
    } catch (error) {
      setTipoMensaje("error")
      const errorMsg = error.response?.data?.msg || "Error al actualizar"
      setMensaje("✗ " + errorMsg)
    }
  }

  const getEstadoBadgeColor = (estado) => {
    const colors = {
      "Borrador": "bg-gray-100 text-gray-800",
      "EnRevision": "bg-yellow-100 text-yellow-800",
      "Aprobada": "bg-blue-100 text-blue-800",
      "EnVotacion": "bg-purple-100 text-purple-800",
      "Publicada": "bg-green-100 text-green-800",
      "Rechazada": "bg-red-100 text-red-800",
      "Ganadora": "bg-amber-100 text-amber-800"
    }
    return colors[estado] || "bg-gray-100 text-gray-800"
  }

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#e67e22]">Mis Obras</p>
              <h1 className="mt-3 text-3xl font-black text-[#2c3e50]">Administrar tus obras</h1>
              <p className="mt-2 text-sm text-gray-500">
                Gestiona tus publicaciones literarias, postúlalas a votación y sigue su progreso.
              </p>
            </div>
            <div className="rounded-3xl bg-[#e67e22] p-4 text-white">
              <MdBook size={36} />
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

        {/* MENSAJE */}
        {mensaje && (
          <div
            className={`mb-6 rounded-2xl border p-4 flex items-center gap-3 ${
              tipoMensaje === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <MdCheckCircle size={24} />
            <span className="font-medium">{mensaje}</span>
          </div>
        )}

        {/* FORMULARIO DE EDICIÓN */}
        {showForm && editingObra && (
          <div className="mb-8 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#2c3e50]">Editar Obra</h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingObra(null)
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <ObraForm
              onSubmit={handleActualizar}
              editingObra={editingObra}
              onCancel={() => {
                setShowForm(false)
                setEditingObra(null)
              }}
            />
          </div>
        )}

        {/* LISTADO DE OBRAS */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <p className="text-gray-600">Cargando obras...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
              {error}
            </div>
          </div>
        ) : obras.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <MdBook size={48} className="mx-auto text-[#e67e22] mb-4" />
            <h2 className="text-2xl font-bold text-[#2c3e50]">Aún no tienes obras</h2>
            <p className="mt-3 text-gray-500 mb-6">
              Crea tu primera obra para comenzar a compartir en el círculo literario.
            </p>
            <button
              onClick={() => navigate(`/crear-obra/${clubSeleccionado}`)}
              className="px-6 py-2 bg-[#e67e22] text-white font-bold rounded-lg hover:bg-orange-600 transition"
            >
              Crear Primera Obra
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {obras.map((obra) => (
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
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoBadgeColor(obra.estado)}`}>
                        {obra.estado}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {obra.sinopsis}
                    </p>

                    {obra.fechaPostulacion && (
                      <p className="text-xs text-gray-500">
                        📅 Postulada: {new Date(obra.fechaPostulacion).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* ACCIONES */}
                  <div className="md:col-span-1 flex flex-col gap-2 justify-center">
                    {obra.estado === "Borrador" || obra.estado === "Rechazada" ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingObra(obra)
                            setShowForm(true)
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-bold"
                        >
                          <MdEdit size={16} /> Editar
                        </button>
                        <button
                          onClick={() => handlePostular(obra._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#e67e22] text-white rounded-lg hover:bg-orange-600 transition text-sm font-bold"
                        >
                          <MdSend size={16} /> Postular
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/obra/${obra._id}`)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm font-bold"
                      >
                        <MdCheckCircle size={16} /> Ver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
