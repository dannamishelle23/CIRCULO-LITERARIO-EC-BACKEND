import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MdBook, MdCheckCircle } from "react-icons/md"
import ObraForm from "../components/ObraForm"
import { crearObra } from "../services/obraService"

export default function CrearObra() {
  const navigate = useNavigate()
  const { clubId } = useParams()
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("") // "success" o "error"
  const [isLoading, setIsLoading] = useState(false)

  const handleCrearObra = async (datosObra) => {
    try {
      setIsLoading(true)
      setMensaje("")
      
      const response = await crearObra(datosObra)
      
      setTipoMensaje("success")
      setMensaje("✓ Obra creada correctamente. Redirigiendo...")
      
      // Redirigir a mis obras después de 2 segundos
      setTimeout(() => {
        navigate("/mis-obras")
      }, 2000)
    } catch (error) {
      setTipoMensaje("error")
      const errorMsg = error.response?.data?.msg || error.message || "Error al crear la obra"
      setMensaje("✗ " + errorMsg)
      console.error("Error al crear obra:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#e67e22]">Nueva Publicación</p>
              <h1 className="mt-3 text-3xl font-black text-[#2c3e50]">Crear Nueva Obra</h1>
              <p className="mt-2 text-sm text-gray-500">
                Completa los datos de tu obra y compártela con tu club literario. Necesitarás al menos 3 capítulos para postularla.
              </p>
            </div>
            <div className="rounded-3xl bg-[#e67e22] p-4 text-white">
              <MdBook size={36} />
            </div>
          </div>
        </div>

        {/* MENSAJE */}
        {mensaje && (
          <div
            className={`mb-6 rounded-2xl border p-4 flex items-center gap-3 ${
              tipoMensaje === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {tipoMensaje === "success" && <MdCheckCircle size={24} />}
            <span className="font-medium">{mensaje}</span>
          </div>
        )}

        {/* FORMULARIO */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <ObraForm clubId={clubId} onSubmit={handleCrearObra} isLoading={isLoading} />
        </div>
      </div>
    </section>
  )
}
