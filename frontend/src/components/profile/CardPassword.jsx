import { useForm } from "react-hook-form"
import { useFetch } from "../../hooks/useFetch"
import { API_BASE_URL, getAuthHeaders, getStoredSession } from "../../utils/auth"

const CardPassword = () => {
  const session = getStoredSession()
  const fetchDataBackend = useFetch()
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

  // Monitoreamos el campo passwordNuevo para validarlo contra confirmPassword
  const nuevaPassword = watch("passwordNuevo")

  const updatePassword = async (dataForm) => {
    if (!session?._id) return

    const url = `${API_BASE_URL}/usuarios/actualizar-password/${session._id}`
    const response = await fetchDataBackend(url, dataForm, "PUT", getAuthHeaders())

    if (response) {
      reset()
    }
  }

  // Estilos visuales comunes
  const labelStyle = "mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest"
  const inputStyle = "block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm"
  const errorStyle = "text-xs text-red-500 mt-1 font-semibold italic"

  return (
    <form onSubmit={handleSubmit(updatePassword)} className="space-y-4">
      
      <div>
        <h2 className="text-xl font-black text-[#2c3e50] uppercase tracking-tight mb-1">
          Seguridad
        </h2>
        <p className="text-xs text-gray-400 font-medium mb-4">Actualiza tu credencial de acceso de forma segura.</p>
      </div>

      <div>
        <label className={labelStyle}>Contraseña actual</label>
        <input
          type="password"
          placeholder="Ingresa tu contraseña actual"
          className={inputStyle}
          {...register("passwordActual", { required: "La contraseña actual es obligatoria." })}
        />
        {errors.passwordActual && <p className={errorStyle}>{errors.passwordActual.message}</p>}
      </div>

      <div>
        <label className={labelStyle}>Nueva contraseña</label>
        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          className={inputStyle}
          {...register("passwordNuevo", {
            required: "La nueva contraseña es obligatoria.",
            minLength: { value: 6, message: "Mínimo 6 caracteres." }
          })}
        />
        {errors.passwordNuevo && <p className={errorStyle}>{errors.passwordNuevo.message}</p>}
      </div>

      <div>
        <label className={labelStyle}>Confirmar nueva contraseña</label>
        <input
          type="password"
          placeholder="Repite tu nueva contraseña"
          className={inputStyle}
          {...register("confirmPassword", { 
            required: "Debes confirmar la nueva contraseña.",
            validate: (value) => value === nuevaPassword || "Las contraseñas nuevas no coinciden."
          })}
        />
        {errors.confirmPassword && <p className={errorStyle}>{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-[#e67e22] text-white font-bold py-3 rounded-xl hover:bg-[#d35400] transition shadow-sm mt-2 uppercase tracking-wider text-sm cursor-pointer"
      >
        Cambiar Contraseña
      </button>
    </form>
  )
}

export default CardPassword