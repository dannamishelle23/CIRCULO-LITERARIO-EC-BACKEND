import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPerfilUsuario } from "../services/userService";
import { listarObrasPublicasAutor } from "../services/obraService";
import { 
  FaArrowLeft, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaBookOpen, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaGlobe
} from "react-icons/fa";
import { MdCake } from "react-icons/md";
import { SiX } from "react-icons/si";

export default function UserProfilePublic() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [obraModal, setObraModal] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getPerfilUsuario(id);
        console.log(res);
        setUsuario(res.usuario);
        
        // Como el backend ya filtra por estado y autor, simplemente guardamos las obras directamente
        setObras(res.obras || []);

        // Obtener obras aprobadas que devuelve el endpoint y además
        // las obras publicadas por el autor para no ocultar lecturas ya publicadas
        const obrasAutor = res.obras || [];
        try {
          const publicadasRes = await listarObrasPublicasAutor(id);
          const obrasPublicadas = Array.isArray(publicadasRes) ? publicadasRes : (publicadasRes.obras || []);

          // Unir sin duplicados (por _id)
          const mapa = new Map();
          [...obrasAutor, ...obrasPublicadas].forEach(o => mapa.set(o._id, o));
          setObras(Array.from(mapa.values()));
        } catch (errorPublicadas) {
          console.warn("Error cargando obras publicadas:", errorPublicadas);
          // Si falla la llamada adicional, usamos lo que llegó en el perfil
          setObras(obrasAutor);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Función auxiliar para formatear la fecha de cumpleaños de manera amigable
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "No especificada";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans p-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center max-w-sm shadow-2xs space-y-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Perfil no encontrado</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-[#2c3e50] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 transition cursor-pointer"
          >
            Regresar
          </button>
        </div>
      </div>
    );
  }

  const inicial = usuario.nombres ? usuario.nombres.charAt(0).toUpperCase() : "U";
  const tieneRedes = usuario.redes && Object.values(usuario.redes).some(valor => valor);
  const esModerador = usuario?.rol?.toLowerCase() === "moderador";

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* BARRA SUPERIOR */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-3xs cursor-pointer active:scale-98"
          >
            <FaArrowLeft size={11} /> Volver
          </button>
        </div>

        {/* CABECERA PANORÁMICA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden relative">
          <div className="h-40 bg-gradient-to-r from-[#2c3e50] via-[#34495e] to-[#1a252f]" />

          {/* Bloque de Identidad */}
          <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 z-10">
            
            {/* Avatar Rectangular Minimalista */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-amber-50 text-[#e67e22] font-black text-3xl flex items-center justify-center border-4 border-white shadow-3xs shrink-0 overflow-hidden select-none">
              {usuario.avatar ? (
                <img src={usuario.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                inicial
              )}
            </div>

            {/* Datos Principales */}
            <div className="flex-1 min-w-0 space-y-1.5 pt-1">
              {/* username and status moved to left column; header simplified */}
              
              <h1 className="text-xl sm:text-2xl font-black text-[#2c3e50] uppercase tracking-tight truncate">
                {usuario.nombres} {usuario.apellidos}
              </h1>
              
              <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5 lowercase">
                <FaEnvelope className="text-gray-300 shrink-0" size={11} /> {usuario.email}
              </p>
            </div>
          </div>
        </div>

        {/* GRID DE DETALLES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA: INFORMACIÓN Y REDES */}
          <div className="space-y-6">

            {usuario.biografia && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2c3e50] mb-3">
                  Biografía
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {usuario.biografia}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-4">
              
              {/* Info básica */}
              <div className="space-y-3 pb-3 border-b border-gray-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Información del perfil
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                      <FaMapMarkerAlt size={12} className="text-[#e67e22]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Provincia</p>
                      <span className="uppercase text-xs font-black text-[#2c3e50] truncate block">
                        {usuario.provincia || "No especificada"}
                      </span>
                    </div>
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                      <MdCake size={13} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Fecha de Nacimiento</p>
                      <span className="text-xs font-bold text-gray-600 block">
                        {formatearFecha(usuario.fechaNacimiento)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                      <FaCalendarAlt size={11} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Miembro desde</p>
                      <span className="text-xs font-bold text-gray-600 block">
                        {new Date(usuario.createdAt).toLocaleDateString("es-EC", {
                          year: "numeric",
                          month: "long"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redes Sociales Integradas */}
              {tieneRedes && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    Redes Sociales
                  </h3>
                  
                  <div className="flex flex-col gap-1.5">
                    {usuario.redes.instagram && (
                      <a
                        href={usuario.redes.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-pink-50/40 border border-pink-100/50 text-pink-700 text-xs font-bold hover:bg-pink-50 transition"
                      >
                        <FaInstagram size={14} className="shrink-0" /> Instagram
                      </a>
                    )}

                    {usuario.redes.facebook && (
                      <a
                        href={usuario.redes.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-50/40 border border-blue-100/50 text-blue-700 text-xs font-bold hover:bg-blue-50 transition"
                      >
                        <FaFacebook size={14} className="shrink-0" /> Facebook
                      </a>
                    )}

                    {usuario.redes.x && (
                      <a
                        href={usuario.redes.x}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-100 transition"
                      >
                        <SiX size={12} className="shrink-0 mx-0.5" /> X / Twitter
                      </a>
                    )}

                    {usuario.redes.tiktok && (
                      <a
                        href={usuario.redes.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-100 transition"
                      >
                        <FaTiktok size={13} className="shrink-0" /> TikTok
                      </a>
                    )}

                    {usuario.redes.youtube && (
                      <a
                        href={usuario.redes.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-red-50/40 border border-red-100/50 text-red-700 text-xs font-bold hover:bg-red-50 transition"
                      >
                        <FaYoutube size={14} className="shrink-0" /> YouTube
                      </a>
                    )}

                    {usuario.redes.web && (
                      <a
                        href={usuario.redes.web}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/40 border border-emerald-100/50 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition"
                      >
                        <FaGlobe size={13} className="shrink-0" /> Sitio Web
                      </a>
                    )}
                  </div>
                </div>
              )}

            {/* Cuenta pública: username y estado (columna izquierda) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Cuenta pública</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Usuario</p>
                  <p className="text-sm font-black text-[#2c3e50]">@{usuario.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-400 uppercase">Estado</p>
                  <p className="text-sm font-black text-emerald-700">{usuario.estado || 'Activo'}</p>
                </div>
              </div>
            </div>

            </div>
          </div>

          {/* (removed duplicate public info block — biography shown in left column) */}

          {/* COLUMNA DERECHA: PUBLICACIONES */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs min-h-[320px] flex flex-col">

              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">

                <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">
                  {esModerador ? "Actividad en la plataforma" : "Obras Publicadas"}
                </h2>

                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                  {esModerador ? "Moderador" : `${obras.length} publicaciones`}
                </span>

              </div>

              {esModerador ? (

                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3 py-6">

                  <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-400">
                    <FaCheckCircle size={16} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-black text-[#2c3e50] uppercase tracking-wide">Perfil de moderación</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Este usuario forma parte del equipo de moderación de la plataforma.</p>
                  </div>

                </div>

              ) : obras.length === 0 ? (

                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-3 py-6">

                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                    <FaBookOpen size={16} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-black text-[#2c3e50] uppercase tracking-wide">Sin publicaciones actuales</p>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Este autor no ha compartido obras aprobadas todavía.</p>
                  </div>

                </div>

              ) : (

                <div className="grid grid-cols-1 gap-4">
                  {obras.map((obra) => (
                    <button
                      key={obra._id}
                      type="button"
                      onClick={() => setObraModal(obra)}
                      className="group text-left w-full flex gap-4 border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-lg transition items-center"
                    >
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 overflow-hidden bg-gray-100 shadow-sm rounded-md">
                        {obra.portada ? (
                          <img src={obra.portada} alt={obra.titulo} className="w-full h-full object-contain bg-white" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">Sin imagen</div>
                        )}
                        {/* removed overlay/title to show clean square cover */}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-[#2c3e50] tracking-tight truncate mb-1">{obra.titulo}</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3 mb-3">{obra.sinopsis}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400">{obra.fechaPublicacion ? new Date(obra.fechaPublicacion).toLocaleDateString('es-EC') : ''}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

              )}

              {/* Modal para previsualizar obra (solo en perfil público) */}
              {obraModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-4">
                  <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-1 relative h-64 md:h-auto flex items-center justify-center bg-gray-50">
                      {obraModal.portada ? (
                        <img src={obraModal.portada} alt={obraModal.titulo} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">Sin portada</div>
                      )}
                      <button onClick={() => setObraModal(null)} className="absolute top-3 right-3 bg-white/80 text-gray-600 p-2 rounded-full hover:bg-white">Cerrar</button>
                    </div>
                    <div className="md:col-span-2 p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-[#2c3e50]">{obraModal.titulo}</h3>
                          <p className="text-sm text-gray-500 mt-1">{obraModal.autor || `${usuario.nombres} ${usuario.apellidos}`}</p>
                        </div>
                        <div className="text-right">
                          {/* estado and club link removed for public profile preview */}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-xs font-black uppercase text-gray-400 mb-2">Sinopsis</h4>
                          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{obraModal.sinopsis}</div>
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-gray-400 mb-2">Prólogo</h4>
                          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{obraModal.prologo}</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="text-sm text-gray-500 font-medium">Previsualización de la obra.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}