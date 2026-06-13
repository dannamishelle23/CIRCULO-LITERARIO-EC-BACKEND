import { useState, useEffect } from "react";
import { getClubs } from "../services/clubService";
import { MdUpload } from "react-icons/md";

export default function ObraForm({ clubId, onSubmit, editingObra, onCancel, isLoading }) {
  const [form, setForm] = useState({
    titulo: "",
    sinopsis: "",
    prologo: "",
    subgenero: "",
    club: clubId || ""
  });

  const [portada, setPortada] = useState(null);
  const [portadaPreview, setPortadaPreview] = useState(null);
  const [clubes, setClubes] = useState([]);
  const [loadingClubes, setLoadingClubes] = useState(true);
  const [error, setError] = useState("");
  const [nombreClub, setNombreClub] = useState("");

  // Cargar clubes disponibles (solo si no viene de parámetro)
  useEffect(() => {
    const cargarClubes = async () => {
      try {
        setLoadingClubes(true);
        setError("");
        const misClubes = await getClubs();
        setClubes(misClubes || []);
        
        // Si viene clubId por parámetro, obtener nombre del club
        if (clubId && misClubes) {
          const club = misClubes.find(c => c._id === clubId);
          if (club) {
            setNombreClub(club.nombre);
          }
        }
      } catch (err) {
        console.error("Error al cargar clubes:", err);
        setClubes([]);
      } finally {
        setLoadingClubes(false);
      }
    };

    cargarClubes();
  }, [clubId]);

  // Cargar datos si es edición
  useEffect(() => {
    if (editingObra) {
      setForm({
        titulo: editingObra.titulo || "",
        sinopsis: editingObra.sinopsis || "",
        prologo: editingObra.prologo || "",
        subgenero: editingObra.subgenero || "",
        club: editingObra.club?._id || editingObra.club || ""
      });
      if (editingObra.portada) {
        setPortadaPreview(editingObra.portada);
      }
    }
  }, [editingObra]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handlePortadaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPortada(file);
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => setPortadaPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Mantenemos la validación estricta del prólogo porque SÍ es obligatorio
    if (!form.titulo.trim() || !form.sinopsis.trim() || !form.prologo.trim() || !form.club) {
      setError("Título, sinopsis, prólogo y club son obligatorios");
      return;
    }

    if (!editingObra && !portada) {
      setError("La portada es obligatoria para crear una obra");
      return;
    }

    onSubmit({
      ...form,
      portada
    });

    // Limpiar solo si no hay error
    setForm({
      titulo: "",
      sinopsis: "",
      prologo: "",
      club: ""
    });
    setPortada(null);
    setPortadaPreview(null);
  };

  return (
    <form className="bg-white p-6 rounded-2xl shadow-md" onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LADO IZQUIERDO - FORMULARIO */}
        <div className="space-y-4">
          {/* TÍTULO */}
          <div>
            <label className="block text-sm font-bold text-[#2c3e50] mb-2">
              Título de la obra *
            </label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ej: El viaje infinito"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e67e22]"
            />
          </div>

          {/* SINOPSIS */}
          <div>
            <label className="block text-sm font-bold text-[#2c3e50] mb-2">
              Sinopsis *
            </label>
            <textarea
              name="sinopsis"
              value={form.sinopsis}
              onChange={handleChange}
              placeholder="Resumen breve de tu obra..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e67e22]"
            />
          </div>

          {/* SUBGÉNERO */}
          <div>
            <label className="block text-sm font-bold text-[#2c3e50] mb-2">Subgénero</label>
            <input
              type="text"
              name="subgenero"
              value={form.subgenero}
              onChange={handleChange}
              placeholder="Ej: Fantasía épica, Realismo mágico"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e67e22]"
            />
          </div>

          {/* CLUB */}
          <div>
            <label className="block text-sm font-bold text-[#2c3e50] mb-2">
              Club *
            </label>
            {clubId ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-[#2c3e50] font-semibold">
                {nombreClub || "Cargando club..."}
              </div>
            ) : (
              <select
                name="club"
                value={form.club}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e67e22]"
              >
                <option value="">
                  {loadingClubes ? "Cargando clubes..." : "Selecciona un club"}
                </option>
                {clubes.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* LADO DERECHO - PORTADA */}
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 flex items-center justify-center min-h-[200px]">
            {portadaPreview ? (
              <img
                src={portadaPreview}
                alt="Preview portada"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <MdUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Cargue una imagen</p>
              </div>
            )}
          </div>

          <label className="cursor-pointer">
            <div className="bg-[#e67e22] hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-center transition">
              Seleccionar portada
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePortadaChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* PRÓLOGO - CAMBIO AQUÍ: Ahora dice Prólogo * para denotar obligatoriedad */}
      <div className="mt-4">
        <label className="block text-sm font-bold text-[#2c3e50] mb-2">
          Prólogo *
        </label>
        <textarea
          name="prologo"
          value={form.prologo}
          onChange={handleChange}
          placeholder="Palabras introductorias o dedicatoria..."
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#e67e22]"
        />
      </div>

      {/* BOTONES */}
      <div className="mt-6 flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-[#e67e22] text-white font-bold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : editingObra ? "Actualizar" : "Crear Obra"}
        </button>
      </div>
    </form>
  );
}