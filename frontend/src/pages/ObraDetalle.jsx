import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MdArrowBack, 
  MdCheckCircle, 
  MdDateRange, 
  MdMenuBook, 
  MdHowToVote,
  MdFavorite,
  MdFavoriteBorder
} from "react-icons/md";
import { obtenerObra, votarObra, likeObra } from "../services/obraService"; // Removidas las funciones que dan 404
import { useAuth } from "../context/AuthContext";

export default function ObraDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [votos, setVotos] = useState(0);
  const [likes, setLikes] = useState(0);
  const [yaVoto, setYaVoto] = useState(false);
  const [yaLeGusta, setYaLeGusta] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarObra();
  }, [id]);

  const cargarObra = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await obtenerObra(id);
      console.log(JSON.stringify(response.obra, null, 2))
      console.log("Respuesta:", response);
      const obraData = response.obra;
      
      setObra(obraData);
      
      // Extrae contadores directamente del modelo de la obra para evitar llamadas 404
      // Si tus propiedades en la base de datos se llaman diferente (ej. obraData.votosUsuarios.length), ajústalo aquí
      setVotos(obraData.votos || 0);
      setLikes(obraData.likes || 0);
      
      // Verificaciones opcionales de interacción si tu backend incluye arreglos de IDs
      if (user && obraData.votosUsuarios?.includes(user._id || user.id)) setYaVoto(true);
      if (user && obraData.likesUsuarios?.includes(user._id || user.id)) setYaLeGusta(true);

    } catch (err) {
      console.error("Error al cargar obra:", err);
      setError("Error al cargar la obra");
    } finally {
      setLoading(false);
    }
  };

  const handleVotar = async () => {
    try {
      await votarObra(id);
      setYaVoto(true);
      setVotos(prev => prev + 1);
      setMensaje("✓ Voto registrado con éxito");
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      const msg = error.response?.data?.msg || "No puedes votar";
      setMensaje("✗ " + msg);
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const handleLike = async () => {
    try {
      await likeObra(id);
      setYaLeGusta(!yaLeGusta);
      setLikes(prev => yaLeGusta ? prev - 1 : prev + 1);
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  if (loading) {
    console.log("OBRA:", obra);
    console.log("AUTOR:", obra.autor);
    console.log("CLUB:", obra.club);
    console.log("CAPITULOS:", obra.capitulos);
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Cargando obra...</p>
        </div>
      </div>
    );
  }

  if (error || !obra) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center font-sans p-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center max-w-sm shadow-2xs space-y-4">
          <p className="text-xs font-black text-red-500 uppercase tracking-widest">{error || "Obra no encontrada"}</p>
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

  const estadoInfo = {
    "Borrador": { color: "bg-gray-50 border-gray-200", textColor: "text-gray-500" },
    "EnRevision": { color: "bg-amber-50 border-amber-200", textColor: "text-amber-700" },
    "Aprobada": { color: "bg-blue-50 border-blue-200", textColor: "text-blue-700" },
    "EnVotacion": { color: "bg-purple-50 border-purple-200", textColor: "text-purple-700" },
    "Publicada": { color: "bg-emerald-50 border-emerald-200", textColor: "text-emerald-700" },
    "Rechazada": { color: "bg-red-50 border-red-200", textColor: "text-red-700" },
    "Ganadora": { color: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-700" }
  };

  const estadoActual = estadoInfo[obra.estado] || estadoInfo["Borrador"];

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* BARRA SUPERIOR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-3xs cursor-pointer active:scale-98 self-start"
          >
            <MdArrowBack size={13} /> Volver
          </button>

          {mensaje && (
            <div className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border ${
              mensaje.startsWith("✓") 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}>
              {mensaje}
            </div>
          )}
        </div>

        {/* GRID DE PORTADA E INFORMACIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* PORTADA EDITORIAL */}
          <div className="md:col-span-1 mx-auto w-full max-w-[260px] md:max-w-none">
            <div className="rounded-2xl overflow-hidden shadow-2xs border border-gray-100 bg-white p-2 aspect-[3/4]">
              <img
                src={obra.portada}
                alt={obra.titulo}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          {/* DATOS PRINCIPALES */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-5">
              
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <span className={`text-[9px] font-black border px-2.5 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1 shadow-3xs ${estadoActual.color} ${estadoActual.textColor}`}>
                  <MdCheckCircle size={10} /> {obra.estado}
                </span>
                <span className="text-[9px] font-black bg-amber-50 border border-amber-100 text-[#e67e22] px-2.5 py-0.5 rounded uppercase tracking-wide">
                  Club: {obra.club?.nombre ?? "-"}
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-[#2c3e50] uppercase tracking-tight leading-tight">
                  {obra.titulo}
                </h1>
                
                <div className="flex items-center gap-2.5 pt-2">
                  {obra.autor?.avatar && (
                    <img
                      src={obra.autor.avatar}
                      alt={obra.autor?.username || ""}
                      className="w-8 h-8 rounded-full border border-gray-100 object-cover shadow-3xs"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[#2c3e50] leading-tight">
                      {obra.autor?.nombres} {obra.autor?.apellidos}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400">@{obra.autor?.username}</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Sinopsis
                </h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {obra.sinopsis}
                </p>
              </div>

              {/* REJILLA DE CONTADORES */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-2.5 text-center shadow-3xs">
                  <span className="block text-lg font-black text-[#e67e22] leading-none">{votos}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1 block">Votos</span>
                </div>
                <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-2.5 text-center shadow-3xs">
                  <span className="block text-lg font-black text-[#e67e22] leading-none">{likes}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1 block">Likes</span>
                </div>
                <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-2.5 text-center shadow-3xs">
                  <span className="block text-lg font-black text-[#e67e22] leading-none">{obra.capitulos?.length || 0}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1 block">Capítulos</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* PRÓLOGO Y CRONOGRAMA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {obra.prologo && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs md:col-span-2 space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#2c3e50]">
                Prólogo
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                "{obra.prologo}"
              </p>
            </div>
          )}

          <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs space-y-3 ${!obra.prologo ? "md:col-span-3" : "md:col-span-1"}`}>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <MdDateRange size={12} className="text-[#e67e22]" /> Cronograma
            </h3>

            <div className="space-y-2.5 text-[11px] font-semibold text-gray-600">
              {obra.fechaPostulacion && (
                <div className="flex justify-between items-center pb-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Postulada</span>
                  <span className="font-bold text-[#2c3e50]">{new Date(obra.fechaPostulacion).toLocaleDateString("es-EC")}</span>
                </div>
              )}
              {obra.fechaAprobacion && (
                <div className="flex justify-between items-center pb-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Aprobada</span>
                  <span className="font-bold text-[#2c3e50]">{new Date(obra.fechaAprobacion).toLocaleDateString("es-EC")}</span>
                </div>
              )}
              {obra.fechaInicioVotacion && (
                <div className="flex justify-between items-center pb-1.5 border-b border-gray-50">
                  <span className="text-gray-400">Votación</span>
                  <span className="font-bold text-[#2c3e50]">{new Date(obra.fechaInicioVotacion).toLocaleDateString("es-EC")}</span>
                </div>
              )}
              {obra.fechaFinVotacion && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cierre</span>
                  <span className="font-bold text-[#2c3e50]">{new Date(obra.fechaFinVotacion).toLocaleDateString("es-EC")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACCIONES DE VOTACIÓN */}
        {obra.estado === "EnVotacion" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs text-center space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#2c3e50] flex items-center justify-center gap-1.5">
                <MdHowToVote size={15} className="text-purple-600" /> Período de Votación Activo
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                Apoya esta obra interactuando y registrando tu voto oficial en el panel inferior.
              </p>
            </div>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                type="button"
                onClick={handleVotar}
                disabled={yaVoto}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#e67e22] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-orange-600 transition shadow-3xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-98"
              >
                👍 {yaVoto ? "Voto Registrado" : "Emitir Voto"}
              </button>

              <button
                type="button"
                onClick={handleLike}
                className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-3xs cursor-pointer active:scale-98 ${
                  yaLeGusta
                    ? "bg-red-50 border border-red-100 text-red-600 hover:bg-red-100"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {yaLeGusta ? <MdFavorite size={14} /> : <MdFavoriteBorder size={14} />}
                {yaLeGusta ? "Te Gusta" : "Me Gusta"}
              </button>
            </div>
          </div>
        )}

        {/* ÍNDICE DE CAPÍTULOS */}
        {obra.capitulos && obra.capitulos.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50] flex items-center gap-1.5">
                <MdMenuBook size={14} className="text-gray-400" /> Índice de Capítulos
              </h2>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                {obra.capitulos.length} entregas
              </span>
            </div>

            <div className="divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/30">
              {obra.capitulos.map((capitulo, index) => (
                <div
                  key={capitulo._id}
                  className="flex items-center gap-4 p-3.5 hover:bg-white transition cursor-pointer select-none active:scale-99 group"
                >
                  <span className="text-xs font-black text-[#e67e22] bg-orange-50 border border-orange-100/50 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-3xs">
                    {capitulo.numeroCapitulo || index + 1}
                  </span>
                  <span className="text-xs font-bold text-gray-700 flex-1 truncate group-hover:text-[#2c3e50]">
                    {capitulo.titulo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}