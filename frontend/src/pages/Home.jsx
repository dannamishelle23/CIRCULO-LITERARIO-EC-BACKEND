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

      {/* MODAL INFORMATIVO DE POLÍTICAS DE PRIVACIDAD (SIN BOTÓN DE ACCIÓN) */}
      {modalPrivacidad && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setModalPrivacidad(false)} // Cierra al hacer clic fuera del recuadro
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full max-h-[75vh] overflow-y-auto border border-gray-100 shadow-xl p-6 relative space-y-4 font-sans text-left"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
          >
            
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

            <div className="space-y-4 text-xs text-gray-600 leading-relaxed font-medium pb-2">
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

          </div>
        </div>
      )}