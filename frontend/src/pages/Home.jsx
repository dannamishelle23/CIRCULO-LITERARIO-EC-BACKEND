import Navbar from "../components/Navbar";
import logoHero from "../assets/logoHero.png";
import logoCommunity from "../assets/logoCommunity.png";
import { Link } from "react-router-dom"; 

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
            <a
              href="/register"
              className="block bg-amber-800 px-6 py-3 text-white rounded-2xl text-center hover:bg-amber-700"
            >
              Crear cuenta
            </a>

            <a
              href="/login"
              className="block border border-[#2c3e50] px-6 py-3 text-[#2c3e50] rounded-2xl text-center hover:bg-[#2c3e50] hover:text-white"
            >
              Iniciar sesion
            </a>
          </div>
        </div>

        {/* IMAGEN HERO */}
        <div className="hidden md:block">
          <img src={logoHero} alt="Comunidad lectora" />
        </div>
      </main>

      <footer
        id="contacto"
        className="text-center bg-amber-50 p-6 mt-20 rounded-t-3xl space-y-6"
      >
        <p>Circulo Literario EC - Ecuador</p>
      </footer>
    </>
  );
};

