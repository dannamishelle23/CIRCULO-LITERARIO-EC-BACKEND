import { useEffect, useState } from "react";

import PanelMenu from "../../components/PanelMenu";

import {
  createClub,
  getClubs,
  assignModerator
} from "../../services/clubService";

import {
  getModerators
} from "../../services/userService";

import {
  FaBookOpen,
  FaPlus,
  FaUserCheck
} from "react-icons/fa";

export default function ManageClubs() {

  const [clubes, setClubes] = useState([]);

  const [moderadores, setModeradores] = useState([]);

  const [nombre, setNombre] = useState("");

  const [generoLiterario, setGeneroLiterario] = useState("");

  const [descripcion, setDescripcion] = useState("");

  /* ========================= */
  /* OBTENER DATOS */
  /* ========================= */

  const fetchData = async () => {

    try {

      const clubesData = await getClubs();

      const moderadoresData =
        await getModerators();

      setClubes(clubesData);

      setModeradores(
        moderadoresData.filter(
          (mod) =>
            mod.estadoUsuario === "Activo"
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ========================= */
  /* CREAR CLUB */
  /* ========================= */

  const handleCreateClub = async (e) => {

    e.preventDefault();

    try {

      await createClub({
        nombre,
        generoLiterario,
        descripcion
      });

      setNombre("");
      setDescripcion("");

      fetchData();

    } catch (error) {
      console.error(error);
    }
  };

  /* ========================= */
  /* ASIGNAR MODERADOR */
  /* ========================= */

  const handleAssignModerator = async (
    clubId,
    moderadorId
  ) => {

    if (!moderadorId) return;

    try {

      await assignModerator(
        clubId,
        moderadorId
      );

      fetchData();

    } catch (error) {
      console.error(error);
    }
  };

  return (

    <section className="min-h-screen bg-[#FEF2E1] py-12 px-6">

      <div className="max-w-7xl mx-auto">

        <PanelMenu />

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

          <div className="flex items-center gap-4">

            <div className="bg-amber-100 p-5 rounded-2xl">

              <FaBookOpen className="text-5xl text-amber-700" />

            </div>

            <div>

              <h1 className="text-4xl font-black text-[#2c3e50]">
                Gestión de Clubes
              </h1>

              <p className="text-slate-500 mt-2">
                Crea clubes y asigna moderadores
              </p>

            </div>

          </div>

        </div>

        {/* CREAR CLUB */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

          <div className="flex items-center gap-3 mb-6">

            <FaPlus className="text-amber-700 text-2xl" />

            <h2 className="text-2xl font-black text-[#2c3e50]">
              Crear Nuevo Club
            </h2>

          </div>

          <form
            onSubmit={handleCreateClub}
            className="grid md:grid-cols-2 gap-6"
          >

            <input
              type="text"
              placeholder="Nombre del club"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
              required
            />

            <input
              type="text"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
              required
            />

            <select
              value={generoLiterario}
              onChange={(e) =>
                setGeneroLiterario(e.target.value)
              }
              className="border border-slate-300 rounded-xl px-4 py-3"
              required
            >

              <option value="">
                Seleccionar género
              </option>

              <option value="Fantasia">
                Fantasía
              </option>

              <option value="Romance">
                Romance
              </option>

              <option value="Poesia">
                Poesía
              </option>

              <option value="Terror">
                Terror
              </option>

              <option value="Ciencia Ficcion">
                Ciencia Ficción
              </option>

          </select>

            <div className="md:col-span-2 flex justify-end">

              <button
                type="submit"
                className="bg-amber-700 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition"
              >
                Crear Club
              </button>

            </div>

          </form>

        </div>

        {/* LISTA CLUBES */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-amber-700 text-white px-6 py-4">

            <h2 className="text-2xl font-bold">
              Clubes Disponibles
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="bg-amber-100">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Club
                  </th>

                  <th className="px-6 py-4 text-left">
                    Descripción
                  </th>

                  <th className="px-6 py-4 text-center">
                    Moderador
                  </th>

                  <th className="px-6 py-4 text-center">
                    Asignar
                  </th>

                </tr>

              </thead>

              <tbody>

                {clubes.map((club) => (

                  <tr
                    key={club._id}
                    className="border-b border-slate-200"
                  >

                    <td className="px-6 py-5 font-bold">
                      {club.nombre}
                    </td>

                    <td className="px-6 py-5">
                      {club.descripcion}
                    </td>

                    <td className="px-6 py-5 text-center">

                      {
                        club.moderadores?.length > 0
                          ? club.moderadores.map(
                            (mod) => `${mod.nombres} ${mod.apellidos}`
                          ).join(", ")
                          : "Sin asignar"
                      }

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <select
                          onChange={(e) =>
                            handleAssignModerator(
                              club._id,
                              e.target.value
                            )
                          }
                          className="border border-slate-300 rounded-xl px-3 py-2 w-full"
                          defaultValue=""
                        >

                          <option value="">
                            Seleccionar moderador
                          </option>

                          {moderadores.map((mod) => (

                            <option
                              key={mod._id}
                              value={mod._id}
                            >
                              {mod.nombres} {mod.apellidos}
                            </option>

                          ))}

                        </select>

                        <FaUserCheck className="text-amber-700" />

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </section>
  );
}