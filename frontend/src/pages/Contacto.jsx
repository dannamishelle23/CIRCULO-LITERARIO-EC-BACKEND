export default function Contacto() {
  return (
    <section className="py-16">

      {/* TITULO */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-[#2c3e50]">
          Contacto
        </h2>

        <p className="text-slate-500 mt-3">
          Estamos disponibles para ayudarte
        </p>

        <div className="w-20 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* CARD */}
      <div className="container mx-auto px-6 max-w-2xl">

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center space-y-6">

          <h3 className="text-2xl font-bold text-[#2c3e50]">
            Círculo Literario EC
          </h3>

          <p className="text-slate-600">
            Si tienes dudas, sugerencias o quieres contactarnos, escríbenos:
          </p>

          {/* EMAIL DESTACADO */}
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-amber-700 font-bold text-lg">
              contacto@circuloliterario.ec
            </p>
          </div>

          {/* BOTÓN */}
          <button className="bg-amber-700 text-white px-6 py-3 rounded-2xl hover:bg-amber-600 transition">
            Enviar mensaje
          </button>

        </div>

      </div>

    </section>
  );
}