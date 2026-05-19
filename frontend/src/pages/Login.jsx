import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { login } from "../services/authService"
import { ToastContainer, toast } from "react-toastify"
import { MdPerson, MdLockOpen, MdVisibility, MdVisibilityOff, MdAutoStories } from "react-icons/md"
import "react-toastify/dist/ReactToastify.css"

export default function Login() {
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      // Consumimos el servicio enviando los datos tal cual
      const response = await login({
        identifier,
        password
      })

      // Mostramos EXCLUSIVAMENTE el mensaje de éxito estructurado por el Backend (Status 200)
      toast.success(response.msg || "Inicio de sesión exitoso")

      const rol = response.usuario?.rol?.toLowerCase()

      // Redirección inmediata según el rol devuelto por el Backend
      if (rol === "administrador") {
        navigate("/admin")
      } else if (rol === "moderador") {
        navigate("/moderator")
      } else {
        navigate("/user-dashboard")
      }

    } catch (error) {
      // Capturamos el mensaje de error exacto enviado por el Backend (Status 4xx / 5xx)
      const backendErrorMsg = error.response?.data?.msg || "Error al iniciar sesión"
      
      toast.error(backendErrorMsg)
      console.error(error)
    }
  }

  // Estilos de la línea gráfica de Círculo Literario EC
  const inputStyle =
    "block w-full pl-10 pr-12 rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm"
  
  const iconContainerStyle = 
    "absolute left-3 top-3.5 text-gray-400 pointer-events-none"

  return (
    <div className="flex h-screen justify-center items-center bg-[#f8f9fa] font-sans">
      {/* autoClose={2000}: Si el componente se desmonta por el navigate, 
        ToastContainer gestiona internamente la limpieza para evitar memory leaks o cuelgues.
      */}
      <ToastContainer autoClose={2000} hideProgressBar={false} closeOnClick />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm m-4">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2 text-[#e67e22]">
            <MdAutoStories size={40} />
          </div>
          <h2 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight">
            Círculo Literario <span className="text-[#e67e22]">EC</span>
          </h2>
        </div>

        <form onSubmit={handleLogin}>
          {/* Identificador */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest">
              Usuario o Correo
            </label>
            <div className="relative">
              <span className={iconContainerStyle}><MdPerson size={18} /></span>
              <input
                type="text"
                required
                placeholder="correo@ejemplo.com"
                className={inputStyle}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-2">
            <label className="mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest">
              Contraseña
            </label>
            <div className="relative">
              <span className={iconContainerStyle}><MdLockOpen size={18} /></span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="********"
                className={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>

          {/* ¿Olvidaste tu contraseña? */}
          <div className="text-right mb-5">
            <Link 
              to="/forgot" 
              className="text-xs font-semibold text-gray-500 hover:text-[#e67e22] transition hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón de Ingreso */}
          <button
            type="submit"
            className="w-full bg-[#e67e22] text-white py-3 rounded-xl font-bold hover:bg-[#d35400] transition shadow-sm"
          >
            Ingresar
          </button>
        </form>

        {/* Enlace a Registro */}
        <div className="text-center mt-5 text-sm">
          <span className="text-gray-500">¿No tienes cuenta?</span>{" "}
          <Link to="/register" className="text-[#2c3e50] font-bold hover:underline">
            Regístrate
          </Link>
        </div>

      </div>
    </div>
  )
}