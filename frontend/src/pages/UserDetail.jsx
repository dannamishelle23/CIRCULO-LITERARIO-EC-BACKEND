import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getModeratorById, getUserById } from "../services/userService";
import { listarObrasPublicasAutor } from "../services/obraService";
import { 
  MdArrowBack, 
  MdMail, 
  MdLocationCity, 
  MdAdminPanelSettings,
  MdCheckCircle,
  MdErrorOutline,
  MdCake,
  MdCalendarMonth
} from "react-icons/md";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function UserDetail() {
  const { id, tipo } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [obras, setObras] = useState([]);
  const [obraModal, setObraModal] = useState(null);

  const fetchUser = async () => {
    try {
      let data;
      if (tipo === "moderador") {
        data = await getModeratorById(id);
      } else {
        data = await getUserById(id);
      }
      setUser(data);
      // Cargar obras públicas/aprobadas del usuario para mostrar en detalle
      try {
        const resp = await listarObrasPublicasAutor(id);
        setObras(resp.obras || []);
      } catch (err) {
        setObras([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id, tipo]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center gap-3 font-sans">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#e67e22] rounded-full animate-spin"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Cargando información...</p>
      </div>
    );
  }

  const inicial = user.nombres ? user.nombres.charAt(0).toUpperCase() : "U";
  const esActivo = user.estadoUsuario?.toLowerCase() === "activo";

  // Formatear fechas evitando el desfase por zonas horarias (UTC)
  const formatearFecha = (fechaPin) => {
    if (!fechaPin) return "No específica";
    
    // Extrae solo la parte de la fecha YYYY-MM-DD ignorando la hora e ISO offsets
    const fechaLimpia = fechaPin.split("T")[0];
    const [anio, mes, dia] = fechaLimpia.split("-");
    
    // Crea el objeto en base a componentes UTC puros
    const fechaUTC = new Date(Date.UTC(anio, mes - 1, dia));
    
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return fechaUTC.toLocaleDateString('es-ES', opciones);
  };

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-3xs cursor-pointer active:scale-98"
          >
            <MdArrowBack size={14} /> Volver
          </button>
          
          <span className="text-[9px] font-black bg-[#2c3e50] text-white px-2.5 py-1 rounded border border-transparent uppercase tracking-widest shadow-3xs">
            Ficha de {tipo ?? "Usuario"}
          </span>
        </div>

        {/* TARJETA PRINCIPAL */}
        <div className="bg-white border border-gray-100 shadow-2xs rounded-3xl overflow-hidden">
          
          {/* Banner de fondo de corte editorial */}
          <div className="h-36 bg-gradient-to-r from-[#2c3e50] to-[#34495e]"></div>

          {/* Bloque de Identidad */}
          <div className="px-6 pb-6">
            
            {/* Contenedor del Avatar (Único elemento con margen negativo sobre el banner) */}
            <div className="relative -mt-16 mb-4 flex justify-center sm:justify-start z-10">
              {user.foto || user.avatar ? (
                <img 
                  src={user.foto || user.avatar} 
                  alt={`Foto de ${user.nombres}`} 
                  className="w-28 h-28 object-cover rounded-2xl border-4 border-white shadow-2xs bg-white"
                />
              ) : (
                <div className="w-28 h-28 bg-gradient-to-tr from-[#e67e22] to-[#f39c12] text-white text-4xl font-black rounded-2xl border-4 border-white shadow-2xs flex items-center justify-center select-none">
                  {inicial}
                </div>
              )}
            </div>

            {/* Datos Principales y Estado */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 text-center sm:text-left">
              <div className="min-w-0 space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#2c3e50] tracking-tight uppercase break-words">
                  {user.nombres} {user.apellidos}
                </h2>
                <p className="text-xs font-semibold text-gray-400 tracking-wide">@{user.username}</p>
              </div>

              {/* BADGES DE ESTADO Y ANTIGÜEDAD */}
              <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-3xs ${
                  esActivo 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                    : "bg-gray-50 border-gray-200 text-gray-500"
                }`}>
                  {esActivo ? <MdCheckCircle size={12} /> : <MdErrorOutline size={12} />}
                  {user.estadoUsuario ?? "Inactivo"}
                </span>

                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                  <MdCalendarMonth size={11} /> Miembro desde: {user.createdAt ? new Date(user.createdAt).getFullYear() : "2026"}
                </span>
              </div>
            </div>

            {/* SECCIÓN DE BIOGRAFÍA */}
            <div className="mt-6 pt-5 border-t border-gray-50 text-center sm:text-left">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Biografía</h4>
              <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-2xl">
                {user.biografia || "Este usuario aún no ha redactado una biografía para su perfil de la plataforma."}
              </p>
            </div>

            {/* REDES SOCIALES */}
            <div className="mt-5 pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Redes de contacto</h4>
              <div className="flex items-center gap-3">
                {user.redes?.instagram ? (
                  <a href={`https://instagram.com/${user.redes.instagram}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 border border-gray-100 text-gray-400 hover:text-pink-600 rounded-xl transition shadow-3xs">
                    <FaInstagram size={15} />
                  </a>
                ) : null}
                {user.redes?.twitter ? (
                  <a href={`https://twitter.com/${user.redes.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 border border-gray-100 text-gray-400 hover:text-sky-500 rounded-xl transition shadow-3xs">
                    <FaTwitter size={15} />
                  </a>
                ) : null}
                {user.redes?.facebook ? (
                  <a href={`https://facebook.com/${user.redes.facebook}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 rounded-xl transition shadow-3xs">
                    <FaFacebook size={15} />
                  </a>
                ) : null}
                {!user.redes?.instagram && !user.redes?.twitter && !user.redes?.facebook && (
                  <span className="text-[10px] font-bold text-gray-300 italic">No vinculadas</span>
                )}
              </div>
            </div>

          </div>

          {/* SECCIÓN: Obras del usuario (aprobadas / publicadas) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#2c3e50] mb-4">Obras del usuario</h4>
            {obras.length === 0 ? (
              <p className="text-xs text-gray-400">No hay obras aprobadas o publicadas.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {obras.map(o => (
                  <button key={o._id} onClick={() => setObraModal(o)} className="text-left w-full flex gap-4 items-center p-3 border rounded-xl hover:shadow-sm transition">
                    <div className="w-16 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {o.portada ? <img src={o.portada} alt={o.titulo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300">No imagen</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[#2c3e50] truncate">{o.titulo}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{o.sinopsis}</p>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase">{o.estado}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {obraModal && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/60 p-4">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-black text-[#2c3e50]">{obraModal.titulo}</h3>
                  <button onClick={() => setObraModal(null)} className="text-gray-400 hover:text-red-500">Cerrar</button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-36 h-48 bg-gray-100 rounded overflow-hidden">
                      {obraModal.portada ? <img src={obraModal.portada} alt="portada" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300">Sin portada</div>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">{obraModal.sinopsis}</p>
                      <p className="text-xs text-gray-400">Estado: {obraModal.estado}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase mb-2">Prólogo</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{obraModal.prologo}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GRILLA DE DATOS DETALLADOS */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/30 border-t border-gray-50">
            
            {/* Correo Electrónico */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs flex items-center space-x-3.5">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 border border-gray-100/40 shrink-0">
                <MdMail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Correo Electrónico</span>
                <span className="text-xs font-bold text-[#2c3e50] block truncate mt-0.5">{user.email}</span>
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs flex items-center space-x-3.5">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 border border-gray-100/40 shrink-0">
                <MdCake size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Fecha de Nacimiento</span>
                <span className="text-xs font-bold text-[#2c3e50] block truncate mt-0.5">
                  {formatearFecha(user.fechaNacimiento)}
                </span>
              </div>
            </div>

            {/* Provincia / Ubicación */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs flex items-center space-x-3.5">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 border border-gray-100/40 shrink-0">
                <MdLocationCity size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Provincia</span>
                <span className="text-xs font-bold text-[#2c3e50] block truncate mt-0.5">{user.provincia ?? "No especificada"}</span>
              </div>
            </div>

            {/* Rol en la Plataforma */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-3xs flex items-center space-x-3.5">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400 border border-gray-100/40 shrink-0">
                <MdAdminPanelSettings size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Rol Asignado</span>
                <span className="text-xs font-bold block truncate mt-0.5 uppercase tracking-wide text-[#e67e22]">
                  {user.rol}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}