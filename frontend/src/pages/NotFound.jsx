import logoDog from '../assets/doglost.jpg';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEF2E1] px-6">

      {/* IMAGEN */}
      <img
        className="object-cover h-72 w-72 rounded-full border-4 border-amber-700 shadow-lg"
        src={logoDog}
        alt="Página no encontrada"
      />

      {/* TEXTO */}
      <div className="text-center mt-10 space-y-4">

        <h1 className="text-5xl font-extrabold text-[#2c3e50]">
          404
        </h1>

        <p className="text-3xl font-semibold text-gray-800">
          Página no encontrada
        </p>

        <p className="text-gray-600">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>

        {/* BOTÓN */}
        <Link
          to="/home"
          className="inline-block mt-6 bg-[#2c3e50] text-white px-6 py-3 rounded-2xl hover:bg-[#1b2836] transition"
        >
          Regresar al inicio
        </Link>

      </div>

    </div>
  );
};
