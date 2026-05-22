import axios from "axios"
import { useCallback } from "react"
import { toast } from "react-toastify"

export function useFetch() {

    const fetchDataBackend = useCallback(async (
        url,
        data = null,
        method = "GET",
        headers = {},
        showToast = true
    ) => {

        let toastId = null

        /* MOSTRAR TOAST SOLO SI SE NECESITA */
        if (showToast) {

            toastId = toast.loading(
                "Procesando solicitud..."
            )
        }

        try {

            const options = {
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                }
            }

            /* BODY SOLO EN POST/PUT/PATCH */
            if (
                method.toUpperCase() !== "GET" &&
                data !== null
            ) {

                options.data = data
            }

            const response = await axios(options)

            /* TOAST SUCCESS */
            if (showToast) {

                toast.update(toastId, {
                    render:
                        response?.data?.msg ||
                        "Operación exitosa",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true
                })
            }

            return response?.data

        } catch (error) {

            console.error(error)

            /* TOAST ERROR */
            if (showToast) {

                toast.update(toastId, {
                    render:
                        error.response?.data?.msg ||
                        "Ocurrió un error",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true
                })
            }

            return null
        }

    }, [])

    return fetchDataBackend
}