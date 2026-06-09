import {
  FaUser,
  FaBook,
  FaCommentDots,
  FaEdit,
  FaClock
} from "react-icons/fa";

export default function Logs() {

  /*LOGS SIMULADOS*/
  const logs = [
    {
      tipo: "login",
      usuario: "Jhosselin",
      descripcion: "Inició sesión en el sistema",
      fecha: "12/05/2026 - 10:30"
    },
    {
      tipo: "obra",
      usuario: "Andrea",
      descripcion: "Creó una nueva obra literaria",
      fecha: "12/05/2026 - 11:00"
    },
    {
      tipo: "comentario",
      usuario: "Carlos",
      descripcion: "Comentó una publicación",
      fecha: "12/05/2026 - 11:25"
    },
    {
      tipo: "update",
      usuario: "Fernanda",
      descripcion: "Actualizó su perfil",
      fecha: "12/05/2026 - 12:10"
    }
  ];

  /*ICONOS*/
  const getIcon = (tipo) => {

    switch (tipo) {

      case "login":
        return <FaUser className="text-blue-500" />;

      case "obra":
        return <FaBook className="text-amber-600" />;

      case "comentario":
        return <FaCommentDots className="text-green-600" />;

      case "update":
        return <FaEdit className="text-purple-600" />;

      default:
        return <FaClock />;
    }
  };

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <h1 className="text-4xl font-black text-[#2c3e50]">
            Logs del Sistema
          </h1>

          <p className="text-slate-500 mt-3">
            Monitoreo de actividad y acciones realizadas.
          </p>

        </div>

        {/* LISTA LOGS */}
        <div className="space-y-5">

          {
            logs.map((log, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-5 hover:shadow-lg transition"
              >

                {/* ICONO */}
                <div className="text-3xl mt-1">

                  {getIcon(log.tipo)}

                </div>

                {/* CONTENIDO */}
                <div className="flex-1">

                  <h3 className="font-bold text-xl text-[#2c3e50]">
                    {log.usuario}
                  </h3>

                  <p className="text-slate-600 mt-1">
                    {log.descripcion}
                  </p>

                  <span className="text-sm text-slate-400 mt-2 block">
                    {log.fecha}
                  </span>

                </div>

              </div>

            ))
          }

        </div>

      </div>

    </section>
  );
}