import { useEffect, useState } from 'react'
import logoDog from '../assets/dog-hand.webp'
import { Link, useParams, useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL } from '../utils/auth'
import 'react-toastify/dist/ReactToastify.css'

export const Confirm = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const fetchDataBackend = useFetch()
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [hasAttempted, setHasAttempted] = useState(false)
    const [email, setEmail] = useState('')
    const [showResendForm, setShowResendForm] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)

    // Función para confirmar la cuenta
    const handleConfirmAccount = async () => {
        setIsLoading(true)
        setError(false)
        
        try {
            const url = `${API_BASE_URL}/auth/confirmar/${token}`
            const response = await fetchDataBackend(url, null, "GET")
            
            if (response && response.msg) {
                setIsConfirmed(true)
                toast.success("¡Cuenta confirmada exitosamente!", {
                    position: "top-center",
                    autoClose: 3000
                })
                
                // Redirigir automáticamente después de 3 segundos
                setTimeout(() => {
                    navigate("/login")
                }, 3000)
            } else {
                setError(true)
                toast.error("El enlace es inválido o ha expirado", {
                    position: "top-center",
                    autoClose: 3000
                })
            }
        } catch (err) {
            setError(true)
            toast.error("Error al confirmar la cuenta. Intenta de nuevo.", {
                position: "top-center",
                autoClose: 3000
            })
            console.error(err)
        } finally {
            setIsLoading(false)
            setHasAttempted(true)
        }
    }

    // Función para reenviar el correo de confirmación
    const handleResendEmail = async (e) => {
        e.preventDefault()
        
        if (!email.trim()) {
            toast.error("Por favor ingresa tu correo electrónico", {
                position: "top-center",
                autoClose: 2000
            })
            return
        }

        setResendLoading(true)
        
        try {
            const url = `${API_BASE_URL}/auth/reenviar-confirmacion`
            const response = await fetchDataBackend(url, {email}, "POST")
            
            if (response && response.msg) {
                toast.success("¡Correo reenviado exitosamente! Revisa tu buzón.", {
                    position: "top-center",
                    autoClose: 3000
                })
                setEmail('')
                setShowResendForm(false)
            }
        } catch (err) {
            toast.error("Error al reenviar el correo. Intenta de nuevo.", {
                position: "top-center",
                autoClose: 3000
            })
            console.error(err)
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-[#FEF2E1] to-[#f5e6d3]">
            <ToastContainer />
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
                <img 
                    className="object-cover h-48 w-48 rounded-full border-4 border-[#e67e22] mx-auto mb-6 shadow-lg" 
                    src={logoDog} 
                    alt="Confirmacion de cuenta"
                />

                <div className="flex flex-col items-center justify-center text-center">
                    {!hasAttempted ? (
                        <>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6 mb-4">
                                Confirmar tu cuenta
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Haz clic en el botón de abajo para verificar tu correo electrónico y activar tu cuenta.
                            </p>
                            <button
                                onClick={handleConfirmAccount}
                                disabled={isLoading}
                                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 ${
                                    isLoading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-[#e67e22] hover:bg-[#d35400] active:scale-95'
                                }`}
                            >
                                {isLoading ? "Confirmando..." : "Confirmar mi cuenta"}
                            </button>
                        </>
                    ) : isConfirmed ? (
                        <>
                            <div className="mb-4">
                                <div className="text-6xl text-[#e67e22] mb-4">✓</div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
                                ¡Cuenta confirmada!
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Tu correo ha sido verificado exitosamente. Ya puedes iniciar sesión en tu cuenta.
                            </p>
                            <Link 
                                to="/login" 
                                className="w-full py-3 px-6 text-center bg-[#e67e22] text-white font-bold rounded-xl hover:bg-[#d35400] transition-all duration-300 active:scale-95 block"
                            >
                                Ir a login
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <div className="text-6xl text-red-500 mb-4">✕</div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
                                Error al confirmar
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                El enlace puede haber expirado o ser inválido.
                            </p>

                            {/* Formulario para reenviar correo */}
                            {!showResendForm ? (
                                <div className="w-full space-y-3 mb-6">
                                    <button
                                        onClick={() => setShowResendForm(true)}
                                        className="w-full py-3 px-6 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all duration-300 active:scale-95"
                                    >
                                        Reenviar correo de confirmación
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleResendEmail} className="w-full mb-6">
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2 text-left">
                                            Correo electrónico:
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="tu@correo.com"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e67e22] focus:ring-2 focus:ring-[#e67e22]/30"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={resendLoading}
                                        className={`w-full py-2 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
                                            resendLoading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                                        }`}
                                    >
                                        {resendLoading ? "Reenviando..." : "Enviar"}
                                    </button>
                                </form>
                            )}

                            <div className="w-full space-y-3 border-t pt-6">
                                <Link 
                                    to="/register" 
                                    className="w-full py-3 px-6 text-center bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-700 transition-all duration-300 active:scale-95 block"
                                >
                                    Crear nueva cuenta
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="w-full py-3 px-6 text-center bg-[#e67e22] text-white font-bold rounded-xl hover:bg-[#d35400] transition-all duration-300 active:scale-95 block"
                                >
                                    Ir a login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Confirm
