export const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`

const STORAGE_KEY = "usuario"

export const getStoredSession = () => {
  try {
    const rawSession = localStorage.getItem(STORAGE_KEY)
    return rawSession ? JSON.parse(rawSession) : null
  } catch (error) {
    console.error("No se pudo leer la sesion almacenada.", error)
    return null
  }
}

export const saveSession = (session) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  if (!token) return {}

  return {
    Authorization: `Bearer ${token}`
  }
}
