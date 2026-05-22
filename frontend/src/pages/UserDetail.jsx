import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getModeratorById, getUserById } from "../services/userService";
import { 
  MdArrowBack, 
  MdMail, 
  MdPerson, 
  MdLocationCity, 
  MdAdminPanelSettings,
  MdCheckCircle,
  MdErrorOutline
} from "react-icons/md";

export default function UserDetail() {
  const { id, tipo } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      let data;
      if (tipo === "moderador") {
        data = await getModeratorById(id);
      } else {
        data = await getUserById(id);
      }
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id, tipo]);

  // Pantalla de carga interactiva
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center gap-3">
        <div className="w-10 h-10 border-4 border-t-[#e67e22] border-gray-200 rounded-full animate-spin"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Cargando información...</p>
      </div>
    );
  }

  // Lógica para inicial si no tiene foto cargada
  const inicial = user.nombres ? user.nombres.charAt(0).toUpperCase() : "U";
  const esActivo = user.estadoUsuario?.toLowerCase() === "activo";

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* ENCABEZADO CON BOTÓN DE REGRESO */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-2xs cursor-pointer"
          >
            <MdArrowBack size={16} /> Volver
          </button>
          
          <span className="text-[10px] font-black bg-[#2c3e50] text-white px-2.5 py-1 rounded-md uppercase tracking-widest">
            Ficha de {tipo ?? "Usuario"}
          </span>
        </div>

        {/* TARJETA PRINCIPAL DEL PERFIL */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
          
          {/* Banner de fondo decorativo */}
          <div className="h-32 bg-gradient-to-r from-[#2c3e50] to-[#34495e]"></div>

          {/* Bloque de Identidad (Foto y Nombre Completo) */}
          <div className="px-6 pb-6 text-center sm:text-left sm:flex sm:items-end sm:gap-6 -mt-16 mb-6">
            
            {/* Control dinámico de la foto de perfil */}
            {user.foto || user.avatar ? (
              <img 
                src={user.foto || user.avatar} 
                alt={`Foto de ${user.nombres}`} 
                className="w-28 h-28 object-cover rounded-2xl border-4 border-white shadow-md mx-auto sm:mx-0 bg-white"
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-tr from-[#e67e22] to-[#f39c12] text-white text-4xl font-black rounded-2xl border-4 border-white shadow-md flex items-center justify-center mx-auto sm:mx-0 select-none">
                {inicial}
              </div>
            )}

            <div className="mt-4 sm:mt-0 flex-1">
              <h2 className="text-2xl font-black text-[#2c3e50] capitalize leading-tight">
                {user.nombres} {user.apellidos}
              </h2>
              <p className="text-sm font-medium text-gray-400 mt-1">@{user.username}</p>
            </div>

            {/* BADGE DINÁMICO DE ESTADO */}
            <div className="mt-4 sm:mt-0 flex justify-center">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                esActivo 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}>
                {esActivo ? <MdCheckCircle size={14} /> : <MdErrorOutline size={14} />}
                {user.estadoUsuario ?? "Inactivo"}
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mx-6" />

          {/* GRILLA DE DATOS DETALLADOS */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Correo Electrónico */}
            <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-100/50 flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg text-gray-400 shadow-2xs"><MdMail size={20} /></div>
              <div className="overflow-hidden">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Correo Electrónico</span>
                <span className="text-sm font-semibold text-[#2c3e50] block truncate">{user.email}</span>
              </div>
            </div>

            {/* Provincia / Ubicación */}
            <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-100/50 flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg text-gray-400 shadow-2xs"><MdLocationCity size={20} /></div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Provincia</span>
                <span className="text-sm font-semibold text-[#2c3e50]">{user.provincia ?? "-"}</span>
              </div>
            </div>

            {/* Rol en la Plataforma */}
            <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-100/50 flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg text-gray-400 shadow-2xs"><MdAdminPanelSettings size={20} /></div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Rol Asignado</span>
                <span className="text-sm font-semibold text-[#2c3e50] capitalize">{user.rol}</span>
              </div>
            </div>

            {/* Nombre de Identificador único */}
            <div className="bg-gray-50/60 p-4 rounded-xl border border-gray-100/50 flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg text-gray-400 shadow-2xs"><MdPerson size={20} /></div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Nombre de Usuario</span>
                <span className="text-sm font-semibold text-[#2c3e50]">{user.username}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}