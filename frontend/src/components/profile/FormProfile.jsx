import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch"
import { MdArrowBackIosNew } from "react-icons/md"

import {
  API_BASE_URL,
  getAuthHeaders,
  getStoredSession,
  saveSession
} from "../../utils/auth"

import { buildProfileFormValues } from "../../utils/profile"

const FormularioPerfil = ({ profile, onProfileUpdated }) => {

  const session = getStoredSession()
  const navigate = useNavigate()
  const fetchDataBackend = useFetch()

  const [backendErrors, setBackendErrors] = useState({})
  const [generalError, setGeneralError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: buildProfileFormValues(profile)
  })

  useEffect(() => {
    reset(buildProfileFormValues(profile))
  }, [profile, reset])

  const updateProfile = async (dataForm) => {

    try {

      setBackendErrors({})
      setGeneralError("")

      if (!session?._id) return

      const url =
        `${API_BASE_URL}/usuarios/actualizar-perfil/${session._id}`

      const response = await fetchDataBackend(
        url,
        dataForm,
        "PATCH",
        getAuthHeaders()
      )

      if (response) {

        const usuarioActualizado =
          response.usuario || dataForm

        const updatedSession = {
          ...session,
          ...usuarioActualizado
        }

        saveSession(updatedSession)

        onProfileUpdated?.(updatedSession)
      }

    } catch (error) {

      console.error(error)

      if (error.response?.data?.errors) {

        setBackendErrors(
          error.response.data.errors
        )

      } else {

        setGeneralError(
          error.response?.data?.msg ||
          "Error al actualizar el perfil."
        )
      }
    }
  }

  const labelStyle =
    "mb-1.5 block text-xs font-bold uppercase text-[#2c3e50] tracking-widest"

  const inputStyle =
    "block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-sm"

  const errorStyle =
    "text-xs text-red-500 mt-1 font-semibold italic"

  const errorInput =
    "border-red-400 focus:border-red-500 focus:ring-red-500"

  return (
    <div className="w-full">

      {/* BOTÓN VOLVER */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#2c3e50] transition-colors duration-200 cursor-pointer group"
        >
          <MdArrowBackIosNew
            size={14}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />

          Volver
        </button>
      </div>

      <form
        onSubmit={handleSubmit(updateProfile)}
        className="space-y-4"
      >

        <div>
          <h2 className="text-xl font-black text-[#2c3e50] uppercase tracking-tight mb-1">
            Datos Personales
          </h2>

          <p className="text-xs text-gray-400 font-medium mb-4">
            Modifica la información visible de tu cuenta.
          </p>
        </div>

        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 font-semibold">
            {generalError}
          </div>
        )}

        {/* NOMBRES Y APELLIDOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className={labelStyle}>
              Nombre
            </label>

            <input
              type="text"
              placeholder="Tu nombre"
              className={`${inputStyle} ${
                errors.nombres || backendErrors.nombres
                  ? errorInput
                  : ""
              }`}
              {...register("nombres", {
                required: "El nombre es obligatorio."
              })}
            />

            {errors.nombres && (
              <p className={errorStyle}>
                {errors.nombres.message}
              </p>
            )}

            {backendErrors.nombres && (
              <p className={errorStyle}>
                {backendErrors.nombres[0]}
              </p>
            )}
          </div>

          <div>
            <label className={labelStyle}>
              Apellido
            </label>

            <input
              type="text"
              placeholder="Tu apellido"
              className={`${inputStyle} ${
                errors.apellidos || backendErrors.apellidos
                  ? errorInput
                  : ""
              }`}
              {...register("apellidos", {
                required: "El apellido es obligatorio."
              })}
            />

            {errors.apellidos && (
              <p className={errorStyle}>
                {errors.apellidos.message}
              </p>
            )}

            {backendErrors.apellidos && (
              <p className={errorStyle}>
                {backendErrors.apellidos[0]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className={labelStyle}>
            Biografía
          </label>

          <textarea
            rows={4}
            placeholder="Cuéntanos algo sobre ti..."
            className={`${inputStyle} ${
              errors.biografia || backendErrors.biografia
                ? errorInput
                : ""
            }`}
            {...register("biografia")}
          />

          {errors.biografia && (
            <p className={errorStyle}>
              {errors.biografia.message}
            </p>
          )}

          {backendErrors.biografia && (
            <p className={errorStyle}>
              {backendErrors.biografia[0]}
            </p>
          )}
        </div>

        {/* PROVINCIA */}
        <div>
          <label className={labelStyle}>
            Provincia
          </label>

          <input
            type="text"
            placeholder="Tu provincia"
            className={`${inputStyle} ${
              errors.provincia || backendErrors.provincia
                ? errorInput
                : ""
            }`}
            {...register("provincia", {
              required: "La provincia es obligatoria."
            })}
          />

          {errors.provincia && (
            <p className={errorStyle}>
              {errors.provincia.message}
            </p>
          )}

          {backendErrors.provincia && (
            <p className={errorStyle}>
              {backendErrors.provincia[0]}
            </p>
          )}
        </div>

        {/* USERNAME */}
        <div>
          <label className={labelStyle}>
            Nombre de usuario
          </label>

          <input
            type="text"
            placeholder="lector_efimero"
            className={`${inputStyle} ${
              errors.username || backendErrors.username
                ? errorInput
                : ""
            }`}
            {...register("username", {
              required:
                "El nombre de usuario es obligatorio."
            })}
          />

          {errors.username && (
            <p className={errorStyle}>
              {errors.username.message}
            </p>
          )}

          {backendErrors.username && (
            <p className={errorStyle}>
              {backendErrors.username[0]}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className={labelStyle}>
            Correo electrónico
          </label>

          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className={`${inputStyle} ${
              errors.email || backendErrors.email
                ? errorInput
                : ""
            }`}
            {...register("email", {
              required:
                "El correo electrónico es obligatorio."
            })}
          />

          {errors.email && (
            <p className={errorStyle}>
              {errors.email.message}
            </p>
          )}

          {backendErrors.email && (
            <p className={errorStyle}>
              {backendErrors.email[0]}
            </p>
          )}
        </div>

        <div className="border-t pt-5 mt-5">
          <h3 className="font-bold text-[#2c3e50] mb-4">
            Redes Sociales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className={labelStyle}>
                Facebook
              </label>

              <input
                type="text"
                placeholder="https://facebook.com/usuario"
                className={inputStyle}
                {...register("redes.facebook")}
              />
            </div>

            <div>
              <label className={labelStyle}>
                Instagram
              </label>

              <input
                type="text"
                placeholder="https://instagram.com/usuario"
                className={inputStyle}
                {...register("redes.instagram")}
              />
            </div>

            <div>
              <label className={labelStyle}>
                X (Twitter)
              </label>

              <input
                type="text"
                placeholder="https://x.com/usuario"
                className={inputStyle}
                {...register("redes.x")}
              />
            </div>

            <div>
              <label className={labelStyle}>
                TikTok
              </label>

              <input
                type="text"
                placeholder="https://tiktok.com/@usuario"
                className={inputStyle}
                {...register("redes.tiktok")}
              />
            </div>

            <div>
              <label className={labelStyle}>
                YouTube
              </label>

              <input
                type="text"
                placeholder="https://youtube.com/@usuario"
                className={inputStyle}
                {...register("redes.youtube")}
              />
            </div>

            <div>
              <label className={labelStyle}>
                Sitio Web
              </label>

              <input
                type="text"
                placeholder="https://misitio.com"
                className={inputStyle}
                {...register("redes.web")}
              />
            </div>

          </div>
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