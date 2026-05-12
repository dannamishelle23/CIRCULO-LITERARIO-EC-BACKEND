export default function Beneficios() {
  return (
    <section className="py-16">

      {/* TITULO */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#2c3e50]">
          Beneficios
        </h2>

        <p className="text-slate-500 mt-3">
          Ventajas de usar la plataforma Círculo Literario EC
        </p>

        <div className="w-20 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* CONTENIDO */}
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* CARD 1 */}
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-8 text-center">

          <h3 className="text-xl font-bold text-[#2c3e50] mb-3">
            Gestión personal
          </h3>

          <p className="text-slate-600">
            Administra tu perfil, información y preferencias desde un solo lugar.
          </p>

        </div>

        {/* CARD 2 */}
        <div className="bg-amber-50 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-8 text-center">

          <h3 className="text-xl font-bold text-[#2c3e50] mb-3">
            Experiencia lectora
          </h3>

          <p className="text-slate-600">
            Conecta con contenido literario adaptado a tus intereses.
          </p>

        </div>

        {/* CARD 3 */}
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-8 text-center">

          <h3 className="text-xl font-bold text-[#2c3e50] mb-3">
            Comunidad activa
          </h3>

          <p className="text-slate-600">
            Interactúa con lectores y escritores dentro de la plataforma.
          </p>

        </div>

      </div>
    </section>
  );
}