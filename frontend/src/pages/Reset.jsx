import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { ToastContainer } from "react-toastify"
import { useFetch } from "../hooks/useFetch"
import { API_BASE_URL } from "../utils/auth"
import { 
  MdAutoStories, 
  MdLockOpen, 
  MdVisibility, 
  MdVisibilityOff 
} from "react-icons/md"
import "react-toastify/dist/ReactToastify.css"

const Reset = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const fetchDataBackend = useFetch()

  const [tokenBack, setTokenBack] = useState(false)
  const [loadingToken, setLoadingToken] = useState(true)
  
  // Estados para controlar la visibilidad de ambas contraseñas
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const password = watch("password")

  const changePassword = async (dataForm) => {
    const url = `${API_BASE_URL}/auth/nuevo-password/${token}`
    const response = await fetchDataBackend(url, dataForm, "POST")

    if (response) {
      // Redirección síncrona inmediata para evitar cuelgues en el árbol de componentes
      navigate("/login")
    }
  }

  useEffect(() => {
    const verifyToken = async () => {
      const url = `${API_BASE_URL}/auth/recuperar-password/${token}`
      const response = await fetchDataBackend(url, null, "GET")

      setTokenBack(Boolean(response))
      setLoadingToken(false)
    }

    verifyToken()
  }, [fetchDataBackend, token])

  // Estilos base unificados de Círculo Literario EC
  const inputStyle =
    "block w-full pl-10 pr-12 rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm"

  const labelStyle =
    "mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest"

  const errorStyle =
    "text-xs text-red-500 mt-1 font-semibold italic"

  const iconContainerStyle = 
    "absolute left-3 top-3.5 text-gray-400 pointer-events-none z-10"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] font-sans px-6">
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 w-full max-w-md text-center">
        
        {/* ICONO LITERARIO SUPERIOR */}
        <div className="flex justify-center mb-4 text-[#e67e22]">
          <MdAutoStories size={50} />
        </div>

        {/* ENCABEZADO */}
        <h1 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight">
          Restablecer <span className="text-[#e67e22]">Contraseña</span>
        </h1>

        <p className="text-gray-500 text-sm mt-2 font-medium">
          Ingresa y confirma tu nueva credencial de acceso para ingresar a tu cuenta.
        </p>

        {/* LOADING ESTADO */}
        {loadingToken && (
          <div className="mt-8 flex flex-col items-center justify-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#e67e22]"></div>
            <p className="text-sm text-gray-500 font-medium italic">Validando enlace de seguridad...</p>
          </div>
        )}

        {/* FORMULARIO ACTIVO (TOKEN VÁLIDO) */}
        {!loadingToken && tokenBack && (
          <form onSubmit={handleSubmit(changePassword)} className="mt-6 space-y-5 text-left">
            
            {/* NUEVA CONTRASEÑA */}
            <div>
              <label className={labelStyle}>Nueva contraseña</label>
              <div className="relative">
                <span className={iconContainerStyle}><MdLockOpen size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  className={inputStyle}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "Debe tener al menos 6 caracteres"
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div>
              <label className={labelStyle}>Confirmar contraseña</label>
              <div className="relative">
                <span className={iconContainerStyle}><MdLockOpen size={18} /></span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  className={inputStyle}
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden"
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition"
                >
                  {showConfirmPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className={errorStyle}>{errors.confirmPassword.message}</p>}
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <button
              type="submit"
              className="w-full bg-[#e67e22] text-white font-bold py-3 rounded-xl hover:bg-[#d35400] transition shadow-sm mt-2"
            >
              Actualizar contraseña
            </button>
          </form>
        )}

        {/* ERROR DE TOKEN EXPIRED / INVALID */}
        {!loadingToken && !tokenBack && (
          <div className="mt-8 bg-red-50 p-4 rounded-xl border border-red-100">
            <p className="text-red-600 font-semibold text-sm">
              El enlace de recuperación es inválido o ha expirado.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Por favor, regresa a la pantalla de inicio de sesión y solicita uno nuevo.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:text-[#e67e22] transition underline"
            >
              Volver al Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reset