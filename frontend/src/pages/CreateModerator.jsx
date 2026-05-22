import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createModerator } from "../services/userService";
import { MdArrowBack, MdPersonAdd, MdCheckCircle, MdCancel, MdEmail } from "react-icons/md";

// Listado de provincias de Ecuador
const PROVINCIAS_ECUADOR = [
  "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro", 
  "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", 
  "Manabí", "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", 
  "Santa Elena", "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", "Zamora Chinchipe"
];

export default function CreateModerator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    provincia: "",
    username: "",
    email: "",
  });

  const [status, setStatus] = useState({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  // Cálculos dinámicos de rango de edad (Mínimo 15 años exigidos)
  const hoy = new Date();
  const anioMaximo = hoy.getFullYear() - 15;
  const mesActual = String(hoy.getMonth() + 1).padStart(2, '0');
  const diaActual = String(hoy.getDate()).padStart(2, '0');
  
  // Fecha tope superior: Ej. 2011-05-21 (Cualquier persona nacida después no tiene 15 años)
  const maxDate = `${anioMaximo}-${mesActual}-${diaActual}`;
  // Fecha tope inferior sensata: Año 1940
  const minDate = "1940-01-01";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validación manual del Correo Electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setStatus({ type: "error", msg: "Por favor, ingresa una dirección de correo electrónico válida (Debe contener '@' y un dominio)." });
    }

    // 2. Validación manual de Edad (Doble check de seguridad frontend)
    const fechaNac = new Date(formData.fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const diferenciaMeses = hoy.getMonth() - fechaNac.getMonth();
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    if (edad < 15) {
      return setStatus({ type: "error", msg: "El moderador debe ser mayor de 15 años para administrar el sistema." });
    }

    if (fechaNac.getFullYear() < 1940) {
      return setStatus({ type: "error", msg: "Por favor, ingresa un año de nacimiento real y válido (Mayor a 1940)." });
    }

    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      await createModerator(formData);
      setStatus({ 
        type: "success", 
        msg: "¡Moderador registrado con éxito! Las credenciales temporales han sido despachadas a su correo." 
      });
      
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        msg: error.response?.data?.msg || "Error al registrar el moderador en el sistema."
      });
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "mb-1.5 block text-[10px] font-bold uppercase text-[#2c3e50] tracking-widest";
  const inputStyle = "block w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-700 focus:border-[#e67e22] focus:ring-1 focus:ring-[#e67e22] focus:outline-none transition-all duration-200 shadow-2xs";

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-10 px-4 font-sans sm:px-6 flex flex-col justify-center">
      <div className="max-w-2xl w-full mx-auto">
        
        {/* RETORNO */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-3xs cursor-pointer"
          >
            <MdArrowBack size={16} /> Volver al Panel
          </button>
        </div>

        {/* TARJETA */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-100 p-6 sm:p-8">
          
          <div className="mb-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-[#e67e22] rounded-xl border border-amber-100/50">
              <MdPersonAdd size={28} />
            </div>
            <div>
              <span className="text-[10px] font-black bg-[#e67e22] text-white px-2 py-0.5 rounded-md uppercase tracking-wider">
                Administración
              </span>
              <h1 className="text-xl font-black text-[#2c3e50] uppercase tracking-tight mt-1">
                Registrar Nuevo <span className="text-[#e67e22]">Moderador</span>
              </h1>
            </div>
          </div>

          {status.type && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-semibold border ${
              status.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}>
              <div className="mt-0.5 shrink-0">
                {status.type === "success" ? <MdCheckCircle size={20} /> : <MdCancel size={20} />}
              </div>
              <span>{status.msg}</span>
            </div>
          )}

          <div className="mb-6 p-3.5 bg-blue-50/60 border border-blue-100 text-blue-800 text-xs rounded-xl flex items-center gap-3">
            <MdEmail size={22} className="text-blue-500 shrink-0" />
            <p className="font-medium leading-relaxed">
              <strong>Nota de Envío:</strong> El servidor creará la clave e informará al correo ingresado abajo de manera inmediata.
            </p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nombres y Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  required
                  placeholder="Ej. Juan Carlos"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  required
                  placeholder="Ej. Pérez Armas"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            {/* Fecha de Nacimiento y Provincia */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  required
                  min={minDate}
                  max={maxDate}
                  onChange={handleChange}
                  className={inputStyle}
                />
                <span className="text-[10px] text-gray-400 mt-1 block font-medium">Requerido: Mayor a 15 años.</span>
              </div>
              <div>
                <label className={labelStyle}>Provincia (Ecuador)</label>
                <select
                  name="provincia"
                  required
                  value={formData.provincia}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="" disabled>Selecciona una provincia</option>
                  {PROVINCIAS_ECUADOR.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Username y Correo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Nombre de Usuario</label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Ej. username_moderador"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="ejemplo@dominio.com"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            {/* BOTÓN DE ACCIÓN */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#2c3e50] hover:bg-[#1b2836] text-white font-bold py-3 rounded-xl transition shadow-xs uppercase tracking-wider text-sm mt-4 cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registrando en Sistema..." : "Registrar y Validar Moderador"}
            </button>

          </form>

        </div>
      </div>
    </section>
  );
}