import { useState } from "react";
import logoHero from "../assets/logoHero.png";
import logoCommunity from "../assets/logoCommunity.png";
import { Link } from "react-router-dom"; 
import { FaInstagram } from "react-icons/fa"; 
import { MdArrowForward, MdMailOutline, MdGroups, MdAutoStories, MdSettings, MdClose } from "react-icons/md";

export default function Home() {
  const [modalPrivacidad, setModalPrivacidad] = useState(false);

  return (
    <>
      {/* MAIN HERO */}
      <main
        id="inicio"
        className="relative bg-[#f8f9fa] py-16 px-6 font-sans sm:px-8 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto md:flex justify-between items-center gap-12 relative z-10">
          <div className="md:max-w-xl space-y-5 text-center md:text-left">
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#e67e22] bg-orange-50 border border-orange-100/60 px-3 py-1 rounded">
              Lectores y autores • Ecuador
            </span>

            <h1 className="font-black text-[#2c3e50] uppercase text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1]">
              Un espacio para leer, compartir y descubrir <span className="text-[#e67e22]">nuevas voces</span>
            </h1>

            <p className="text-xs sm:text-sm font-medium text-gray-500 leading-relaxed max-w-lg mx-auto md:mx-0">
              Círculo Literario EC conecta mentes apasionadas por la literatura. 
              Crea tu cuenta, interactúa en la comunidad y administra tus obras desde una experiencia limpia, intuitiva y minimalista.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#e67e22] px-6 py-3 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 transition shadow-3xs active:scale-98"
              >
                Crear cuenta <MdArrowForward size={14} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-white border border-gray-200 px-6 py-3 text-[#2c3e50] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-50 transition shadow-3xs active:scale-98"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          {/* IMAGEN HERO OPTIMIZADA (Más Pequeña) */}
          <div className="hidden md:block max-w-xs shrink-0 mx-auto">
            <div className="p-2.5 bg-white border border-gray-100 rounded-2xl shadow-2xs">
              <img src={logoHero} alt="Comunidad lectora" className="rounded-xl w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </main>

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-20 bg-white font-sans border-t border-b border-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-2 mb-14">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">
              Beneficios de la Plataforma
            </h2>
            <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">
              Diseñado exclusivamente para la gestión y promoción de talento literario emergente.
            </p>
            <div className="w-10 h-[2px] bg-[#e67e22] mx-auto pt-0.5 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 space-y-3 transition group hover:bg-white hover:shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#e67e22]">
                <MdSettings size={16} />
              </div>
              <h3 className="text-sm font-black text-[#2c3e50] uppercase tracking-tight">
                Gestión Personal
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Controla tu perfil de autor, obras postuladas, borradores e información general de manera centralizada.
              </p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 space-y-3 transition group hover:bg-white hover:shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#e67e22]">
                <MdAutoStories size={16} />
              </div>
              <h3 className="text-sm font-black text-[#2c3e50] uppercase tracking-tight">
                Experiencia Lectora
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Explora el catálogo asimétrico e interactúa directamente leyendo los capítulos publicados por los miembros.
              </p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 space-y-3 transition group hover:bg-white hover:shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#e67e22]">
                <MdGroups size={16} />
              </div>
              <h3 className="text-sm font-black text-[#2c3e50] uppercase tracking-tight">
                Comunidad Activa
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Vota por tus obras preferidas durante las fases activas y apoya el crecimiento de clubes literarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMUNIDAD */}
      <section id="comunidad" className="py-20 bg-[#f8f9fa] font-sans">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">
                Ecosistema Colectivo
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Conecta, evalúa y comparte perspectivas críticas con otros entusiastas del arte.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-3xs flex gap-4 items-start">
                <span className="text-base pt-0.5">📖</span>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black text-[#2c3e50] uppercase tracking-tight">Lecturas Compartidas</h3>
                  <p className="text-xs text-gray-500 font-medium">Descubre entregas periódicas de capítulos y deja tu huella con likes.</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-3xs flex gap-4 items-start">
                <span className="text-base pt-0.5">💬</span>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black text-[#2c3e50] uppercase tracking-tight">Espacios de Interacción</h3>
                  <p className="text-xs text-gray-500 font-medium">Participa en las dinámicas internas de los clubes literarios registrados.</p>
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-3xs flex gap-4 items-start">
                <span className="text-base pt-0.5">👤</span>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black text-[#2c3e50] uppercase tracking-tight">Identidad Personalizada</h3>
                  <p className="text-xs text-gray-500 font-medium">Diseña un perfil estético que refleje tu rol como lector o creador.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="p-2.5 bg-white border border-gray-100 rounded-3xl shadow-2xs w-full max-w-sm">
              <img src={logoCommunity} alt="Comunidad literaria" className="rounded-2xl w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO ACTUALIZADO */}
      <section id="contacto" className="py-20 bg-white font-sans">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">
              Canales Oficiales
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Atención directa para consultas y soporte técnico de la plataforma.
            </p>
          </div>

          <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-8 space-y-5 shadow-3xs max-w-xl mx-auto">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-[#2c3e50] uppercase tracking-tight">
                Soporte de Círculo Literario EC
              </h3>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl py-3 px-4 shadow-3xs inline-flex items-center gap-2 mx-auto">
              <MdMailOutline size={14} className="text-[#e67e22]" />
              <span className="text-xs font-bold text-[#e67e22] tracking-wide">
                info.circuloliterario@gmail.com
              </span>
            </div>

            <div className="pt-2 flex flex-col items-center gap-3">
              <a 
                href="mailto:info.circuloliterario@gmail.com"
                className="bg-[#2c3e50] text-white px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-orange-600 transition shadow-3xs active:scale-98"
              >
                Enviar correo
              </a>
              
              <a 
                href="https://www.instagram.com/circuloliterarioec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-pink-600 transition-colors pt-2 border-t border-gray-100 w-full justify-center"
              >
                <FaInstagram size={13} /> @circuloliterarioec
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CON POLÍTICAS */}
      <footer className="bg-[#f8f9fa] border-t border-gray-100 py-6 px-6 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Círculo Literario EC — Ecuador</p>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setModalPrivacidad(true)}
              className="hover:text-[#2c3e50] transition-colors cursor-pointer uppercase tracking-wider text-[11px]"
            >
              Políticas de Privacidad
            </button>
            <a 
              href="https://www.instagram.com/circuloliterarioec" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-pink-600 transition-colors bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-3xs"
            >
              <FaInstagram size={12} /> Comunidad
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL MODERNO DE POLÍTICAS DE PRIVACIDAD */}
      {modalPrivacidad && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto border border-gray-100 shadow-xl p-6 relative space-y-4 font-sans text-left">
            
            <button
              type="button"
              onClick={() => setModalPrivacidad(false)}
              className="absolute top-4 h-7 w-7 border border-gray-100 rounded-lg flex items-center justify-center right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              <MdClose size={16} />
            </button>

            <div className="space-y-1 pr-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#2c3e50]">
                Políticas de Privacidad
              </h2>
              <p className="text-[10px] text-gray-400 font-bold">Última actualización: Junio 2026</p>
            </div>
            
            <hr className="border-gray-100" />

            <div className="space-y-4 text-xs text-gray-600 leading-relaxed font-medium overflow-y-auto">
              <section className="space-y-1">
                <h3 className="font-black text-[#2c3e50] uppercase tracking-tight text-[11px]">1. Recopilación de Información</h3>
                <p>Para registrarse e interactuar en Círculo Literario EC, solicitamos datos esenciales como nombres, apellidos, nombre de usuario y correo electrónico. Las contraseñas se almacenan mediante algoritmos de encriptación segura unidireccional.</p>
              </section>

              <section className="space-y-1">
                <h3 className="font-black text-[#2c3e50] uppercase tracking-tight text-[11px]">2. Contenido Literario y Archivos</h3>
                <p>Las portadas de las obras y los avatares de perfil procesados son almacenados de forma externa utilizando proveedores de infraestructura multimedia en la nube con altos estándares de protección de datos.</p>
              </section>

              <section className="space-y-1">
                <h3 className="font-black text-[#2c3e50] uppercase tracking-tight text-[11px]">3. Derechos e Interacciones</h3>
                <p>Los autores retienen la propiedad total de sus borradores, prólogos y capítulos compartidos. El sistema registra de manera anónima o enlazada las métricas de interacciones ("votos" y "likes") exclusivamente para gestionar la lógica del catálogo interno y votaciones activas.</p>
              </section>

              <section className="space-y-1">
                <h3 className="font-black text-[#2c3e50] uppercase tracking-tight text-[11px]">4. Uso de la Información</h3>
                <p>Círculo Literario EC se compromete a no comercializar ni transferir datos personales a terceros bajo ningún concepto. Toda la información recopilada tiene como fin único proveer soporte y optimizar la experiencia de usuario dentro de la plataforma.</p>
              </section>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setModalPrivacidad(false)}
                className="w-full bg-[#2c3e50] text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 transition cursor-pointer"
              >
                Entendido
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}