import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MdBook, MdCheckCircle, MdArrowBackIosNew, MdVerifiedUser, MdCollectionsBookmark, MdCopyright } from "react-icons/md"
import ObraForm from "../../components/ObraForm"
import { crearObra } from "../../services/obraService"

export default function CrearObra() {
  const navigate = useNavigate()
  const { clubId } = useParams()
  const [mensaje, setMensaje] = useState("")
  const [tipoMensaje, setTipoMensaje] = useState("") // "success" o "error"
  const [isLoading, setIsLoading] = useState(false)

  // Estados para controlar los checks de validación literaria
  const [requisitos, setRequisitos] = useState({
    capitulosMinimos: false,
    sinSelloEditorial: false,
    derechosAutor: false,
  })

  const handleCheckChange = (e) => {
    const { name, checked } = e.target
    setRequisitos((prev) => ({
      ...prev,
      [name]: checked
    }))
  }

  // Se habilita el formulario únicamente si se aceptaron todas las condiciones de originalidad
  const requisitosCompletos = requisitos.capitulosMinimos && requisitos.sinSelloEditorial && requisitos.derechosAutor

  const handleCrearObra = async (datosObra) => {
    if (!requisitosCompletos) return

    try {
      setIsLoading(true)
      setMensaje("")
      
      const response = await crearObra(datosObra)
      
      setTipoMensaje("success")
      setMensaje("Manuscrito registrado correctamente. Redirigiendo a tu espacio...")
      
      setTimeout(() => {
        navigate(`/mi-obra/${response.obra._id}`)
      }, 2000)
    } catch (error) {
      setTipoMensaje("error")
      const errorMsg = error.response?.data?.msg || error.message || "Error al procesar el registro de la obra"
      setMensaje("✗ " + errorMsg)
      console.error("Error al crear obra:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* BOTÓN DE RETORNO */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:text-[#e67e22] hover:border-orange-200 transition shadow-3xs cursor-pointer active:scale-98 group"
          >
            <MdArrowBackIosNew size={11} className="transition-transform duration-200 group-hover:-translate-x-0.5" /> Volver
          </button>
        </div>

        {/* HEADER */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-2xs">
          <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black bg-[#e67e22] text-white px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Nueva Publicación
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-[#2c3e50] uppercase tracking-tight">
                Crear Nueva Obra
              </h1>
              <p className="text-xs md:text-sm text-gray-400 font-medium max-w-2xl leading-relaxed">
                Registra tu propuesta literaria para postularla dentro del club. Asegúrate de cumplir minuciosamente con los lineamientos antes de habilitar la carga.
              </p>
            </div>
            <div className="rounded-2xl bg-[#e67e22] text-white p-4 shadow-3xs shrink-0 self-start sm:self-center">
              <MdBook size={28} />
            </div>
          </div>
        </div>

        {/* NOTIFICACIONES */}
        {mensaje && (
          <div
            className={`p-4 rounded-xl border text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 shadow-3xs ${
              tipoMensaje === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            {tipoMensaje === "success" && <MdCheckCircle size={16} />}
            <span>{mensaje}</span>
          </div>
        )}

        {/* PANEL DE CONTROL DE REQUISITOS OBLIGATORIOS */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
          <div className="pb-2 border-b border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">
              Declaración de Originalidad 
            </h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              Por favor, verifica y acepta los siguientes requisitos para autorizar la edición de tu obra
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* REQUISITO 1 */}
            <label className={`flex flex-col justify-between border rounded-2xl p-4 cursor-pointer transition-all duration-300 select-none ${
              requisitos.capitulosMinimos 
                ? "bg-amber-50/40 border-orange-200 text-[#2c3e50]" 
                : "bg-gray-50/50 border-gray-100 text-gray-500 hover:bg-gray-50"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border mt-0.5 ${requisitos.capitulosMinimos ? "bg-white border-orange-200 text-[#e67e22]" : "bg-white border-gray-200 text-gray-400"}`}>
                  <MdCollectionsBookmark size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase tracking-tight">Estructura Inicial</p>
                  <p className="text-[11px] font-medium leading-normal opacity-80">
                    Garantizo que la historia cuenta con un mínimo de 3 capítulos listos para su revisión.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <input
                  type="checkbox"
                  name="capitulosMinimos"
                  checked={requisitos.capitulosMinimos}
                  onChange={handleCheckChange}
                  className="w-4 h-4 rounded text-[#e67e22] focus:ring-[#e67e22] border-gray-300 cursor-pointer accent-[#e67e22]"
                />
              </div>
            </label>

            {/* REQUISITO 2 */}
            <label className={`flex flex-col justify-between border rounded-2xl p-4 cursor-pointer transition-all duration-300 select-none ${
              requisitos.sinSelloEditorial 
                ? "bg-amber-50/40 border-orange-200 text-[#2c3e50]" 
                : "bg-gray-50/50 border-gray-100 text-gray-500 hover:bg-gray-50"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border mt-0.5 ${requisitos.sinSelloEditorial ? "bg-white border-orange-200 text-[#e67e22]" : "bg-white border-gray-200 text-gray-400"}`}>
                  <MdVerifiedUser size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase tracking-tight">Exclusividad Editorial</p>
                  <p className="text-[11px] font-medium leading-normal opacity-80">
                    Confirmo que el manuscrito es independiente y no está publicado bajo ningún sello editorial comercial.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <input
                  type="checkbox"
                  name="sinSelloEditorial"
                  checked={requisitos.sinSelloEditorial}
                  onChange={handleCheckChange}
                  className="w-4 h-4 rounded text-[#e67e22] focus:ring-[#e67e22] border-gray-300 cursor-pointer accent-[#e67e22]"
                />
              </div>
            </label>

            {/* REQUISITO 3 */}
            <label className={`flex flex-col justify-between border rounded-2xl p-4 cursor-pointer transition-all duration-300 select-none ${
              requisitos.derechosAutor 
                ? "bg-amber-50/40 border-orange-200 text-[#2c3e50]" 
                : "bg-gray-50/50 border-gray-100 text-gray-500 hover:bg-gray-50"
            }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border mt-0.5 ${requisitos.derechosAutor ? "bg-white border-orange-200 text-[#e67e22]" : "bg-white border-gray-200 text-gray-400"}`}>
                  <MdCopyright size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase tracking-tight">Propiedad Intelectual</p>
                  <p className="text-[11px] font-medium leading-normal opacity-80">
                    Acepto que esta obra es de mi autoría intelectual y otorgo el consentimiento explícito para su publicación comunitaria.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <input
                  type="checkbox"
                  name="derechosAutor"
                  checked={requisitos.derechosAutor}
                  onChange={handleCheckChange}
                  className="w-4 h-4 rounded text-[#e67e22] focus:ring-[#e67e22] border-gray-300 cursor-pointer accent-[#e67e22]"
                />
              </div>
            </label>
          </div>
        </div>

        {/* SECCIÓN DEL FORMULARIO DINÁMICO */}
        <div className={`transition-all duration-500 ${requisitosCompletos ? "opacity-100 pointer-events-auto" : "opacity-40 pointer-events-none select-none filter blur-[1px]"}`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-2xs">
            <ObraForm clubId={clubId} onSubmit={handleCrearObra} isLoading={isLoading} />
          </div>
        </div>

        {/* RECORDATORIO EN CASO DE ESTAR BLOQUEADO */}
        {!requisitosCompletos && (
          <div className="text-center py-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">
              * Debes marcar las 3 declaraciones obligatorias de arriba para desbloquear el formulario
            </p>
          </div>
        )}

      </div>
    </section>
  )
}