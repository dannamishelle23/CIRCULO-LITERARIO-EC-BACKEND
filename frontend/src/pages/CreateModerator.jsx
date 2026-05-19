import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createModerator } from "../services/userService";

export default function CreateModerator() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    provincia: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createModerator(formData);

      alert("Moderador creado correctamente");

      navigate("/admin");

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.msg ||
        "Error al crear moderador"
      );
    }
  };

  return (

    <section className="min-h-screen bg-[#FEF2E1] flex justify-center items-center p-6">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-xl">

        <h1 className="text-3xl font-black text-[#2c3e50] mb-6">
          Crear Moderador
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            name="fechaNacimiento"
            placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            name="provincia"
            placeholder="Provincia"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

           <input
            type="email"
            name="email"
            placeholder="Correo"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-xl"
          >
            Crear Moderador
          </button>

        </form>

      </div>

    </section>
  );
}