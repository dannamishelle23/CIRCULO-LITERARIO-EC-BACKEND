import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createModerator } from "../services/userService";
import {
  MdArrowBack,
  MdPersonAdd,
  MdCheckCircle,
  MdCancel,
  MdEmail,
  MdPerson,
  MdLocationOn,
  MdCalendarToday,
  MdAccountCircle
} from "react-icons/md";

const PROVINCIAS_ECUADOR = [
  "Azuay","Bolívar","Cañar","Carchi","Chimborazo","Cotopaxi","El Oro",
  "Esmeraldas","Galápagos","Guayas","Imbabura","Loja","Los Ríos",
  "Manabí","Morona Santiago","Napo","Orellana","Pastaza","Pichincha",
  "Santa Elena","Santo Domingo de los Tsáchilas","Sucumbíos",
  "Tungurahua","Zamora Chinchipe"
];

export default function CreateModerator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    provincia: "",
    username: "",
    email: ""
  });

  const [status, setStatus] = useState({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const hoy = new Date();
  const anioMaximo = hoy.getFullYear() - 15;
  const maxDate = `${anioMaximo}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`;
  const minDate = "1940-01-01";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setFieldErrors(prev => ({
      ...prev,
      [e.target.name]: null
    }));
  };

  const validate = () => {
    const errors = {};

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]{2,50}$/.test(formData.nombres)) {
      errors.nombres = ["Solo letras y mínimo 2 caracteres"];
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]{2,50}$/.test(formData.apellidos)) {
      errors.apellidos = ["Solo letras y mínimo 2 caracteres"];
    }

    if (!formData.provincia) {
      errors.provincia = ["Debes seleccionar una provincia"];
    }

    if (!/^[a-zA-Z0-9_]{4,20}$/.test(formData.username)) {
      errors.username = ["4-20 caracteres, solo letras, números y _"];
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = ["Correo inválido"];
    }

    if (!formData.fechaNacimiento) {
      errors.fechaNacimiento = ["Fecha obligatoria"];
    } else {
      const fecha = new Date(formData.fechaNacimiento);
      const edad = hoy.getFullYear() - fecha.getFullYear();
      if (edad < 15) {
        errors.fechaNacimiento = ["Debe ser mayor a 15 años"];
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, msg: "" });

    if (!validate()) return;
    setLoading(true);

    try {
      await createModerator(formData);
      setStatus({
        type: "success",
        msg: "Moderador registrado correctamente."
      });
      setTimeout(() => navigate("/admin"), 2000);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
      }
      setStatus({
        type: "error",
        msg: error.response?.data?.msg || "Error al registrar moderador"
      });
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "mb-1.5 block text-xs font-bold uppercase text-[#34495e] tracking-wider";
  const inputContainerStyle = "relative rounded-xl shadow-xs transition-all duration-200";
  const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors duration-200";
  const inputStyle = "block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-10 pr-4 text-sm text-gray-700 focus:border-[#e67e22] focus:bg-white focus:ring-2 focus:ring-[#e67e22]/20 focus:outline-none transition-all duration-200";
  const errorStyle = "text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1";
  const errorInput = "border-red-300 bg-red-50/10 focus:border-red-500 focus:ring-red-500/20";

  return (
    <section className="min-h-screen bg-[#f4f6f8] py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">

        {/* Botón Volver */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 active:scale-98 transition-all shadow-xs cursor-pointer"
        >
          <MdArrowBack size={16} /> Volver al Panel
        </button>

        {/* Tarjeta Principal */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10">

          {/* Cabecera */}
          <div className="mb-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-[#e67e22] rounded-2xl border border-amber-100 shadow-xs">
              <MdPersonAdd size={30} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#2c3e50] uppercase tracking-wide">
                Registrar Moderador
              </h1>
              <p className="text-xs text-gray-500">Crea una nueva cuenta con permisos de moderación</p>
            </div>
          </div>

          {/* ALERTA DE SISTEMA (MANDAR CREDENCIALES AL CORREO) */}
          <div className="mb-6 p-4 bg-blue-50/80 border border-blue-100 text-blue-900 text-xs sm:text-sm rounded-2xl flex items-start gap-3 shadow-2xs">
            <MdEmail size={22} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Notificación importante:</strong>
              <p className="text-blue-700/90 mt-0.5">
                Una vez completado el registro, el servidor generará y enviará automáticamente las credenciales de acceso al correo electrónico proporcionado.
              </p>
            </div>
          </div>

          {/* Mensajes de Status (Éxito / Servidor Error) */}
          {status.msg && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all shadow-2xs ${
              status.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-red-50 text-red-800 border border-red-100"
            }`}>
              {status.type === "success" ? <MdCheckCircle size={22} className="text-emerald-500" /> : <MdCancel size={22} className="text-red-500" />}
              {status.msg}
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Sección: Información Personal */}
            <div className="bg-gray-50/30 p-4 sm:p-5 rounded-2xl border border-gray-100/80">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Información Personal</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NOMBRES */}
                <div>
                  <label className={labelStyle}>Nombres</label>
                  <div className={inputContainerStyle}>
                    <MdPerson size={18} className={iconStyle} />
                    <input
                      type="text"
                      name="nombres"
                      placeholder="Ej. Juan Carlos"
                      className={`${inputStyle} ${fieldErrors.nombres ? errorInput : ""}`}
                      onChange={handleChange}
                    />
                  </div>
                  {fieldErrors.nombres && (
                    <p className={errorStyle}><MdCancel size={14} /> {fieldErrors.nombres[0]}</p>
                  )}
                </div>

                {/* APELLIDOS */}
                <div>
                  <label className={labelStyle}>Apellidos</label>
                  <div className={inputContainerStyle}>
                    <MdPerson size={18} className={iconStyle} />
                    <input
                      type="text"
                      name="apellidos"
                      placeholder="Ej. Pérez Armas"
                      className={`${inputStyle} ${fieldErrors.apellidos ? errorInput : ""}`}
                      onChange={handleChange}
                    />
                  </div>
                  {fieldErrors.apellidos && (
                    <p className={errorStyle}><MdCancel size={14} /> {fieldErrors.apellidos[0]}</p>
                  )}
                </div>

                {/* FECHA DE NACIMIENTO */}
                <div>
                  <label className={labelStyle}>Fecha de Nacimiento</label>
                  <div className={inputContainerStyle}>
                    <MdCalendarToday size={18} className={iconStyle} />
                    <input
                      type="date"
                      name="fechaNacimiento"
                      min={minDate}
                      max={maxDate}
                      className={`${inputStyle} ${fieldErrors.fechaNacimiento ? errorInput : ""}`}
                      onChange={handleChange}
                    />
                  </div>
                  {fieldErrors.fechaNacimiento && (
                    <p className={errorStyle}><MdCancel size={14} /> {fieldErrors.fechaNacimiento[0]}</p>
                  )}
                </div>

                {/* PROVINCIA */}
                <div>
                  <label className={labelStyle}>Provincia (Ecuador)</label>
                  <div className={inputContainerStyle}>
                    <MdLocationOn size={18} className={iconStyle} />
                    <select
                      name="provincia"
                      className={`${inputStyle} ${fieldErrors.provincia ? errorInput : ""}`}
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una provincia</option>
                      {PROVINCIAS_ECUADOR.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  {fieldErrors.provincia && (
                    <p className={errorStyle}><MdCancel size={14} /> {fieldErrors.provincia[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Credenciales de Cuenta */}
            <div className="bg-gray-50/30 p-4 sm:p-5 rounded-2xl border border-gray-100/80">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Datos de la Cuenta</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* USERNAME */}
                <div>
                  <label className={labelStyle}>Nombre de Usuario</label>
                  <div className={inputContainerStyle}>
                    <MdAccountCircle size={18} className={iconStyle} />
                    <input
                      type="text"
                      name="username"
                      placeholder="Ej. username_moderador"
                      className={`${inputStyle} ${fieldErrors.username ? errorInput : ""}`}
                      onChange={handleChange}
                    />
                  </div>
                  {fieldErrors.username && (
                    <p className={errorStyle}><MdCancel size={14} /> {fieldErrors.username[0]}</p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <label className={labelStyle}>Correo Electrónico</label>
                  <div className={inputContainerStyle}>
                    <MdEmail size={18} className={iconStyle} />
                    <input
                      type="email"
                      name="email"
                      placeholder="ejemplo@dominio.com"
                      className={`${inputStyle} ${fieldErrors.email ? errorInput : ""}`}
                      onChange={handleChange}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className={errorStyle}><MdCancel size={14} /> {fieldErrors.email[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 uppercase text-xs tracking-wider ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#2c3e50] hover:bg-[#1a252f] active:scale-99 hover:shadow-lg hover:shadow-gray-300"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando Registro...
                </>
              ) : (
                <>
                  <MdPersonAdd size={18} /> Registrar Moderador
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </section>
  );
}