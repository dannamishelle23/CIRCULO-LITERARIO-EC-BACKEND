import { useNavigate } from "react-router-dom"
import { MdOpenInNew, MdEdit, MdDelete } from "react-icons/md"

export default function ObraCard({ obra, onDelete, onEdit }) {
  const navigate = useNavigate()

  const getEstadoBadgeColor = (estado) => {
    const colors = {
      "Borrador": "bg-gray-100 text-gray-800",
      "EnRevision": "bg-yellow-100 text-yellow-800",
      "Aprobada": "bg-blue-100 text-blue-800",
      "EnVotacion": "bg-purple-100 text-purple-800",
      "Publicada": "bg-green-100 text-green-800",
      "Rechazada": "bg-red-100 text-red-800",
      "Ganadora": "bg-amber-100 text-amber-800"
    }
    return colors[estado] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 overflow-hidden group">
      {/* PORTADA */}
      <div className="relative h-48 overflow-hidden">
        {obra.portada ? (
          <img
            src={obra.portada}
            alt={obra.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FEF2E1] to-[#f5dcc5] flex items-center justify-center">
            <span className="text-4xl">📖</span>
          </div>
        )}

        {/* OVERLAY CON ESTADO */}
        <div className="absolute top-0 right-0 p-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getEstadoBadgeColor(obra.estado)}`}>
            {obra.estado}
          </span>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-4 flex flex-col h-full">
        {/* TÍTULO */}
        <h2 className="text-lg font-bold text-[#2c3e50] mb-2 line-clamp-2 hover:text-[#e67e22] transition">
          {obra.titulo}
        </h2>

        {/* SINOPSIS */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {obra.sinopsis || obra.descripcion}
        </p>

        {/* AUTOR */}
        {obra.autor && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 text-xs">
            {obra.autor.avatar && (
              <img
                src={obra.autor.avatar}
                alt={obra.autor.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-gray-600">
              <strong>{obra.autor.nombres}</strong>
            </span>
          </div>
        )}

        {/* BOTONES */}
        <div className="flex gap-2 justify-between pt-2">
          {/* VER DETALLES */}
          <button
            onClick={() => navigate(`/obra/${obra._id}`)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#e67e22] text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition"
            title="Ver detalles"
          >
            <MdOpenInNew size={16} /> Ver
          </button>

          {/* EDITAR */}
          {onEdit && (
            <button
              onClick={() => onEdit(obra)}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
              title="Editar"
            >
              <MdEdit size={16} />
            </button>
          )}

          {/* ELIMINAR */}
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm("¿Estás seguro de que quieres eliminar esta obra?")) {
                  onDelete(obra._id || obra.id)
                }
              }}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
              title="Eliminar"
            >
              <MdDelete size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}