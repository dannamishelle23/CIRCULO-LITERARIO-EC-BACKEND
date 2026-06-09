export default function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div className="bg-white p-6 rounded">

        <p>¿Seguro que deseas eliminar?</p>

        <div className="flex gap-2 mt-4">

          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-3 py-1"
          >
            Sí
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-300 px-3 py-1"
          >
            No
          </button>

        </div>

      </div>

    </div>
  );
}