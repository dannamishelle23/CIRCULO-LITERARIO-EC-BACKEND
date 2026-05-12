import { useState, useEffect } from "react";
import ReactQuill from "react-quill";

export default function CapituloForm({ onSubmit, editingCapitulo, onCancel }) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  useEffect(() => {
    if (editingCapitulo) {
      setTitulo(editingCapitulo.titulo || "");
      setContenido(editingCapitulo.contenido || "");
    } else {
      setTitulo("");
      setContenido("");
    }
  }, [editingCapitulo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      titulo,
      contenido
    });

    setTitulo("");
    setContenido("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">

      <h2 className="text-xl font-bold mb-3">
        {editingCapitulo ? "Editar Capítulo" : "Nuevo Capítulo"}
      </h2>

      {/* TITULO */}
      <input
        className="w-full border p-2 mb-3"
        placeholder="Título del capítulo"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      {/* 🧠 EDITOR ENRIQUECIDO */}
      <div className="mb-3">
        <ReactQuill
          theme="snow"
          value={contenido}
          onChange={setContenido}
          placeholder="Escribe tu capítulo aquí..."
        />
      </div>

      <div className="flex gap-2">

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Guardar
        </button>

        {editingCapitulo && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}

      </div>

    </form>
  );
}