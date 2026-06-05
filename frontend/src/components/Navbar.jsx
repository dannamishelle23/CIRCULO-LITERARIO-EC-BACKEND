export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      
      {/* IZQUIERDA - LOGO */}
      <div className="text-xl font-bold flex items-center gap-1">
        <span className="text-orange-500">Circulo</span>
        <span className="text-black">Literario EC</span>
      </div>

      {/* CENTRO - MENÚ */}
      <div className="flex gap-8 text-gray-700 font-medium">
        <a href="/home#inicio" className="hover:text-orange-500 transition">
          Inicio
        </a>

        <a href="/home#comunidad" className="hover:text-orange-500 transition">
          Comunidad
        </a>

        <a href="/home#beneficios" className="hover:text-orange-500 transition">
          Beneficios
        </a>

        <a href="/home#contacto" className="hover:text-orange-500 transition">
          Contacto
        </a>
      </div>

      {/* DERECHA (opcional, vacío o futuro login/user) */}
      <div></div>

    </nav>
  );
}