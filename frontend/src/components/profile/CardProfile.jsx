import { useRef, useState } from "react"
import { 
  MdPerson, 
  MdEmail, 
  MdLocationCity, 
  MdCake, 
  MdAdminPanelSettings, 
  MdCameraAlt
} from "react-icons/md"
import { API_BASE_URL, getAuthHeaders } from "../../utils/auth" // Asegúrate de que la ruta sea correcta

export const CardProfile = ({ profile, onProfileUpdated }) => {
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)

  const inicial = profile?.nombres ? profile.nombres.charAt(0).toUpperCase() : "U"

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-"
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    })
  }

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    //Asegurar que capture el ID correcto 
    const userId = profile?._id || profile?.id

    if (!userId) {
      alert("Error: No se detectó el ID del usuario.")
      return
    }

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido.")
      return
    }

    try {
      setIsUploading(true)

      // 1. Preparamos el FormData requerido por el backend (req.files.avatar)
      const formData = new FormData()
      formData.append("avatar", file)
      // 2. Adjuntamos los datos actuales del perfil para pasar las validaciones del backend
      formData.append("nombres", profile?.nombres || "")
      formData.append("apellidos", profile?.apellidos || "")
      formData.append("username", profile?.username || "")
      formData.append("email", profile?.email || "")
      formData.append("provincia", profile?.provincia || "")

      // 3. Ejecutamos la petición directamente usando fetch nativo para evitar conflictos con JSON planos
      const url = `${API_BASE_URL}/usuarios/actualizar-perfil/${userId}`
      const authHeaders = getAuthHeaders() // Usualmente trae { 'Authorization': 'Bearer ...' }
      
      //Cambiar el método de PUT a PATCH
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          ...authHeaders
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        alert("Foto de perfil actualizada con éxito")
        if (onProfileUpdated) {
          onProfileUpdated(data.usuario)         //Refrescar los datos en la UI de inmediato
        }
      } else {
        alert(data.msg || "Hubo un error al subir la imagen.")
      }

    } catch (error) {
      console.error("Error al actualizar la foto de perfil:", error)
      alert("Error de conexión con el servidor.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md font-sans w-full max-w-md mx-auto">
      
      {/* BANNER SUPERIOR */}
      <div className="h-24 bg-gradient-to-r from-[#2c3e50] to-[#34495e] relative"></div>

      <div className="px-6 pb-8 pt-0 flex flex-col items-center relative">
        
        {/* INPUT FILE OCULTO */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
        />

        {/* AVATAR INTERACTIVO CON CARGA AUTOMÁTICA */}
        <div 
          onClick={handleAvatarClick}
          className="group w-24 h-24 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-black -mt-12 select-none relative overflow-hidden cursor-pointer bg-white"
        >
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#e67e22] to-[#f39c12] flex items-center justify-center">
              {inicial}
            </div>
          )}

          {/* CAPA HOVER PARA EDITAR (Desaparece si está cargando) */}
          {!isUploading && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
              <MdCameraAlt size={18} className="text-white" />
              <span className="text-[9px] font-black uppercase tracking-wider text-white mt-1">Cambiar</span>
            </div>
          )}

          {/* SPINNER DE LOADING EN TIEMPO REAL */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#e67e22] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* NOMBRE E INSIGNIA DE ROL */}
        <h2 className="mt-4 text-xl font-black text-[#2c3e50] text-center capitalize">
          {profile?.nombres} {profile?.apellidos}
        </h2>
        
        <div className="mt-1.5 flex items-center gap-1 bg-amber-50 border border-amber-100 text-[#e67e22] px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <MdAdminPanelSettings size={14} />
          {profile?.rol ?? "Lector"}
        </div>

        <hr className="w-full my-6 border-gray-100" />

        {/* REJILLA DE INFORMACIÓN (SOLO LECTURA) */}
        <div className="w-full space-y-3.5 text-left">
          <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-100/50 flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-3xs"><MdPerson size={18} /></div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Nombre de Usuario</span>
              <span className="text-xs font-semibold text-[#2c3e50]">{profile?.username ?? "-"}</span>
            </div>
          </div>

          <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-100/50 flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-3xs"><MdEmail size={18} /></div>
            <div className="overflow-hidden">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Correo Electrónico</span>
              <span className="text-xs font-semibold text-[#2c3e50] block truncate">{profile?.email ?? "-"}</span>
            </div>
          </div>

          <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-100/50 flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-3xs"><MdLocationCity size={18} /></div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Provincia</span>
              <span className="text-xs font-semibold text-[#2c3e50]">{profile?.provincia ?? "-"}</span>
            </div>
          </div>

          <div className="bg-gray-50/60 p-3 rounded-xl border border-gray-100/50 flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-3xs"><MdCake size={18} /></div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Fecha de Nacimiento</span>
              <span className="text-xs font-semibold text-[#2c3e50]">{formatearFecha(profile?.fechaNacimiento)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}