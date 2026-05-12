export default function ObraCard({ obra, onDelete, onEdit }) {
  return (
    <div className="bg-white p-4 rounded shadow">

      {/* PORTADA */}
      {obra.portada && (
        <img
          src={obra.portada}
          alt="portada"
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <h2 className="text-xl font-bold">
        {obra.titulo}
      </h2>

      <p className="text-gray-600 mt-1">
        {obra.descripcion}
      </p>

      <p className="text-sm mt-2">
        Estado: <span className="font-semibold">{obra.estado}</span>
      </p>

      <div className="flex gap-2 mt-3">

        {/* EDITAR */}
        {onEdit && (
          <button
            onClick={() => onEdit(obra)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Editar
          </button>
        )}

        {/* ELIMINAR */}
        <button
          onClick={() => onDelete(obra.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Eliminar
        </button>

      </div>

    </div>
  );
}