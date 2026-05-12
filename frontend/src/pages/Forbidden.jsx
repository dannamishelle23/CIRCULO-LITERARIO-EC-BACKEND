import { Link } from "react-router-dom";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF2E1] px-6">

      <div className="max-w-md text-center bg-white shadow-xl rounded-3xl p-10 border border-red-100">

        {/* ICONO */}
        <div className="text-6xl mb-4">🚫</div>

        {/* CODIGO ERROR */}
        <p className="text-sm text-red-500 font-bold">ERROR 403</p>

        {/* TITULO */}
        <h1 className="text-3xl font-black text-red-600 mt-2">
          Acceso denegado
        </h1>

        {/* DESCRIPCION */}
        <p className="mt-4 text-slate-600">
          No tienes permisos para acceder a esta sección de
          <span className="font-semibold text-[#2c3e50]">
            {" "}Círculo Literario EC
          </span>.
        </p>

        {/* SUGERENCIA */}
        <p className="text-sm text-slate-500 mt-3">
          Inicia sesión o contacta al administrador si crees que es un error.
        </p>

        {/* BOTÓN */}
        <Link
          to="/login"
          className="inline-block mt-6 bg-[#2c3e50] text-white px-6 py-3 rounded-2xl hover:bg-[#1b2836] transition"
        >
          Ir al login
        </Link>

      </div>

    </div>
  );
};

export default Forbidden;