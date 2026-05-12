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
import { ToastContainer } from "react-toastify"
import { useFetch } from "../hooks/useFetch"
import { API_BASE_URL } from "../utils/auth"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const fetchDataBackend = useFetch()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const registerUser = async (dataForm) => {
    const url = `${API_BASE_URL}/usuarios/usuarios`
    const response = await fetchDataBackend(url, dataForm, "POST")

    if (response) {
      navigate("/login")
    }
  }

  const inputStyle =
    "block w-full pl-10 rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm"

  const labelStyle =
    "mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest"

  const errorStyle =
    "text-xs text-red-500 mt-1 font-semibold italic"

  return (
    <div className="flex h-screen bg-[#f8f9fa] font-sans overflow-hidden">
      <ToastContainer />

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
            className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className={labelStyle}>Nombres</label>
                <input
                  className={inputStyle}
                  placeholder="Tus nombres"
                  {...register("nombres", { required: "Obligatorio" })}
                />
                {errors.nombres && <p className={errorStyle}>{errors.nombres.message}</p>}
              </div>

              <div>
                <label className={labelStyle}>Apellidos</label>
                <input
                  className={inputStyle}
                  placeholder="Tus apellidos"
                  {...register("apellidos", { required: "Obligatorio" })}
                />
                {errors.apellidos && <p className={errorStyle}>{errors.apellidos.message}</p>}
              </div>

            </div>

            <div>
              <label className={labelStyle}>Email</label>
              <input
                className={inputStyle}
                placeholder="correo@ejemplo.com"
                {...register("email", { required: "Obligatorio" })}
              />
              {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelStyle}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={inputStyle}
                  placeholder="********"
                  {...register("password", { required: "Obligatorio" })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>

              {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
            </div>

            <button className="w-full bg-[#e67e22] text-white font-bold py-3 rounded-xl hover:bg-[#d35400] transition">
              Crear cuenta
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="text-[#2c3e50] font-semibold">
              Ya tienes cuenta? Inicia sesión
            </Link>
          </div>

        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="hidden lg:block lg:w-5/12 bg-[#2c3e50] text-white flex items-center justify-center p-10">
        <h2 className="text-4xl font-bold">
          Bienvenido al Club Literario
        </h2>
      </div>
    </div>
  )
}

export default Register