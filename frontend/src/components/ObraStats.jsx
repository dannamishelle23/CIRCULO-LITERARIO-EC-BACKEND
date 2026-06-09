export default function ObraStats({ obras }) {
  const total = obras.length;
  const enProgreso = obras.filter(o => o.estado === "En progreso").length;
  const finalizadas = obras.filter(o => o.estado === "Finalizada").length;

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">

      <div className="bg-blue-500 text-white p-4 rounded">
        <h3>Total</h3>
        <p className="text-2xl">{total}</p>
      </div>

      <div className="bg-yellow-500 text-white p-4 rounded">
        <h3>En progreso</h3>
        <p className="text-2xl">{enProgreso}</p>
      </div>

      <div className="bg-green-500 text-white p-4 rounded">
        <h3>Finalizadas</h3>
        <p className="text-2xl">{finalizadas}</p>
      </div>

    </div>
  );
}