import { useEffect, useState } from "react"
import { CardProfile } from "../components/profile/CardProfile"
import { useFetch } from "../hooks/useFetch"
import { API_BASE_URL, getAuthHeaders, getStoredSession } from "../utils/auth"

const Profile = () => {
  const fetchDataBackend = useFetch()
  const [profile, setProfile] = useState(() => getStoredSession())

  useEffect(() => {
    const loadProfile = async () => {
      const url = `${API_BASE_URL}/usuarios/perfil`
      const response = await fetchDataBackend(url, null, "GET", getAuthHeaders())
      if (response) {
        setProfile((currentProfile) => ({
          ...currentProfile,
          ...response
        }))
      }
    }

    loadProfile()
  }, [fetchDataBackend])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      
      {/* TÍTULO SECCIÓN */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="font-black text-3xl text-[#2c3e50] uppercase tracking-tight">
          Mi <span className="text-[#e67e22]">Perfil</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Gestiona y visualiza la información de tu cuenta en el club.
        </p>
      </div>

      {/* CONTENEDOR DE LA TARJETA */}
      <div className="w-full max-w-2xl mx-auto">
        <CardProfile profile={profile} />
      </div>

    </div>
  )
}

export default Profile