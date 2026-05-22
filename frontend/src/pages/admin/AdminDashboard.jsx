import { useNavigate } from "react-router-dom";
import { FaUsersCog, FaBookOpen, FaChevronRight } from "react-icons/fa";
import PanelMenu from "../../components/PanelMenu";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* MENÚ DE NAVEGACIÓN COMPONENTE */}
        <PanelMenu />

        {/* HEADER DE BIENVENIDA */}
        <div className="bg-white rounded-3xl shadow-2xs border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 text-[#e67e22] p-4 rounded-2xl border border-amber-100/40 shrink-0">
              <FaUsersCog size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black bg-[#e67e22] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Control Global
              </span>
              <h1 className="text-2xl font-black text-[#2c3e50] uppercase tracking-tight mt-0.5">
                Panel <span className="text-[#e67e22]">Administrativo</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Gestiona usuarios, moderadores y la arquitectura de tus clubes literarios.
              </p>
            </div>
          </div>
        </div>

        {/* CONTENEDOR DE TARJETAS DE ACCIÓN / OPCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* TARJETA: GESTIÓN DE USUARIOS */}
          <button
            type="button"
            onClick={() => navigate("/admin/usuarios")}
            className="group bg-white rounded-3xl border border-gray-100 p-6 text-left shadow-2xs hover:shadow-xs hover:border-amber-200 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div>
              <div className="bg-amber-50 text-[#e67e22] w-12 h-12 rounded-xl flex items-center justify-center border border-amber-100/30 mb-5 group-hover:bg-[#e67e22] group-hover:text-white transition-all duration-300">
                <FaUsersCog size={22} />
              </div>
              
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Comunidad & Permisos
              </span>
              <h2 className="text-lg font-black text-[#2c3e50] uppercase tracking-tight">
                Gestión de <span className="text-[#e67e22]">Usuarios</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1.5 leading-relaxed max-w-sm">
                Administra las cuentas de lectores, autores y el alta de nuevos moderadores del sistema.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 w-full text-xs font-bold text-[#2c3e50] uppercase tracking-wider group-hover:text-[#e67e22] transition-colors">
              <span>Configurar Cuentas</span>
              <FaChevronRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* TARJETA: GESTIÓN DE CLUBES */}
          <button
            type="button"
            onClick={() => navigate("/admin/clubes")}
            className="group bg-white rounded-3xl border border-gray-100 p-6 text-left shadow-2xs hover:shadow-xs hover:border-amber-200 transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div>
              <div className="bg-amber-50 text-[#e67e22] w-12 h-12 rounded-xl flex items-center justify-center border border-amber-100/30 mb-5 group-hover:bg-[#e67e22] group-hover:text-white transition-all duration-300">
                <FaBookOpen size={20} />
              </div>
              
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Espacios Literarios
              </span>
              <h2 className="text-lg font-black text-[#2c3e50] uppercase tracking-tight">
                Gestión de <span className="text-[#e67e22]">Clubes</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1.5 leading-relaxed max-w-sm">
                Crea nuevas salas de lectura, define géneros literarios y asigna moderadores responsables.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 w-full text-xs font-bold text-[#2c3e50] uppercase tracking-wider group-hover:text-[#e67e22] transition-colors">
              <span>Organizar Espacios</span>
              <FaChevronRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

      </div>
    </section>
  );
}