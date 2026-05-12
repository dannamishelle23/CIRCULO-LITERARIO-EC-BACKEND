import { useState, useEffect } from "react";

export default function ObraForm({ onSubmit, editingObra, onCancel }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    autor: "",
    estado: "En progreso"
  });

  const [portada, setPortada] = useState(null);

  // cargar datos si es edición
  useEffect(() => {
    if (editingObra) {
      setForm({
        titulo: editingObra.titulo || "",
        descripcion: editingObra.descripcion || "",
        autor: editingObra.autor || "",
        estado: editingObra.estado || "En progreso"
      });
    }
  }, [editingObra]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // enviamos TODO (incluye imagen)
    onSubmit({
      ...form,
      portada
    });

    setForm({
      titulo: "",
      descripcion: "",
      autor: "",
      estado: "En progreso"
    });

    setPortada(null);
  };

  return (
    <form className="bg-white p-4 rounded shadow mb-4" onSubmit={handleSubmit}>

      <h2 className="text-xl font-bold mb-3">
        {editingObra ? "Editar Obra" : "Crear Obra"}
      </h2>

      <input
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        placeholder="Título"
        className="w-full border p-2 mb-2"
      />

      <input
        name="autor"
        value={form.autor}
        onChange={handleChange}
        placeholder="Autor"
        className="w-full border p-2 mb-2"
      />

      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full border p-2 mb-2"
      />

      <select
        name="estado"
        value={form.estado}
        onChange={handleChange}
        className="w-full border p-2 mb-2"
      >
        <option>En progreso</option>
        <option>Finalizada</option>
        <option>Pausada</option>
      </select>

      {/* PORTADA */}
      <input
        type="file"
        accept="image/*"
        className="w-full mb-3"
        onChange={(e) => setPortada(e.target.files[0])}
      />

      <div className="flex gap-2">

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editingObra ? "Actualizar" : "Crear"}
        </button>

        {editingObra && (
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