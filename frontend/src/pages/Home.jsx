import logoHero from "../assets/logoHero.png";
import logoCommunity from "../assets/logoCommunity.png";
import { Link } from "react-router-dom"; 
import { FaInstagram } from "react-icons/fa"; 

export default function Home() {
  return (
    <>
      {/* MAIN HERO */}
      <main
        id="inicio"
        className="text-center py-10 px-8 bg-amber-50 md:text-left md:flex justify-between items-center gap-10"
      >
        <div className="md:max-w-xl">
          <p className="font-bold uppercase tracking-[0.3em] text-amber-700 text-sm">
            Lectores y autores
          </p>

          <h1 className="font-extrabold text-[#2c3e50] uppercase text-4xl my-4 md:text-6xl leading-tight">
            Un espacio para leer, compartir y descubrir nuevas voces
          </h1>

          <p className="text-lg my-6 text-slate-700">
            Circulo Literario EC conecta a personas que aman la literatura.
            Crea tu cuenta, participa en la comunidad y administra tu perfil
            desde una experiencia simple y cercana.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/register"
              className="block bg-amber-800 px-6 py-3 text-white rounded-2xl text-center hover:bg-amber-700"
            >
              Crear cuenta
            </Link>

            <Link
              to="/login"
              className="block border border-[#2c3e50] px-6 py-3 text-[#2c3e50] rounded-2xl text-center hover:bg-[#2c3e50] hover:text-white"
            >
              Iniciar sesion
            </Link>
          </div>
        </div>

        {/* IMAGEN HERO */}
        <div className="hidden md:block">
          <img src={logoHero} alt="Comunidad lectora" />
        </div>
      </main>

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="text-center mb-12 px-6">
          <h2 className="text-4xl font-bold text-[#2c3e50]">
            Beneficios
          </h2>
          <p className="text-slate-500 mt-3">
            Ventajas de usar la plataforma Círculo Literario EC.
          </p>
          <div className="w-20 h-1 bg-amber-700 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-amber-50 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-8 text-center">
            <h3 className="text-xl font-bold text-[#2c3e50] mb-3">
              Gestión personal
            </h3>
            <p className="text-slate-600">
              Administra tu perfil, información y preferencias desde un solo lugar.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-8 text-center">
            <h3 className="text-xl font-bold text-[#2c3e50] mb-3">
              Experiencia lectora
            </h3>
            <p className="text-slate-600">
              Conecta con contenido literario adaptado a tus intereses.
            </p>
          </div>

          <div className="bg-amber-50 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 p-8 text-center">
            <h3 className="text-xl font-bold text-[#2c3e50] mb-3">
              Comunidad activa
            </h3>
            <p className="text-slate-600">
              Interactúa con lectores y escritores dentro de la plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* COMUNIDAD */}
      <section id="comunidad" className="py-20 bg-[#FEF2E1]">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-4xl font-bold text-[#2c3e50]">
                Comunidad
              </h2>
              <p className="text-slate-500 mt-3">
                Interactúa con otros lectores y forma parte del círculo literario.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="p-6 bg-white rounded-3xl shadow-sm">
                <h3 className="font-bold text-[#2c3e50] mb-2">Lecturas compartidas</h3>
                <p className="text-slate-600">
                  Descubre nuevas historias y comenta con otros miembros.
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl shadow-sm">
                <h3 className="font-bold text-[#2c3e50] mb-2">Espacios activos</h3>
                <p className="text-slate-600">
                  Participa en conversaciones literarias, reseñas y recomendaciones.
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl shadow-sm">
                <h3 className="font-bold text-[#2c3e50] mb-2">Perfil personalizado</h3>
                <p className="text-slate-600">
                  Comparte tus intereses y recibe contenido hecho para ti.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img src={logoCommunity} alt="Comunidad literaria" className="rounded-3xl shadow-lg max-w-full" />
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 bg-amber-50">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#2c3e50]">
              Contacto
            </h2>
            <p className="text-slate-500 mt-3">
              Estamos disponibles para ayudarte.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center space-y-6">
            <h3 className="text-2xl font-bold text-[#2c3e50]">
              Círculo Literario EC
            </h3>
            <p className="text-slate-600">
              Si tienes dudas, sugerencias o quieres contactarnos, escríbenos:
            </p>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-amber-700 font-bold text-lg">
                contacto@circuloliterario.ec
              </p>
            </div>
            <button className="bg-amber-700 text-white px-6 py-3 rounded-2xl hover:bg-amber-600 transition">
              Enviar mensaje
            </button>
            <div className="flex justify-center items-center gap-4 text-2xl text-[#2c3e50]">
              <FaInstagram className="hover:text-pink-600 transition-colors" />
            </div>
          </div>
        </div>
      </section>
      <footer
        className="text-center bg-amber-50 p-6 mt-20 rounded-t-3xl space-y-6"
      >
        <div className="flex justify-center items-center gap-4">
          <p>Circulo Literario EC - Ecuador</p>
          <a 
            href="https://www.instagram.com/circuloliterarioec" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl hover:text-pink-600 transition-colors"
          >
            <FaInstagram />
          </a>
        </div>
      </footer>
    </>
  );
}