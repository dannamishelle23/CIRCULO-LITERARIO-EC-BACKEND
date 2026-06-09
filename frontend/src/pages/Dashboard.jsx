import { useEffect, useState } from "react";

import {
  getObras,
  createObra,
  updateObra,
  deleteObra
} from "../services/obraService";

import ObraForm from "../components/ObraForm";
import ObraCard from "../components/ObraCard";

export default function Dashboard() {
  const [obras, setObras] = useState([]);
  const [editingObra, setEditingObra] = useState(null);

  const loadObras = async () => {
    const data = await getObras();
    setObras(data);
  };

  useEffect(() => {
    loadObras();
  }, []);

  // ➕ crear o actualizar
  const handleSubmit = async (obra) => {
    if (editingObra) {
      await updateObra(editingObra.id, obra);
      setEditingObra(null);
    } else {
      await createObra(obra);
    }

    loadObras();
  };

  // ❌ eliminar
  const handleDelete = async (id) => {
    await deleteObra(id);
    loadObras();
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-4">
        Gestión de Obras Literarias
      </h1>

      {/* FORMULARIO */}
      <ObraForm
        onSubmit={handleSubmit}
        editingObra={editingObra}
        onCancel={() => setEditingObra(null)}
      />

      {/* LISTADO */}
      <div className="grid md:grid-cols-3 gap-4">

        {obras.map((obra) => (
          <div key={obra.id} className="bg-white p-4 rounded shadow">

            <h2 className="font-bold text-xl">
              {obra.titulo}
            </h2>

            <p>{obra.autor}</p>

            <p className="text-sm text-gray-500">
              {obra.estado}
            </p>

            <div className="flex gap-2 mt-3">

              <button
                onClick={() => setEditingObra(obra)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => handleDelete(obra.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}