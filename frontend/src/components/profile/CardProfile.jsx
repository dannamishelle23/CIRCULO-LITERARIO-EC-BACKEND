import { 
  MdPerson, 
  MdEmail, 
  MdLocationCity, 
  MdCake, 
  MdAdminPanelSettings, 
} from "react-icons/md"

export const CardProfile = ({ profile }) => {
  // Obtener la inicial del nombre para un avatar personalizado si no hay imagen
  const inicial = profile?.nombres ? profile.nombres.charAt(0).toUpperCase() : "U"

  // Formatear la fecha de nacimiento de forma más amigable si existe
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "-"
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC" // Evita desfases de días por zonas horarias
    })
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* BANNER SUPERIOR DE DECORACIÓN */}
      <div className="h-24 bg-gradient-to-r from-[#2c3e50] to-[#34495e] relative"></div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="px-6 pb-8 pt-0 flex flex-col items-center relative">
        
        {/* AVATAR INTERACTIVO CON INICIAL */}
        <div className="w-24 h-24 bg-gradient-to-tr from-[#e67e22] to-[#f39c12] rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-black -mt-12 select-none">
          {inicial}
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

        {/* REJILLA DE INFORMACIÓN DETALLADA */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
          
          {/* Nombre de Usuario */}
          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100/50 flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-2xs"><MdPerson size={20} /></div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Nombre de Usuario</span>
              <span className="text-sm font-semibold text-[#2c3e50]">{profile?.username ?? "-"}</span>
            </div>
          </div>

          {/* Correo Electrónico */}
          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100/50 flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-2xs"><MdEmail size={20} /></div>
            <div className="overflow-hidden">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Correo Electrónico</span>
              <span className="text-sm font-semibold text-[#2c3e50] block truncate">{profile?.email ?? "-"}</span>
            </div>
          </div>

          {/* Provincia */}
          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100/50 flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-2xs"><MdLocationCity size={20} /></div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Provincia</span>
              <span className="text-sm font-semibold text-[#2c3e50]">{profile?.provincia ?? "-"}</span>
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100/50 flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-gray-400 shadow-2xs"><MdCake size={20} /></div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Fecha de Nacimiento</span>
              <span className="text-sm font-semibold text-[#2c3e50]">{formatearFecha(profile?.fechaNacimiento)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}