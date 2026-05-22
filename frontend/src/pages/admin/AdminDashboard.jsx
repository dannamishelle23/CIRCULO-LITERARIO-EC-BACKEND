import { useNavigate } from "react-router-dom";

import {
  FaUsersCog,
  FaBookOpen
} from "react-icons/fa";

import PanelMenu from "../../components/PanelMenu";

export default function AdminDashboard() {

  const navigate = useNavigate();

  return (

    <section className="min-h-screen bg-[#FEF2E1] py-12 px-6">

      <div className="max-w-7xl mx-auto">

        {/* MENU */}
        <PanelMenu />

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

          <h1 className="text-4xl font-black text-[#2c3e50]">
            Panel Administrativo
          </h1>

          <p className="text-slate-500 mt-3">
            Gestiona usuarios, moderadores y clubes literarios
          </p>

        </div>

        {/* OPCIONES */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* USUARIOS */}
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="bg-white rounded-3xl shadow-xl p-10 text-left hover:scale-[1.02] transition"
          >

            <FaUsersCog className="text-5xl text-amber-700 mb-5" />

            <h2 className="text-2xl font-black text-[#2c3e50]">
              Gestión de Usuarios
            </h2>

            <p className="text-slate-500 mt-2">
              Administrar lectores, autores y moderadores
            </p>

          </button>

          {/* CLUBES */}
          <button
            onClick={() => navigate("/admin/clubes")}
            className="bg-white rounded-3xl shadow-xl p-10 text-left hover:scale-[1.02] transition"
          >

            <FaBookOpen className="text-5xl text-amber-700 mb-5" />

            <h2 className="text-2xl font-black text-[#2c3e50]">
              Gestión de Clubes
            </h2>

            <p className="text-slate-500 mt-2">
              Crear clubes y asignar moderadores
            </p>

          </button>

        </div>

      </div>

    </section>
  );
}