import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useFetch } from "../../hooks/useFetch"
import { API_BASE_URL, getAuthHeaders, getStoredSession, saveSession } from "../../utils/auth"
import { buildProfileFormValues } from "../../utils/profile"

const FormularioPerfil = ({ profile, onProfileUpdated }) => {
    const session = getStoredSession()
    const fetchDataBackend = useFetch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: buildProfileFormValues(profile)
    })

    useEffect(() => {
        reset(buildProfileFormValues(profile))
    }, [profile, reset])

    const updateProfile = async (dataForm) => {
        if (!session?._id) return

        const url = `${API_BASE_URL}/auth/actualizar-perfil/${session._id}`
        const response = await fetchDataBackend(url, dataForm, "PUT", getAuthHeaders())

        if (response) {
            const updatedSession = {
                ...session,
                ...dataForm
            }
            saveSession(updatedSession)
            onProfileUpdated?.(updatedSession)
        }
    }

    return (
        <form onSubmit={handleSubmit(updateProfile)}>
            <div>
                <label className="mb-2 block text-sm font-semibold">Nombre</label>
                <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 mb-2"
                    {...register("nombres", { required: "El nombre es obligatorio." })}
                />
                {errors.nombres && <p className="text-sm text-red-600 mb-3">{errors.nombres.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold">Apellido</label>
                <input
                    type="text"
                    placeholder="Ingresa tu apellido"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 mb-2"
                    {...register("apellidos", { required: "El apellido es obligatorio." })}
                />
                {errors.apellidos && <p className="text-sm text-red-600 mb-3">{errors.apellidos.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold">Provincia</label>
                <input
                    type="text"
                    placeholder="Ingresa tu provincia"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 mb-2"
                    {...register("provincia", { required: "La provincia es obligatoria." })}
                />
                {errors.provincia && <p className="text-sm text-red-600 mb-3">{errors.provincia.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold">Nombre de usuario</label>
                <input
                    type="text"
                    placeholder="Ingresa tu nombre de usuario"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 mb-2"
                    {...register("username", { required: "El nombre de usuario es obligatorio." })}
                />
                {errors.username && <p className="text-sm text-red-600 mb-3">{errors.username.message}</p>}
            </div>
            <div>
                <label className="mb-2 block text-sm font-semibold">Correo electronico</label>
                <input
                    type="email"
                    placeholder="Ingresa tu correo"
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 mb-2"
                    {...register("email", { required: "El correo electronico es obligatorio." })}
                />
                {errors.email && <p className="text-sm text-red-600 mb-3">{errors.email.message}</p>}
            </div>

            <input
                type="submit"
                className='bg-[#2c3e50] w-full p-2 mt-5 text-slate-100 uppercase font-bold rounded-lg hover:bg-[#1b2836] cursor-pointer transition-all'
                value='Actualizar'
            />
        </form>
    )
}

export default FormularioPerfil
