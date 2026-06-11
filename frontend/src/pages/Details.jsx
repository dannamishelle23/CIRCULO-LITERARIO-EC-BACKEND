import { useEffect, useState } from "react";
import { FaHeart, FaStar, FaBookOpen, FaUserCircle } from "react-icons/fa";

import {
  createComentario,
  getComentariosByObra,
  deleteComentario
} from "../services/comentarioService";

import { votarObra } from "../services/obraService";

const Details = () => {
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [votos, setVotos] = useState(0);

  const obraId = "123456";

  /* =========================
  CARGAR COMENTARIOS
  ========================= */
  const fetchComentarios = async () => {
    try {
      const data = await getComentariosByObra(obraId);
      setComentarios(data?.comentarios || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, []);

  /* =========================
  COMENTARIO
  ========================= */
  const handleComentario = async () => {
    if (!comentario.trim()) return;

    try {
      await createComentario({
        contenido: comentario,
        obraId
      });

      setComentario("");
      fetchComentarios();
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
  VOTAR OBRA (TOGGLE)
  ========================= */
  const handleVoto = async () => {
    try {
      const res = await votarObra(obraId);

      // backend ya devuelve el total actualizado
      setVotos(res.votos);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
  ELIMINAR COMENTARIO
  ========================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Deseas eliminar este comentario?");
    if (!confirmDelete) return;

    try {
      await deleteComentario(id);
      fetchComentarios();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-72 bg-gradient-to-r from-amber-700 to-orange-500 flex items-center justify-center">
            <div className="text-center text-white">
              <FaBookOpen className="text-7xl mx-auto mb-4" />
              <h1 className="text-5xl font-black">Sombras del Ayer</h1>
              <p className="mt-3 text-lg opacity-90">
                Una historia de misterio y emociones
              </p>
            </div>
          </div>

          {/* INFO */}
          <div className="p-8 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">
                Descripción
              </h2>

              <p className="text-slate-600 leading-relaxed">
                Esta obra narra el viaje de personajes atrapados entre recuerdos y secretos.
              </p>
            </div>

            {/* ESTADISTICAS */}
            <div className="bg-amber-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[#2c3e50] mb-6">
                Interacciones
              </h3>

              <div className="space-y-5">

                {/* LIKES (falso por ahora) */}
                <div className="w-full flex items-center justify-between bg-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaHeart className="text-red-500 text-2xl" />
                    <span className="font-semibold">Likes</span>
                  </div>
                  <span className="font-bold">0</span>
                </div>

                {/* VOTOS */}
                <button
                  onClick={handleVoto}
                  className="w-full flex items-center justify-between bg-white p-4 rounded-xl hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <FaStar className="text-amber-500 text-2xl" />
                    <span className="font-semibold">Votos</span>
                  </div>
                  <span className="font-bold">{votos}</span>
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* COMENTARIOS */}
        <div className="mt-10 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-black text-[#2c3e50] mb-6">
            Comentarios
          </h2>

          {/* INPUT */}
          <div className="bg-amber-50 rounded-2xl p-6">
            <textarea
              className="w-full rounded-2xl border p-5"
              rows="4"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={handleComentario}
                className="bg-amber-700 text-white px-8 py-3 rounded-2xl"
              >
                Publicar comentario
              </button>
            </div>
          </div>

          {/* LISTA */}
          <div className="mt-10 space-y-5">
            {comentarios.length === 0 ? (
              <div className="text-center py-10">
                <FaUserCircle className="text-6xl text-slate-300 mx-auto mb-4" />
                <p>No existen comentarios todavía</p>
              </div>
            ) : (
              comentarios.map((item) => (
                <div key={item._id} className="bg-[#fffaf3] p-6 rounded-2xl">
                  <div className="flex justify-between">
                    <h4 className="font-bold">
                      {item.usuario?.nombres || "Usuario"}
                    </h4>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl"
                    >
                      Eliminar
                    </button>
                  </div>

                  <p className="mt-4">{item.contenido}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Details;