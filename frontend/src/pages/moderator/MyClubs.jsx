import { useEffect, useState } from "react";

import {getMyAssignedClubs} from "../../services/clubService";

import {useNavigate} from "react-router-dom";

import {
  FaBookOpen,
  FaEye
} from "react-icons/fa";

export default function MyClubs() {

  const [clubes, setClubes] = useState([]);

  const navigate = useNavigate();

  const fetchClubs = async () => {

    try {

      const response =
        await getMyAssignedClubs();

      setClubes(response);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return (

    <section className="min-h-screen bg-[#FEF2E1] py-12 px-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

          <div className="flex items-center gap-4">

            <div className="bg-amber-100 p-5 rounded-2xl">

              <FaBookOpen className="text-5xl text-amber-700" />

            </div>

            <div>

              <h1 className="text-4xl font-black text-[#2c3e50]">
                Mis Clubes Asignados
              </h1>

              <p className="text-slate-500 mt-2">
                Clubes literarios que administras
              </p>

            </div>

          </div>

        </div>

        {/* CLUBES */}
        <div className="grid md:grid-cols-2 gap-6">

          {clubes.length > 0 ? (

            clubes.map((club) => (

              <div
                key={club._id}
                className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100"
              >

                <h2 className="text-2xl font-black text-[#2c3e50] mb-3">
                  {club.nombre}
                </h2>

                <p className="text-slate-600 mb-4">
                  {club.descripcion}
                </p>

                <div className="flex items-center justify-between mb-6">

                  <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold">
                    {club.generoLiterario}
                  </span>

                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                    {club.estadoClub}
                  </span>

                </div>

                <button
                  onClick={() => navigate(`/mis-clubes/${club._id}`)}
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                >

                  <FaEye />

                  Ver Club

                </button>

              </div>

              ))

            ) : (

            <div className="bg-white rounded-3xl shadow-xl p-8">

              <p className="text-slate-500">
                No tienes clubes asignados.
              </p>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}