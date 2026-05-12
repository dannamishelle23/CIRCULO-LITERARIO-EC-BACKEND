import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          identifier,
          password
        }
      );

      const usuario = response.data.usuario;

      console.log("Usuario recibido:", usuario);
      console.log("Rol recibido:", usuario?.rol);

      localStorage.setItem("token", usuario.token);
      localStorage.setItem("auth", "true");
      localStorage.setItem("usuario", JSON.stringify(usuario));

      alert(response.data.msg);

      // Normaliza el rol
      const rol = usuario?.rol?.toLowerCase();

      if (rol === "admin" || rol === "administrador") {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (error) {
      alert(error.response?.data?.msg || "Error al iniciar sesión");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <input
          type="text"
          placeholder="Correo o usuario"
          className="w-full p-2 mb-3 border rounded"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}