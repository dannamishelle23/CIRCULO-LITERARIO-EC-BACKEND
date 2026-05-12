import { useEffect, useState } from 'react'
import logoDog from '../assets/dog-hand.webp'
import { Link, useParams } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL } from '../utils/auth'

export const Confirm = () => {
    const { token } = useParams()
    const fetchDataBackend = useFetch()
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const confirmAccount = async () => {
            const url = `${API_BASE_URL}/usuarios/confirmar/${token}`
            const response = await fetchDataBackend(url, null, "GET")
            setIsConfirmed(Boolean(response))
            setIsLoading(false)
        }

        confirmAccount()
    }, [fetchDataBackend, token])

    return (
        <div className="flex flex-col items-center justify-center h-screen px-6">
            <ToastContainer />
            <img className="object-cover h-72 w-72 rounded-full border-4 border-solid border-slate-600" src={logoDog} alt="Confirmacion de cuenta"/>

            <div className="flex flex-col items-center justify-center text-center">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">
                    {isLoading ? "Validando tu cuenta" : isConfirmed ? "Cuenta confirmada" : "No pudimos confirmar tu cuenta"}
                </p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">
                    {isLoading ? "Espera un momento..." : isConfirmed ? "Ya puedes iniciar sesion." : "El enlace puede haber expirado o ser invalido."}
                </p>
                <Link to="/login" className="p-3 mt-8 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white">
                    Ir a login
                </Link>
            </div>
        </div>
    )
}
