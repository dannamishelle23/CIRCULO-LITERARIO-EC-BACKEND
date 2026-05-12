import logoDog from "../assets/dog-hand.webp";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { API_BASE_URL } from "../utils/auth";

const Reset = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const fetchDataBackend = useFetch();

    const [tokenBack, setTokenBack] = useState(false);
    const [loadingToken, setLoadingToken] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();

    const password = watch("password");

    const changePassword = async (dataForm) => {
        const url = `${API_BASE_URL}/auth/nuevo-password/${token}`;
        const response = await fetchDataBackend(url, dataForm, "POST");

        if (response) {
            setTimeout(() => navigate("/login"), 1200);
        }
    };

    useEffect(() => {
        const verifyToken = async () => {
            const url = `${API_BASE_URL}/auth/recuperar-password/${token}`;
            const response = await fetchDataBackend(url, null, "GET");

            setTokenBack(Boolean(response));
            setLoadingToken(false);
        };

        verifyToken();
    }, [fetchDataBackend, token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FEF2E1] px-6">
            <ToastContainer />

            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">

                {/* IMAGE */}
                <img
                    src={logoDog}
                    alt="Reset password"
                    className="w-40 h-40 mx-auto rounded-full border-4 border-amber-600 object-cover"
                />

                {/* TITLE */}
                <h1 className="text-2xl font-black text-[#2c3e50] mt-4">
                    Recuperar contraseña
                </h1>

                <p className="text-gray-500 text-sm mt-2">
                    Crea una nueva contraseña para tu cuenta
                </p>

                {/* LOADING */}
                {loadingToken && (
                    <p className="mt-6 text-gray-500">Validando enlace...</p>
                )}

                {/* FORM */}
                {!loadingToken && tokenBack && (
                    <form onSubmit={handleSubmit(changePassword)} className="mt-6 space-y-4">

                        {/* PASSWORD */}
                        <div className="text-left">
                            <label className="text-sm font-bold text-[#2c3e50]">
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 6,
                                        message: "Mínimo 6 caracteres"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="text-left">
                            <label className="text-sm font-bold text-[#2c3e50]">
                                Confirmar contraseña
                            </label>
                            <input
                                type="password"
                                className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                {...register("confirmPassword", {
                                    required: "Confirma tu contraseña",
                                    validate: (value) =>
                                        value === password || "Las contraseñas no coinciden"
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-[#e67e22] text-white font-bold py-3 rounded-xl hover:bg-[#d35400] transition"
                        >
                            Actualizar contraseña
                        </button>
                    </form>
                )}

                {/* ERROR TOKEN */}
                {!loadingToken && !tokenBack && (
                    <p className="mt-6 text-red-600 font-semibold">
                        El enlace es inválido o ha expirado
                    </p>
                )}
            </div>
        </div>
    );
};

export default Reset;
