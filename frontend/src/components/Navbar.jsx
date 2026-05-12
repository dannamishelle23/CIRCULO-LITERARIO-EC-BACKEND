import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
      
      {/* IZQUIERDA - LOGO */}
      <div className="text-xl font-bold flex items-center gap-1">
        <span className="text-orange-500">Circulo</span>
        <span className="text-black">Literario EC</span>
      </div>

      {/* CENTRO - MENÚ */}
      <div className="flex gap-8 text-gray-700 font-medium">
        <Link to="/home" className="hover:text-orange-500 transition">
          Inicio
        </Link>

        <Link to="/comunidad" className="hover:text-orange-500 transition">
          Comunidad
        </Link>

        <Link to="/beneficios" className="hover:text-orange-500 transition">
          Beneficios
        </Link>

        <Link to="/contacto" className="hover:text-orange-500 transition">
          Contacto
        </Link>
      </div>

      {/* DERECHA (opcional, vacío o futuro login/user) */}
      <div></div>

    </nav>
  );
}