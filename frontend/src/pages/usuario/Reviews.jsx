import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  MdArrowBack, 
  MdSend, 
  MdDelete, 
  MdEdit, 
  MdClose, 
  MdChatBubbleOutline 
} from "react-icons/md";
import { 
  getComentariosByObra, 
  createComentario, 
  editComentario, 
  deleteComentario 
} from "../services/comentarioService"; 

export default function Reviews() {
  const { obraId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [comentarios, setComentarios] = useState([]);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [cargando, setCargando] = useState(false);
  
  // Obtenemos la fecha de publicación pasada por navigate en la pantalla anterior
  const fechaPublicacion = location.state?.fechaPublicacion;

  // Validar si pasaron las 2 semanas (14 días)
  const isExpired = () => {
    if (!fechaPublicacion) return true;
    const limite = new Date(fechaPublicacion);
    limite.setDate(limite.getDate() + 14);
    return new Date() > limite;
  };

  const cargarComentarios = async () => {
    try {
      const data = await getComentariosByObra(obraId);
      setComentarios(data);
    } catch (error) {
      toast.error("Error al cargar los comentarios del foro.");
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, [obraId]);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;
    if (isExpired()) {
      toast.error("El periodo de debate/foro para esta lectura ha finalizado.");
      return;
    }

    try {
      setCargando(true);
      await createComentario({ obra: obraId, texto: nuevoTexto });
      setNuevoTexto("");
      toast.success("Comentario publicado.");
      await cargarComentarios();
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al publicar comentario.";
      toast.error(msg);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (isExpired()) {
      toast.error("El periodo de debate ha finalizado. Ya no se pueden eliminar comentarios.");
      return;
    }
    if (!window.confirm("¿Estás seguro de eliminar este comentario?")) return;

    try {
      await deleteComentario(id);
      toast.success("Comentario eliminado.");
      setComentarios(comentarios.filter(c => c._id !== id));
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al eliminar.";
      toast.error(msg);
    }
  };

  const handleEditar = async (id) => {
    if (isExpired()) {
      toast.error("El periodo de debate ha finalizado. Ya no se pueden editar comentarios.");
      return;
    }
    if (!editText.trim()) return;

    try {
      const res = await editComentario(id, { texto: editText });
      toast.success(res.msg);
      setEditingId(null);
      await cargarComentarios();
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al editar.";
      toast.error(msg);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-black text-gray-700 uppercase bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition"
        >
          <MdArrowBack size={16} /> Volver
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-2">
          <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
            <MdChatBubbleOutline className="text-amber-500" /> Foro de Debate de la Lectura
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {isExpired() 
              ? "El tiempo de debate (2 semanas) ha finalizado. Solo puedes visualizar los comentarios." 
              : "Deja tus impresiones, dudas o reseñas sobre la obra. Espacio disponible por 2 semanas."}
          </p>
        </div>

        {/* Listado de comentarios */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-black uppercase text-gray-500 tracking-wider border-b pb-3">Comentarios ({comentarios.length})</h2>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {comentarios.map((c) => (
              <div key={c._id} className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      {c.usuario?.avatar ? (
                        <img src={c.usuario.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                          {c.usuario?.username?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-gray-700 capitalize">{c.usuario?.nombres} {c.usuario?.apellidos}</p>
                      <p className="text-[9px] text-gray-400">{new Date(c.fechaCreacion).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Botones de acción (Editar/Eliminar) si no expiró el tiempo */}
                  {!isExpired() && (
                    <div className="flex items-center gap-1">
                      {editingId === c._id ? (
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg"><MdClose size={14} /></button>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(c._id); setEditText(c.texto); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><MdEdit size={14} /></button>
                          <button onClick={() => handleEliminar(c._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><MdDelete size={14} /></button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {editingId === c._id ? (
                  <div className="space-y-2 mt-2">
                    <textarea 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"
                      rows={2}
                    />
                    <button 
                      onClick={() => handleEditar(c._id)}
                      className="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 font-medium leading-relaxed pl-10">{c.texto}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Caja para escribir nuevo comentario (Solo si no expiró) */}
        {!isExpired() && (
          <form onSubmit={handleCrear} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex gap-3 items-end">
            <textarea
              rows={2}
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              placeholder="Escribe tu reseña o comentario..."
              className="flex-1 text-xs p-3 border border-gray-100 rounded-2xl bg-gray-50 focus:outline-none focus:border-amber-400 resize-none"
            />
            <button
              type="submit"
              disabled={cargando || !nuevoTexto.trim()}
              className="bg-amber-500 text-white p-3.5 rounded-2xl hover:bg-amber-600 transition shadow-sm disabled:opacity-50"
            >
              {cargando ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdSend size={18} />}
            </button>
          </form>
        )}

      </div>
    </section>
  );
}