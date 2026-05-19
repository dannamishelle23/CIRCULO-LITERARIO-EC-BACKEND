import { useState } from "react"
import ObraForm from "../components/ObraForm"

export default function CrearObra() {
  const [mensaje, setMensaje] = useState("")

  const handleCrearObra = (obra) => {
    setMensaje("Obra creada correctamente. Implementa aquí la llamada al backend para guardar la obra.")
    console.log("Crear obra", obra)
  }

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
          <h1 className="text-3xl font-black text-[#2c3e50]">Crear Nueva Obra</h1>
          <p className="mt-3 text-sm text-gray-500">
            Completa los datos de tu obra y compártela con tu club literario.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {mensaje && (
            <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-700">
              {mensaje}
            </div>
          )}
          <ObraForm onSubmit={handleCrearObra} />
        </div>
      </div>
    </section>
  )
}
