import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getCapitulos,
  createCapitulo,
  updateCapitulo,
  deleteCapitulo
} from "../services/capituloService";

// IMPORT CORRECTO (tu carpeta real)
import CapituloForm from "../components/capitulos/CapituloForm";
import CapituloCard from "../components/capitulos/CapituloCard";

export default function Capitulos() {
  const { id } = useParams();

  const [capitulos, setCapitulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCapitulo, setEditingCapitulo] = useState(null);

  const loadCapitulos = async () => {
    try {
      setLoading(true);
      const data = await getCapitulos(id);
      setCapitulos(data);
    } catch (error) {
      console.error("Error cargando capítulos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCapitulos();
  }, [id]);

  // CREAR / EDITAR
  const handleSubmit = async (capitulo) => {
    try {
      if (editingCapitulo) {
        await updateCapitulo(editingCapitulo.id, capitulo);
        setEditingCapitulo(null);
      } else {
        await createCapitulo(id, capitulo);
      }

      loadCapitulos();
    } catch (error) {
      console.error("Error guardando capítulo", error);
    }
  };

  // ELIMINAR
  const handleDelete = async (capituloId) => {
    try {
      await deleteCapitulo(capituloId);
      loadCapitulos();
    } catch (error) {
      console.error("Error eliminando capítulo", error);
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-4">
        📚 Gestión de Capítulos
      </h1>

      {/* FORMULARIO */}
      <CapituloForm
        onSubmit={handleSubmit}
        editingCapitulo={editingCapitulo}
        onCancel={() => setEditingCapitulo(null)}
      />

      {/* LISTADO */}
      <div className="mt-6 space-y-4">

        {loading ? (
          <p>Cargando capítulos...</p>
        ) : capitulos.length === 0 ? (
          <p>No hay capítulos aún.</p>
        ) : (
          capitulos.map((cap) => (
            <CapituloCard
              key={cap.id}
              capitulo={cap}
              onEdit={setEditingCapitulo}
              onDelete={handleDelete}
            />
          ))
        )}

      </div>

    </div>
  );
}