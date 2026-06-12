import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaBookOpen, 
  FaUser, 
  FaBookmark, 
  FaCheckCircle, 
  FaClock, 
  FaThumbsUp,
  FaVoteYea,
  FaRegListAlt
} from "react-icons/fa";
import { obtenerObra, votarObra } from "../services/obraService";
import { useAuth } from "../context/AuthContext";

export default function ObraDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [votos, setVotos] = useState(0);
  const [yaVoto, setYaVoto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success"); // "success" o "error"

  const cargarObra = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await obtenerObra(id);
      const obraData = response.obra;
      setObra(obraData);

      // Seteamos el número total de votos acumulados
      setVotos(obraData.votos?.length || 0);

      // RECONOCIMIENTO DINÁMICO DE VOTO: 
      // Si el backend envía el array de IDs de usuarios, validamos si el usuario actual ya está ahí.
      if (user && obraData.votos) {
        const usuarioHaVotado = obraData.votos.some(v => (v._id || v) === user._id);
        setYaVoto(usuarioHaVotado);
      } else {
        setYaVoto(false);
      }

    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la información de la obra.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) cargarObra();
  }, [id, user]);

  const handleVotar = async () => {
    try {
      const res = await votarObra(id);

      setVotos(res.votos);
      setYaVoto(!yaVoto);

      setTipoMensaje("success");
      setMensaje(res.msg || "¡Tu voto ha sido procesado!");
      setTimeout(() => setMensaje(""), 4000);

    } catch (error) {
      const msg = error.response?.data?.msg || "No tienes autorización para votar en esta obra";
      setTipoMensaje("error");
      setMensaje(msg);
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  const renderEstadoBadge = (estado) => {
    switch (estado) {
      case "Aprobada":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
            <FaCheckCircle size={9} /> Aprobada
          </span>
        );
      case "EnRevision":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
            <FaClock size={9} /> En Revisión
          </span>
        );
      case "EnVotacion":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
            <FaThumbsUp size={9} /> En Votación
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-200">
            {estado}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-4 border-gray-200 border-t-[#e67e22] rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#2c3e50]">Abriendo manuscrito...</p>
        </div>
      </div>
    );
  }

  if (error || !obra) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans p-4">
        <div className="text-center space-y-4 max-w-sm bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">
            {error || "La obra solicitada no se encuentra disponible."}
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:text-[#e67e22] transition active:scale-98 cursor-pointer"
          >
            <FaArrowLeft size={10} /> Volver Atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* BANNER FLOTANTE DE NOTIFICACIONES */}
        {mensaje && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-black uppercase tracking-wide transition-all duration-300 animate-slide-in ${
            tipoMensaje === "success" 
              ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
              : "bg-red-50 text-red-800 border-red-100"
          }`}>
            {tipoMensaje === "success" ? "✓ " : "✗ "} {mensaje}
          </div>
        )}

        {/* BOTÓN DE RETORNO */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:text-[#e67e22] hover:border-orange-100 transition shadow-3xs cursor-pointer active:scale-98 group"
          >
            <FaArrowLeft size={10} className="transition-transform duration-200 group-hover:-translate-x-0.5" /> Volver
          </button>
        </div>

        {/* CONTENEDOR DE IDENTIDAD Y PORTADA */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
            
            {/* Portada Miniatura */}
            <div className="w-28 sm:w-32 aspect-[3/4] bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center mx-auto sm:mx-0 select-none">
              {obra.portada ? (
                <img src={obra.portada} alt={`Portada de ${obra.titulo}`} className="w-full h-full object-cover" />
              ) : (
                <FaBookOpen size={24} className="text-gray-300" />
              )}
            </div>

            {/* Información Principal */}
            <div className="flex-1 text-center sm:text-left space-y-3 min-w-0">
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {renderEstadoBadge(obra.estado)}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#2c3e50] uppercase tracking-tight break-words leading-tight">
                {obra.titulo}
              </h1>

              {/* Identidad del Autor con Avatar Integrado */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-left max-w-full">
                <div className="w-6 h-6 rounded-md bg-white text-[#2c3e50] font-black text-[10px] flex items-center justify-center border border-gray-200 shrink-0 overflow-hidden select-none">
                  {obra.autor?.avatar ? (
                    <img src={obra.autor.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser size={10} className="text-gray-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[#2c3e50] leading-none truncate">
                    {obra.autor?.nombres} {obra.autor?.apellidos}
                  </p>
                  <p className="text-[9px] font-bold text-[#e67e22] tracking-wide mt-0.5 leading-none">
                    @{obra.autor?.username || "escritor"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CUERPO CENTRAL DE INFORMACIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA (SINOPSIS Y CONTENIDO) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* SINOPSIS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 pb-2 border-b border-gray-50">
                <FaBookmark size={10} className="text-[#e67e22]" /> Sinopsis de la Obra
              </h4>
              <p className="text-xs font-medium text-gray-600 leading-relaxed whitespace-pre-line">
                {obra.sinopsis || "Esta obra no cuenta con una sinopsis registrada."}
              </p>
            </div>

            {/* ÍNDICE DE CAPÍTULOS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5 pb-2 border-b border-gray-50">
                <FaRegListAlt size={11} className="text-blue-500" /> Capítulos Anexados ({obra.capitulos?.length || 0})
              </h4>
              
              {obra.capitulos?.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {obra.capitulos.map((cap, index) => (
                    <div key={cap._id || index} className="py-2.5 flex items-center justify-between text-xs font-bold text-[#2c3e50] hover:text-[#e67e22] transition">
                      <span className="truncate">
                        <span className="text-gray-400 font-mono mr-2">{String(index + 1).padStart(2, '0')}.</span>
                        {cap.titulo}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-bold text-gray-300 italic py-2 uppercase tracking-wide text-center">
                  Borrador sin capítulos estructurados
                </p>
              )}
            </div>

          </div>

          {/* COLUMNA DERECHA (SISTEMA E INTERFAZ DE VOTACIÓN) */}
          <div className="space-y-6">
            
            {/* PANEL DE MÉTRICAS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs text-center space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-50 text-left">
                Métricas del Lector
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50/50 border border-blue-100/60 rounded-xl p-3">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Votos</p>
                  <p className="text-xl font-black text-blue-700 mt-1">{votos}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Likes</p>
                  <p className="text-xl font-black text-gray-300 mt-1">0</p>
                </div>
              </div>

              {/* BOTÓN INTERACTIVO DE VOTACIÓN */}
              {obra.estado === "EnVotacion" ? (
                <button
                  onClick={handleVutar || handleVotar}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition cursor-pointer active:scale-95 shadow-3xs ${
                    yaVoto 
                      ? "bg-red-50 border border-red-100 text-red-600 hover:bg-red-100" 
                      : "bg-[#e67e22] text-white hover:bg-[#d35400]"
                  }`}
                >
                  <FaVoteYea size={12} />
                  {yaVoto ? "Retirar mi Voto" : "Dar mi Voto"}
                </button>
              ) : (
                <div className="bg-gray-50/60 border border-dashed border-gray-200 rounded-xl p-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Votación no disponible en este estado
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}