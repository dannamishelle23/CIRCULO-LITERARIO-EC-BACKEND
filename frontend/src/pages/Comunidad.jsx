import { MdAutoStories, MdDashboard } from "react-icons/md";
import { FaCommentSms } from "react-icons/fa6";
import { BsCashCoin } from "react-icons/bs";
import { FaHeart, FaFire, FaStar } from "react-icons/fa";


export default function Comunidad() {

  const actividades = [
    {
      usuario: "Ana López",
      accion: "comentó una obra",
      tiempo: "Hace 5 minutos"
    },
    {
      usuario: "Carlos Pérez",
      accion: "publicó un nuevo capítulo",
      tiempo: "Hace 20 minutos"
    },
    {
      usuario: "María Torres",
      accion: "reaccionó a una publicación",
      tiempo: "Hace 1 hora"
    }
  ];

  const comentarios = [
    {
      usuario: "Andrea",
      comentario: "Excelente historia, me encantó el desarrollo."
    },
    {
      usuario: "Luis",
      comentario: "Espero el próximo capítulo."
    },
    {
      usuario: "Fernanda",
      comentario: "Muy buena narrativa y personajes."
    }
  ];

  const obras = [
    {
      titulo: "Sombras del Ayer",
      votos: 120
    },
    {
      titulo: "El Reino Perdido",
      votos: 98
    },
    {
      titulo: "Cartas al Destino",
      votos: 87
    }
  ];

  return (
    <section className="py-16 bg-[#FEF2E1] min-h-screen">

      {/* TITULO */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#2c3e50]">
          Comunidad
        </h2>

        <p className="text-slate-500 mt-3">
          Interactúa con otros lectores y forma parte del círculo literario
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">

        {/* INFO */}
        <div className="space-y-6">

          <p className="text-lg text-slate-700">
            En la comunidad de Círculo Literario EC podrás compartir ideas,
            descubrir nuevos autores y participar en conversaciones literarias.
          </p>

          {/* CARDS */}
          <div className="grid sm:grid-cols-2 gap-4">

            <div className="p-4 bg-amber-50 rounded-xl shadow-sm">
              <MdAutoStories className="text-3xl text-amber-700 mb-2" />
              <h4 className="font-bold">Lecturas</h4>
              <p className="text-sm text-slate-600">
                Descubre nuevos libros y autores.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm">
              <MdDashboard className="text-3xl text-amber-700 mb-2" />
              <h4 className="font-bold">Perfil</h4>
              <p className="text-sm text-slate-600">
                Administra tu información.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl shadow-sm">
              <FaCommentSms className="text-3xl text-amber-700 mb-2" />
              <h4 className="font-bold">Conversación</h4>
              <p className="text-sm text-slate-600">
                Interactúa con la comunidad.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl shadow-sm">
              <BsCashCoin className="text-3xl text-amber-700 mb-2" />
              <h4 className="font-bold">Crecimiento</h4>
              <p className="text-sm text-slate-600">
                Plataforma en evolución.
              </p>
            </div>

          </div>

          {/* FEED DE ACTIVIDAD */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-4">
              Feed de actividad
            </h3>

            <div className="space-y-4">
              {
                actividades.map((actividad, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-200 pb-3"
                  >
                    <p className="font-semibold text-slate-700">
                      {actividad.usuario}
                    </p>

                    <p className="text-slate-600">
                      {actividad.accion}
                    </p>

                    <span className="text-sm text-slate-400">
                      {actividad.tiempo}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>

        </div>

        {/* BLOQUE DERECHO */}
        <div className="space-y-6">

          {/* COMENTARIOS RECIENTES */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-4">
              Comentarios recientes
            </h3>

            <div className="space-y-4">
              {
                comentarios.map((item, index) => (
                  <div
                    key={index}
                    className="bg-amber-50 p-4 rounded-xl"
                  >
                    <p className="font-bold text-slate-700">
                      {item.usuario}
                    </p>

                    <p className="text-slate-600 text-sm mt-1">
                      {item.comentario}
                    </p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* OBRAS MAS VOTADAS */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-4">
              Obras más votadas
            </h3>

            <div className="space-y-4">
              {
                obras.map((obra, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-amber-50 p-4 rounded-xl"
                  >
                    <div>
                      <p className="font-bold text-slate-700">
                        {obra.titulo}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-amber-700 font-bold">
                      <FaStar />
                      {obra.votos}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* RANKING DE OBRAS */}
<div className="bg-white rounded-3xl p-6 shadow-md">

  <h3 className="text-2xl font-bold text-[#2c3e50] mb-4">
    Ranking de obras
  </h3>

  <div className="space-y-4">

    {
      obras.map((obra, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-[#fffaf3] p-4 rounded-xl border border-amber-100"
        >

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold">
              #{index + 1}
            </div>

            <div>
              <p className="font-bold text-slate-700">
                {obra.titulo}
              </p>

              <p className="text-sm text-slate-500">
                Obra destacada de la comunidad
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 text-amber-700 font-bold">
            <FaStar />
            {obra.votos}
          </div>

        </div>
      ))
    }

  </div>

</div>

          {/* INTERACCION ENTRE USUARIOS */}
          <div className="bg-amber-50 rounded-3xl p-6 shadow-md text-center">
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-4">
              Interacción entre usuarios
            </h3>

            <p className="text-slate-600 mb-6">
              Reacciona y comparte opiniones con otros lectores y escritores.
            </p>

            <div className="flex justify-center gap-6 text-3xl text-amber-700">
              <button className="hover:scale-110 transition">
                <FaHeart />
              </button>

              <button className="hover:scale-110 transition">
                <FaFire />
              </button>

              <button className="hover:scale-110 transition">
                <FaCommentSms />
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}