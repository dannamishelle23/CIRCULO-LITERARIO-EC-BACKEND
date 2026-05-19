import axios from "axios"
import { useCallback } from "react"
import { toast } from "react-toastify"

export function useFetch() {

    const fetchDataBackend = useCallback(async (url, data = null, method = "GET", headers = {}) => {

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

            toast.success(response?.data?.msg)

            return response?.data

        } catch (error) {

            console.error(error)

            toast.error(error.response?.data?.msg)
        }

    }, [])

    return fetchDataBackend
}