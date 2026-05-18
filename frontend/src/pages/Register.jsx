import { useState } from "react"
import {
  MdVisibility,
  MdVisibilityOff,
  MdAutoStories,
  MdPerson,
  MdEmail,
  MdLocationCity,
  MdCake,
  MdLockOpen
} from "react-icons/md"

import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useFetch } from "../hooks/useFetch"
import { API_BASE_URL } from "../utils/auth"

const PROVINCIAS_ECUADOR = [
  "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", 
  "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", 
  "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", 
  "Santa Elena", "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", 
  "Zamora Chinchipe"
]

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const fetchDataBackend = useFetch()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const hoy = new Date()
  const fechaLimite16 = new Date(hoy.getFullYear() - 16, hoy.getMonth(), hoy.getDate())
  const maxFechaISO = fechaLimite16.toISOString().split("T")[0]

  const registerUser = async (dataForm) => {
    const url = `${API_BASE_URL}/auth/registro`

    const response = await fetchDataBackend(url, dataForm, "POST")

    if (response) {
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    }
  }

  const inputStyle =
    "block w-full pl-10 pr-4 rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm appearance-none"

  const labelStyle =
    "mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest"

  const errorStyle =
    "text-xs text-red-500 mt-1 font-semibold italic"

  const iconContainerStyle = 
    "absolute left-3 top-3.5 text-gray-400 pointer-events-none z-10"

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans overflow-hidden">

      {/* LADO IZQUIERDO: FORMULARIO */}
      <div className="w-full lg:w-7/12 flex flex-col items-center overflow-y-auto px-6 py-12">
        <div className="w-full max-w-2xl">

          <header className="text-center mb-10">
            <div className="flex justify-center mb-4 text-[#e67e22]">
              <MdAutoStories size={50} />
            </div>

            <h1 className="text-3xl font-black text-[#2c3e50] uppercase tracking-tighter">
              Circulo Literario <span className="text-[#e67e22]">EC</span>
            </h1>

            <p className="text-gray-500 mt-2 font-medium italic">
              Tu próxima gran lectura comienza aquí.
            </p>
          </header>

          <form
            onSubmit={handleSubmit(registerUser)}
            className="space-y-5 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            {/* FILA 1: Nombres y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}>Nombres</label>
                <div className="relative">
                  <span className={iconContainerStyle}><MdPerson size={18} /></span>
                  <input
                    className={inputStyle}
                    placeholder="Tus nombres"
                    {...register("nombres", { required: "El nombre es obligatorio" })}
                  />
                </div>
                {errors.nombres && <p className={errorStyle}>{errors.nombres.message}</p>}
              </div>

              <div>
                <label className={labelStyle}>Apellidos</label>
                <div className="relative">
                  <span className={iconContainerStyle}><MdPerson size={18} /></span>
                  <input
                    className={inputStyle}
                    placeholder="Tus apellidos"
                    {...register("apellidos", { required: "El apellido es obligatorio" })}
                  />
                </div>
                {errors.apellidos && <p className={errorStyle}>{errors.apellidos.message}</p>}
              </div>
            </div>

            {/* Nombre de Usuario (NUEVO CAMPO) */}
            <div>
              <label className={labelStyle}>Nombre de usuario</label>
              <div className="relative">
                <span className={iconContainerStyle}><MdPerson size={18} className="text-gray-400" /></span>
                <input
                  className={inputStyle}
                  placeholder="Ej. lector_efimero"
                  {...register("username", { 
                    required: "El nombre de usuario es obligatorio",
                    minLength: { value: 4, message: "Debe tener al menos 4 caracteres" }
                  })}
                />
              </div>
              {errors.username && <p className={errorStyle}>{errors.username.message}</p>}
            </div>

            {/* FILA 3: Email */}
            <div>
              <label className={labelStyle}>Email</label>
              <div className="relative">
                <span className={iconContainerStyle}><MdEmail size={18} /></span>
                <input
                  type="email"
                  className={inputStyle}
                  placeholder="correo@ejemplo.com"
                  {...register("email", { 
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Formato de correo inválido"
                    }
                  })}
                />
              </div>
              {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
            </div>

            {/* FILA 4: Fecha de Nacimiento y Provincia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}>Fecha de Nacimiento</label>
                <div className="relative">
                  <span className={iconContainerStyle}><MdCake size={18} /></span>
                  <input
                    type="date"
                    max={maxFechaISO}
                    className={`${inputStyle} text-gray-500`}
                    {...register("fechaNacimiento", { 
                      required: "La fecha de nacimiento es obligatoria",
                      validate: {
                        mayorDe16: (value) => {
                          const fechaSeleccionada = new Date(value)
                          return fechaSeleccionada <= fechaLimite16 || "Debes ser mayor de 16 años"
                        }
                      }
                    })}
                  />
                </div>
                {errors.fechaNacimiento && <p className={errorStyle}>{errors.fechaNacimiento.message}</p>}
              </div>

              <div>
                <label className={labelStyle}>Provincia</label>
                <div className="relative">
                  <span className={iconContainerStyle}><MdLocationCity size={18} /></span>
                  <select
                    className={`${inputStyle} bg-none`}
                    defaultValue=""
                    {...register("provincia", { required: "Selecciona una provincia" })}
                  >
                    <option value="" disabled hidden>Selecciona tu provincia</option>
                    {PROVINCIAS_ECUADOR.map((provincia) => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0"></div>
                </div>
                {errors.provincia && <p className={errorStyle}>{errors.provincia.message}</p>}
              </div>
            </div>

            {/* FILA 5: Contraseña */}
            <div>
              <label className={labelStyle}>Contraseña</label>
              <div className="relative">
                <span className={iconContainerStyle}><MdLockOpen size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputStyle}
                  placeholder="********"
                  {...register("password", { 
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Debe tener al menos 6 caracteres" }
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 z-10"
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
            </div>

            <button className="w-full bg-[#e67e22] text-white font-bold py-3 rounded-xl hover:bg-[#d35400] transition mt-2">
              Crear cuenta
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="text-[#2c3e50] font-semibold">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>

        </div>
      </div>

      {/* LADO DERECHO: VIDEO DE FONDO LIMPIO */}
      <div className="hidden lg:block lg:w-5/12 relative overflow-hidden flex items-center justify-center p-10 bg-black">
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
          <iframe
            className="w-[100vw] h-[56.25vw] min-h-full min-w-full object-cover scale-125"
            src="https://www.youtube.com/embed/_pfE4FCAYZY?autoplay=1&mute=1&loop=1&playlist=_pfE4FCAYZY&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1"
            title="Book pages background"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          ></iframe>
        </div>

        <div className="absolute inset-0 bg-[#2c3e50]/60 backdrop-blur-[1px] z-10"></div>

        <div className="relative z-20 text-center max-w-md px-4">
          <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-md">
            Bienvenido al <br/>
            <span className="text-[#e67e22]">Club Literario</span>
          </h2>
          <p className="mt-4 text-gray-200 font-medium drop-shadow-sm">
            Comparte tus lecturas favoritas, descubre nuevas historias y conecta con lectores de todo el mundo.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register