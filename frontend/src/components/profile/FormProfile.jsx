import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom" 
import { useFetch } from "../../hooks/useFetch"
import { MdArrowBackIosNew } from "react-icons/md" // Corregido: Importación con mayúscula
import { API_BASE_URL, getAuthHeaders, getStoredSession, saveSession } from "../../utils/auth"
import { buildProfileFormValues } from "../../utils/profile"

const FormularioPerfil = ({ profile, onProfileUpdated }) => {
  const session = getStoredSession()
  const navigate = useNavigate()
  const fetchDataBackend = useFetch()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: buildProfileFormValues(profile)
  })

  useEffect(() => {
    reset(buildProfileFormValues(profile))
  }, [profile, reset])

  const updateProfile = async (dataForm) => {
    if (!session?._id) return

    const url = `${API_BASE_URL}/usuarios/actualizar-perfil/${session._id}`
    
    // Corregido: Cambiado "PUT" a "PATCH" para sincronizarse con tu ruta router.patch del backend
    const response = await fetchDataBackend(url, dataForm, "PATCH", getAuthHeaders())

    if (response) {
      // Si tu backend ahora retorna { msg, usuario }, desestructuramos de forma segura
      const usuarioActualizado = response.usuario || dataForm

      const updatedSession = {
        ...session,
        ...usuarioActualizado
      }
      saveSession(updatedSession)
      onProfileUpdated?.(updatedSession)
    }
  }

  // Estilos visuales comunes
  const labelStyle = "mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest"
  const inputStyle = "block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm"
  const errorStyle = "text-xs text-red-500 mt-1 font-semibold italic"

  return (
    <div className="w-full">
      {/* BOTÓN VOLVER */}
      <div className="mb-4">
        <button
          type="button" // Evita disparar el submit por accidente
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#2c3e50] transition-colors duration-200 cursor-pointer group"
        >
          <MdArrowBackIosNew size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          Volver
        </button>
      </div>

      <form onSubmit={handleSubmit(updateProfile)} className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-[#2c3e50] uppercase tracking-tight mb-1">
            Datos Personales
          </h2>
          <p className="text-xs text-gray-400 font-medium mb-4">Modifica la información visible de tu cuenta.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              className={inputStyle}
              {...register("nombres", { required: "El nombre es obligatorio." })}
            />
            {errors.nombres && <p className={errorStyle}>{errors.nombres.message}</p>}
          </div>

          <div>
            <label className={labelStyle}>Apellido</label>
            <input
              type="text"
              placeholder="Tu apellido"
              className={inputStyle}
              {...register("apellidos", { required: "El apellido es obligatorio." })}
            />
            {errors.apellidos && <p className={errorStyle}>{errors.apellidos.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelStyle}>Provincia</label>
          <input
            type="text"
            placeholder="Tu provincia"
            className={inputStyle}
            {...register("provincia", { required: "La provincia es obligatoria." })}
          />
          {errors.provincia && <p className={errorStyle}>{errors.provincia.message}</p>}
        </div>

        <div>
          <label className={labelStyle}>Nombre de usuario</label>
          <input
            type="text"
            placeholder="lector_efimero"
            className={inputStyle}
            {...register("username", { required: "El nombre de usuario es obligatorio." })}
          />
          {errors.username && <p className={errorStyle}>{errors.username.message}</p>}
        </div>

        <div>
          <label className={labelStyle}>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className={inputStyle}
            {...register("email", { required: "El correo electrónico es obligatorio." })}
          />
          {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-[#2c3e50] text-white font-bold py-3 rounded-xl hover:bg-[#1b2836] transition shadow-sm mt-2 uppercase tracking-wider text-sm cursor-pointer"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}

export default FormularioPerfil