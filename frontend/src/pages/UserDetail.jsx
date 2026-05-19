import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  getModeratorById,
  getUserById
} from "../services/userService";

export default function UserDetail() {

  const { id, tipo } = useParams();

  const [user, setUser] = useState(null);

  const fetchUser = async () => {

    try {

      let data;

      if (tipo === "moderador") {

        data = await getModeratorById(id);

      } else {

        data = await getUserById(id);
      }

      setUser(data);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {

    return (

      <div className="min-h-screen flex justify-center items-center">
        Cargando...
      </div>
    );
  }

  return (

    <section className="min-h-screen bg-[#FEF2E1] p-10">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-black text-[#2c3e50] mb-8">

          Detalle del Usuario

        </h1>

        <div className="space-y-5">

          <div>
            <p className="text-slate-500">
              Nombres
            </p>

            <p className="font-bold text-xl">
              {user.nombres}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Apellidos
            </p>

            <p className="font-bold text-xl">
              {user.apellidos}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Email
            </p>

            <p className="font-bold text-xl">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Username
            </p>

            <p className="font-bold text-xl">
              {user.username}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Rol
            </p>

            <p className="font-bold text-xl">
              {user.rol}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Estado
            </p>

            <p className="font-bold text-xl">
              {user.estadoUsuario}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Provincia
            </p>

            <p className="font-bold text-xl">
              {user.provincia}
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}