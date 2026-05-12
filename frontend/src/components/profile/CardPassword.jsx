import { useForm } from "react-hook-form"
import { useFetch } from "../../hooks/useFetch"
import { API_BASE_URL, getAuthHeaders, getStoredSession } from "../../utils/auth"

const CardPassword = () => {
    const session = getStoredSession()
    const fetchDataBackend = useFetch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const updatePassword = async (dataForm) => {
        if (!session?._id) return

        const url = `${API_BASE_URL}/auth/actualizar-password/${session._id}`
        const response = await fetchDataBackend(url, dataForm, "PUT", getAuthHeaders())

        if (response) {
            reset()
        }
    }

    return (
        <>
            <div className='mt-5'>
                <h1 className='font-black text-2xl text-gray-500 mt-16'>Actualizar contrasena</h1>
                <hr className='my-4 border-t-2 border-gray-300' />
            </div>

            <form onSubmit={handleSubmit(updatePassword)}>
                <div>
                    <label className="mb-2 block text-sm font-semibold">Contrasena actual</label>
                    <input
                        type="password"
                        placeholder="Ingresa tu contrasena actual"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 mb-2"
                        {...register("passwordActual", { required: "La contrasena actual es obligatoria." })}
                    />
                    {errors.passwordActual && <p className="text-sm text-red-600 mb-3">{errors.passwordActual.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">Nueva contrasena</label>
                    <input
                        type="password"
                        placeholder="Ingresa la nueva contrasena"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 mb-2"
                        {...register("passwordNuevo", {
                            required: "La nueva contrasena es obligatoria.",
                            minLength: { value: 6, message: "Minimo 6 caracteres." }
                        })}
                    />
                    {errors.passwordNuevo && <p className="text-sm text-red-600 mb-3">{errors.passwordNuevo.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">Confirmar contrasena</label>
                    <input
                        type="password"
                        placeholder="Repite la nueva contrasena"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-600 mb-2"
                        {...register("confirmPassword", { required: "Debes confirmar la nueva contrasena." })}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-600 mb-3">{errors.confirmPassword.message}</p>}
                </div>

                <input
                    type="submit"
                    className='bg-[#2c3e50] w-full p-2 text-slate-100 uppercase font-bold rounded-lg hover:bg-[#1b2836] cursor-pointer transition-all'
                    value='Cambiar'
                />
            </form>
        </>
    )
}

export default CardPassword
