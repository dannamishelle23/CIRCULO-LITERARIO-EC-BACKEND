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

    const toastId = toast.loading(
      "Procesando solicitud..."
    )

    try {

      const options = {
        method,
        url,
        headers: {
          ...headers
        }
      }

      // SOLO agregar Content-Type si NO es FormData
      if (!(data instanceof FormData)) {
        options.headers["Content-Type"] =
          "application/json"
      }

      // Enviar body
      if (
        method.toUpperCase() !== "GET" &&
        data !== null
      ) {
        options.data = data
      }

      const response = await axios(options)

      const successMessage =
        response?.data?.msg ||
        response?.data?.message ||
        "Operación realizada correctamente."

      toast.update(toastId, {
        render: successMessage,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true
      })

      return response.data

    } catch (error) {

      console.error(error)

      const validationErrors =
        error?.response?.data?.errors

      let errorMessage =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        "Ocurrió un error"

      // Mostrar todos los errores de validación
      if (validationErrors) {

        const errorList = []

        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            errorList.push(`${field}: ${messages[0]}`)
          }
        })

        if (errorList.length > 0) {
          errorMessage = errorList.join("\n")
        }
      }

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000,
        closeOnClick: true
      })

      throw error
    }

  }, [])

  return fetchDataBackend
}