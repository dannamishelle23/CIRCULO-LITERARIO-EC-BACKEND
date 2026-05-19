import axios from "axios"
import { useCallback } from "react"
import { toast } from "react-toastify"

export function useFetch() {

    const fetchDataBackend = useCallback(async (
        url,
        data = null,
        method = "GET",
        headers = {}
    ) => {

        const toastId = toast.loading("Procesando solicitud...")

        try {

            const options = {
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                }
            }

            if (method.toUpperCase() !== "GET" && data !== null) {
                options.data = data
            }

            const response = await axios(options)

            toast.update(toastId, {
                render: response?.data?.msg,
                type: "success",
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true
            })

            return response?.data

        } catch (error) {

            console.error(error)

            toast.update(toastId, {
                render: error.response?.data?.msg || "Ocurrió un error",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true
            })
        }

    }, [])

    return fetchDataBackend
}