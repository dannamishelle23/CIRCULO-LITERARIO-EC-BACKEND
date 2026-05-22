import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom" 
import { MdArrowBackIosNew } from "react-icons/md" 
import { CardProfile } from "../components/profile/CardProfile"
import { useFetch } from "../hooks/useFetch"
import { API_BASE_URL, getAuthHeaders, getStoredSession, saveSession } from "../utils/auth"

const Profile = () => {
  const navigate = useNavigate()
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

  // Función manejadora para cuando CardProfile actualice la foto exitosamente
  const handleProfileUpdated = (nuevoPerfil) => {
    // 1. Guardamos en el state local de este componente para refrescar la UI
    setProfile(nuevoPerfil)
    // 2. Sincronizamos con el LocalStorage usando tu utilidad
    saveSession(nuevoPerfil)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      
      {/* BOTÓN VOLVER */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)} // Regresa exactamente a la pantalla de donde venía el usuario
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#2c3e50] transition-colors duration-200 cursor-pointer group"
        >
          <MdArrowBackIosNew size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          Volver
        </button>
      </div>

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
        {/* Le inyectamos la función callback onProfileUpdated que espera tu CardProfile interna */}
        <CardProfile 
          profile={profile} 
          onProfileUpdated={handleProfileUpdated} 
        />
      </div>

    </div>
  )
}

export default Profile