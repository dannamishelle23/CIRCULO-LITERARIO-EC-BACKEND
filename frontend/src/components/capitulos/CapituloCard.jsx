export default function CapituloCard({ capitulo, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow">

      <h2 className="text-xl font-bold">
        {capitulo.titulo}
      </h2>

      <p className="text-gray-600 mt-2">
        {capitulo.contenido}
      </p>

      <div className="flex gap-2 mt-3">

        <button
          onClick={() => onEdit(capitulo)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(capitulo.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Eliminar
        </button>

      </div>

    </div>
  );
}