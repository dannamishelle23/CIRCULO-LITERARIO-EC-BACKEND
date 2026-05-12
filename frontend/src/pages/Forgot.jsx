import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL } from '../utils/auth'

export const Forgot = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const fetchDataBackend = useFetch()

    const sendMail = async (dataForm) => {
        const url = `${API_BASE_URL}/auth/recuperar-password`
        const response = await fetchDataBackend(url, dataForm, 'POST')

        if (response) {
            toast.success("Correo enviado correctamente 📩")
            setTimeout(() => navigate("/login"), 2000)
        } else {
            toast.error("Error al enviar el correo ❌")
        }
    }

    return (
        <div className="flex flex-col sm:flex-row min-h-screen bg-[#FEF2E1]">

            <ToastContainer />

            {/* FORM */}
            <div className="w-full sm:w-1/2 flex justify-center items-center p-6">

                <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-10">

                    <h1 className="text-3xl font-bold text-center text-[#2c3e50] mb-2">
                        ¿Olvidaste tu contraseña?
                    </h1>

                    <p className="text-center text-slate-500 mb-8">
                        Ingresa tu correo o usuario y te enviaremos un enlace para restablecerla.
                    </p>

                    <form onSubmit={handleSubmit(sendMail)}>

                        <input
                            type="text"
                            placeholder="Correo o usuario"
                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
                            {...register("identifier", {
                                required: "El campo es obligatorio."
                            })}
                        />

                        {errors.identifier && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.identifier.message}
                            </p>
                        )}

                        <button className="w-full mt-6 bg-[#2c3e50] text-white py-3 rounded-xl hover:bg-[#1b2836] transition">
                            Enviar enlace
                        </button>

                    </form>

                    <div className="text-center mt-6 text-sm">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-amber-700 font-semibold hover:underline"
                        >
                            Iniciar sesión
                        </Link>
                    </div>

                </div>

            </div>

            {/* IMAGEN */}
            <div className="hidden sm:block sm:w-1/2 bg-[url('/images/catforgot.jpg')] bg-cover bg-center" />

        </div>
    )
}