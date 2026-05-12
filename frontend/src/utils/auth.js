export const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`

const STORAGE_KEY = "circuloLiterarioAuth"

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
  const session = getStoredSession()
  if (!session?.token) return {}

  return {
    Authorization: `Bearer ${session.token}`
  }
}
