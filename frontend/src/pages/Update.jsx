import { useState } from "react"
import FormularioPerfil from "../components/profile/FormProfile"
import CardPassword from "../components/profile/CardPassword"
import { getStoredSession } from "../utils/auth"

const Update = () => {
  const [profile, setProfile] = useState(() => getStoredSession())

  const handleProfileUpdated = (updatedProfile) => {
    setProfile(updatedProfile)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
      
      {/* ENCABEZADO */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="font-black text-3xl text-[#2c3e50] uppercase tracking-tight">
          Configuración <span className="text-[#e67e22]">de Cuenta</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">
          Actualiza tus datos personales o gestiona la seguridad de tus credenciales de acceso.
        </p>
      </div>

      {/* CONTENEDOR GRID DE LAS DOS TARJETA CONFIGURABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* COLUMNA 1: FORMULARIO DE PERFIL */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
          <FormularioPerfil profile={profile} onProfileUpdated={handleProfileUpdated} />
        </div>

        {/* COLUMNA 2: FORMULARIO DE CONTRASEÑA */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
          <CardPassword />
        </div>

      </div>
    </div>
  )
}

export default Update