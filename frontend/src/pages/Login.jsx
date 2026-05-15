import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/authService";

export default function Login() {

  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {

    try {

      const response = await login({
        identifier,
        password
      });

      alert(response.msg);

      const rol = response.usuario?.rol?.toLowerCase();

      if (rol === "administrador") {

        navigate("/admin");

      } else {

        navigate("/home");
      }

    } catch (error) {

      alert(
        error.response?.data?.msg ||
        "Error al iniciar sesión"
      );

      console.error(error);
    }
  };

  return (

    <div className="flex h-screen justify-center items-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow w-80">

        <h2 className="text-2xl font-bold text-center mb-4">
          Login
        </h2>

        <input
          type="text"
          placeholder="Correo o nombre de usuario"
          className="w-full p-2 mb-3 border rounded"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        {/* Password */}
        <div className="relative mb-3">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full p-2 border rounded pr-20"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-amber-600 hover:text-amber-800 uppercase"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>

        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition-colors"
        >
          Ingresar
        </button>

      </div>

    </div>
  );
}