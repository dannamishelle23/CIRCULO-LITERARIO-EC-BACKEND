import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdHowToVote,
} from "react-icons/md";

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

  useEffect(() => {
    cargarObra();
  }, [id]);

  const cargarObra = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await obtenerObra(id);
      const obraData = response.obra;

      setObra(obraData);

      // backend: votos es array
      setVotos(obraData.votos?.length || 0);

      // opcional si quieres saber si votó (solo si backend lo incluye en el futuro)
      setYaVoto(false);

    } catch (err) {
      console.error(err);
      setError("Error al cargar la obra");
    } finally {
      setLoading(false);
    }
  };

  const handleVotar = async () => {
    try {
      const res = await votarObra(id);

      setVotos(res.votos);
      setYaVoto(!yaVoto);

      setMensaje(res.msg || "Voto actualizado");
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      const msg = error.response?.data?.msg || "No puedes votar";
      setMensaje("✗ " + msg);
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (error || !obra) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <p>{error || "No encontrada"}</p>
          <button onClick={() => navigate(-1)}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen p-6">

      {/* TOP BAR */}
      <button onClick={() => navigate(-1)}>
        <MdArrowBack /> Volver
      </button>

      {mensaje && (
        <div>
          {mensaje}
        </div>
      )}

      {/* INFO PRINCIPAL */}
      <h1>{obra.titulo}</h1>
      <p>{obra.sinopsis}</p>

      {/* CONTADORES */}
      <div>
        <p>Votos: {votos}</p>
        <p>Likes: 0 (no implementado)</p>
      </div>

      {/* BOTÓN VOTO */}
      {obra.estado === "EnVotacion" && (
        <button onClick={handleVotar}>
          <MdHowToVote />
          {yaVoto ? "Quitar voto" : "Votar"}
        </button>
      )}

      {/* AUTORES */}
      <p>
        Autor: {obra.autor?.nombres} {obra.autor?.apellidos}
      </p>

      {/* CAPÍTULOS */}
      {obra.capitulos?.map((c) => (
        <div key={c._id}>
          {c.titulo}
        </div>
      ))}

    </section>
  );
}