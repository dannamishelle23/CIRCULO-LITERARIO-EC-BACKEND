import { useNavigate } from "react-router-dom"
import { logout } from "../services/authService"
import { getStoredSession } from "../utils/auth"
import { 
  MdPerson, 
  MdSettings, 
  MdLogout, 
  MdArrowBack, 
  MdChevronRight 
} from "react-icons/md"

export default function Menu() {
  const navigate = useNavigate()
  const usuario = getStoredSession()

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* ENCABEZADO DE LA VISTA */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-xs border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-black bg-[#e67e22] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
              Opciones
            </span>
            <h1 className="mt-2 text-2xl font-black text-[#2c3e50] uppercase tracking-tight">
              Ajustes de <span className="text-[#e67e22]">Cuenta</span>
            </h1>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              Administra tus datos, la seguridad o finaliza tu sesión en el club.
            </p>
          </div>
          
          {/* BOTÓN VOLVER ESTILIZADO */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition cursor-pointer shadow-2xs"
          >
            <MdArrowBack size={16} /> Volver
          </button>
        </div>

        {/* LISTA DE ACCIONES INTUITIVAS */}
        <div className="space-y-4">
          
          {/* OPCIÓN 1: MI PERFIL (CON FOTO DINÁMICA) */}
          <button
            type="button"
            onClick={() => navigate("/perfil")}
            className="group w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-xs hover:border-orange-200/60 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Contenedor de la imagen o avatar por defecto */}
              <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-200 flex items-center justify-center bg-orange-50 text-[#e67e22]">
                {usuario?.foto ? (
                  <img 
                    src={usuario.foto} 
                    alt={`Avatar de ${usuario?.nombres || 'Usuario'}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MdPerson size={24} />
                )}
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Mi Perfil</span>
                <span className="block text-base font-bold text-[#2c3e50] mt-0.5">Ver datos personales</span>
                <span className="block text-xs text-gray-500 font-medium capitalize mt-0.5">
                  {usuario?.nombres} {usuario?.apellidos}
                </span>
              </div>
            </div>
            <MdChevronRight size={22} className="text-gray-300 group-hover:text-[#e67e22] group-hover:translate-x-1 transition-all" />
          </button>

          {/* OPCIÓN 2: CONFIGURACIÓN */}
          <button
            type="button"
            onClick={() => navigate("/configuracion")}
            className="group w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 bg-slate-50 text-[#2c3e50] rounded-xl group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                <MdSettings size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Seguridad</span>
                <span className="block text-base font-bold text-[#2c3e50] mt-0.5">Actualizar credenciales</span>
                <span className="block text-xs text-gray-500 font-medium mt-0.5">Cambia tu contraseña o información clave.</span>
              </div>
            </div>
            <MdChevronRight size={22} className="text-gray-300 group-hover:text-[#2c3e50] group-hover:translate-x-1 transition-all" />
          </button>

          {/* OPCIÓN 3: CERRAR SESIÓN */}
          <button
            type="button"
            onClick={() => {
              logout()
              navigate("/login")
            }}
            className="group w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:shadow-xs hover:bg-red-50/20 hover:border-red-100 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 shrink-0 bg-red-50 text-red-600 rounded-xl group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                <MdLogout size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-red-400">Sesión</span>
                <span className="block text-base font-bold text-red-600 mt-0.5">Salir de la cuenta</span>
                <span className="block text-xs text-gray-500 font-medium mt-0.5">Desconéctate de forma segura del sistema.</span>
              </div>
            </div>
            <MdChevronRight size={22} className="text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
          </button>

        </div>

      </div>
    </section>
  )
}