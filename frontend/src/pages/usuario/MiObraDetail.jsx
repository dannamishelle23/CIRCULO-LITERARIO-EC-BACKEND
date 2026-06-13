import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerObra, actualizarObra, postularObra } from "../../services/obraService";
import {
  getCapitulos,
  createCapitulo,
  updateCapitulo,
  deleteCapitulo,
} from "../../services/capituloService";

import {
  MdArrowBackIosNew,
  MdAdd,
  MdEdit,
  MdDelete,
  MdSend,
  MdBook,
  MdClose,
  MdImage
} from "react-icons/md";

export default function MiObraDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [obra, setObra] = useState(null);
  const [capitulos, setCapitulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    numeroCapitulo: "",
  });

  const [editando, setEditando] = useState(null);
  const [metaForm, setMetaForm] = useState({
    titulo: "",
    sinopsis: "",
    prologo: "",
    subgenero: "",
  });
  const [metaPortada, setMetaPortada] = useState(null);
  const [metaPortadaPreview, setMetaPortadaPreview] = useState(null);
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaMessage, setMetaMessage] = useState("");
  const [metaType, setMetaType] = useState("success");
  const [metaLoading, setMetaLoading] = useState(false);

  useEffect(() => {
    cargarData();
  }, [id]);

  const cargarData = async () => {
    try {
      setLoading(true);
      const obraRes = await obtenerObra(id);
      const capsRes = await getCapitulos(id);

      setObra(obraRes.obra);
      if (obraRes.obra) {
        setMetaForm({
          titulo: obraRes.obra.titulo || "",
          sinopsis: obraRes.obra.sinopsis || "",
          prologo: obraRes.obra.prologo || "",
          subgenero: obraRes.obra.subgenero || "",
        });
        setMetaPortada(null);
        setMetaPortadaPreview(obraRes.obra.portada || null);
      }
      
      // Ordenar capítulos numéricamente
      const capsOrdenados = (capsRes.capitulos || []).sort(
        (a, b) => Number(a.numeroCapitulo) - Number(b.numeroCapitulo)
      );
      setCapitulos(capsOrdenados);
    } catch (err) {
      console.error("Error al cargar la obra:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCap = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.contenido || !form.numeroCapitulo) return;

    try {
      setProcesando(true);
      if (editando) {
        await updateCapitulo(editando, form);
      } else {
        await createCapitulo(id, form);
      }

      limpiarFormulario();
      await cargarData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  const limpiarFormulario = () => {
    setForm({ titulo: "", contenido: "", numeroCapitulo: "" });
    setEditando(null);
  };

  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    setMetaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetaPortadaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMetaPortada(file);
      const reader = new FileReader();
      reader.onload = (event) => setMetaPortadaPreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitMeta = async (e) => {
    e.preventDefault();
    if (!metaForm.titulo.trim() || !metaForm.sinopsis.trim() || !metaForm.prologo.trim()) {
      setMetaMessage("Título, sinopsis y prólogo son obligatorios.");
      setMetaType("error");
      return;
    }

    try {
      setMetaLoading(true);
      const payload = {
        titulo: metaForm.titulo,
        sinopsis: metaForm.sinopsis,
        prologo: metaForm.prologo,
        subgenero: metaForm.subgenero,
      };
      if (metaPortada) {
        payload.portada = metaPortada;
      }
      const res = await actualizarObra(id, payload);

      if (res.ok) {
        setMetaMessage("Obra actualizada correctamente.");
        setMetaType("success");
        setEditingMeta(false);
        await cargarData();
      } else {
        setMetaMessage(res.msg || "Error al actualizar la obra.");
        setMetaType("error");
      }
    } catch (err) {
      console.error(err);
      setMetaMessage(err.response?.data?.msg || "Error al actualizar la obra.");
      setMetaType("error");
    } finally {
      setMetaLoading(false);
    }
  };

  const handleDelete = async (capId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este capítulo?")) return;
    try {
      await deleteCapitulo(capId);
      await cargarData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostular = async () => {
    try {
      setProcesando(true);
      await postularObra(id);
      await cargarData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  const tieneCapitulosMinimos = capitulos.length >= 3;
  const puedePostular = obra?.estado === "Borrador" && tieneCapitulosMinimos;
  const puedeEditarMeta = obra && !["EnRevision", "EnVotacion", "Publicada"].includes(obra.estado);
  const puedeEditarCapitulos = obra && !["EnRevision", "EnVotacion", "Publicada"].includes(obra.estado);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e67e22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2c3e50]">Cargando obra...</p>
        </div>
      </div>
    );
  }

  if (!obra) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-sans">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Obra no encontrada</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* BOTÓN VOLVER */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#2c3e50] hover:bg-gray-50 transition shadow-3xs cursor-pointer active:scale-98"
          >
            <MdArrowBackIosNew size={12} /> Volver
          </button>
        </div>

        {/* HEADER DE LA OBRA CON PORTADA MINI */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs">
          <div className="flex items-start gap-4">
            
            {/* PORTADA EN CHIQUITITO */}
            <div className="w-16 h-24 sm:w-20 sm:h-28 bg-slate-100 rounded-lg overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center shadow-3xs">
              {obra.portada ? (
                <img 
                  src={obra.portada} 
                  alt={`Portada de ${obra.titulo}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <MdImage size={24} className="text-gray-300" />
              )}
            </div>

            {/* TEXTOS DE LA OBRA */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                  obra.estado === "Borrador" 
                    ? "bg-amber-50 text-amber-600 border-amber-100" 
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  {obra.estado}
                </span>
              </div>
              
              <h1 className="text-xl sm:text-2xl font-black text-[#2c3e50] truncate uppercase tracking-tight">
                {obra.titulo}
              </h1>

              <p className="text-xs text-gray-500 font-medium pt-1">
                {obra.sinopsis || "Sin sinopsis registrada."}
              </p>
            </div>
          </div>
        </div>

        {/* METADATOS DE OBRA */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">Sinopsis</p>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {obra.sinopsis || "Sin sinopsis registrada."}
              </p>
            </div>
            {puedeEditarMeta && (
              <button
                type="button"
                onClick={() => setEditingMeta((prev) => !prev)}
                className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-[#e67e22] bg-[#e67e22] text-white hover:bg-orange-600 transition"
              >
                {editingMeta ? "Cancelar" : "Editar Obra"}
              </button>
            )}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">Prólogo</p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {obra.prologo || "Sin prólogo registrado."}
            </p>
          </div>

          {editingMeta && puedeEditarMeta && (
            <form onSubmit={handleSubmitMeta} className="space-y-4 pt-4 border-t border-gray-100">
              {metaMessage && (
                <div className={`rounded-2xl p-3 text-sm ${metaType === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                  {metaMessage}
                </div>
              )}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Título</label>
                  <input
                    name="titulo"
                    value={metaForm.titulo}
                    onChange={handleMetaChange}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#e67e22]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Sinopsis</label>
                  <textarea
                    name="sinopsis"
                    rows={3}
                    value={metaForm.sinopsis}
                    onChange={handleMetaChange}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#e67e22]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Prólogo</label>
                  <textarea
                    name="prologo"
                    rows={4}
                    value={metaForm.prologo}
                    onChange={handleMetaChange}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#e67e22]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Subgénero</label>
                  <input
                    name="subgenero"
                    value={metaForm.subgenero}
                    onChange={handleMetaChange}
                    placeholder="Ej: Fantasía épica, Realismo mágico"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#e67e22]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Portada</label>
                  <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-100 h-28 flex items-center justify-center">
                    {metaPortadaPreview ? (
                      <img
                        src={metaPortadaPreview}
                        alt="Portada obra"
                        className="h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-gray-500 uppercase tracking-widest">
                        Cargar portada
                      </div>
                    )}
                  </div>
                  <label className="inline-flex items-center justify-center w-full px-4 py-3 rounded-2xl border border-dashed border-gray-300 bg-white text-xs font-black uppercase tracking-widest text-[#2c3e50] cursor-pointer hover:bg-gray-50 transition">
                    Seleccionar portada
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMetaPortadaChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMeta(false)}
                  className="rounded-2xl border border-gray-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={metaLoading}
                  className="rounded-2xl bg-[#e67e22] px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {metaLoading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-span-2 space-y-6">
            
            {puedeEditarCapitulos ? (
              <form 
                onSubmit={handleSubmitCap}
                className={`bg-white p-6 rounded-2xl border transition-all shadow-2xs space-y-4 ${
                  editando ? "border-amber-200 bg-amber-50/10" : "border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#2c3e50]">
                    {editando ? "Editar Capítulo" : "Agregar Nuevo Capítulo"}
                  </h2>

                  {editando && (
                    <button
                      type="button"
                      onClick={limpiarFormulario}
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg transition"
                    >
                      <MdClose size={12} /> Cancelar Edición
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Título del Capítulo</label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre del capítulo"
                      className="w-full border border-gray-200 p-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-[#e67e22] transition bg-gray-50/40"
                      value={form.titulo}
                      onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">N° Capítulo</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Ej. 1"
                      className="w-full border border-gray-200 p-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-[#e67e22] transition bg-gray-50/40 text-center"
                      value={form.numeroCapitulo}
                      onChange={(e) => setForm({ ...form, numeroCapitulo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Contenido</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Escribe el cuerpo del capítulo aquí..."
                    className="w-full border border-gray-200 p-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#e67e22] transition bg-gray-50/40 leading-relaxed"
                    value={form.contenido}
                    onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={procesando}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e67e22] border border-[#e67e22] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 transition disabled:opacity-50 cursor-pointer active:scale-98"
                  >
                    <MdAdd size={16} />
                    {editando ? "Actualizar" : "Agregar"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs text-center py-8">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Edición Deshabilitada
                </p>
                <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto mt-1">
                  La obra está en {obra.estado === "EnRevision" ? "revisión" : obra.estado === "EnVotacion" ? "votación" : "publicada"} y no admite cambios.
                </p>
              </div>
            )}

            {/* BOTÓN O BARRA DE POSTULACIÓN */}
            {obra.estado === "Borrador" && (
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
                tieneCapitulosMinimos ? "bg-emerald-50/40 border-emerald-100" : "bg-gray-50/60 border-gray-100"
              }`}>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-[#2c3e50] uppercase tracking-wider">
                    Postulación al Club
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    {tieneCapitulosMinimos 
                      ? "Tu obra cumple con el mínimo de 3 capítulos requeridos." 
                      : `Llevas ${capitulos.length} de 3 capítulos mínimos requeridos para postular.`}
                  </p>
                </div>

                {puedePostular ? (
                  <button
                    type="button"
                    onClick={handlePostular}
                    disabled={procesando}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 border border-emerald-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-emerald-700 transition shadow-3xs cursor-pointer active:scale-98 shrink-0"
                  >
                    <MdSend size={14} /> Postular Obra
                  </button>
                ) : (
                  <div className="w-full sm:w-32 bg-gray-200 rounded-full h-2 overflow-hidden shrink-0">
                    <div 
                      className="bg-orange-400 h-full transition-all duration-300" 
                      style={{ width: `${Math.min((capitulos.length / 3) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: LISTA DE CAPÍTULOS */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-[#2c3e50]">
                <MdBook size={14} className="text-[#e67e22]" />
                <h2 className="text-xs font-black uppercase tracking-widest">
                  Capítulos ({capitulos.length})
                </h2>
              </div>

              {capitulos.length === 0 ? (
                <p className="text-xs font-medium text-gray-400 text-center py-4 uppercase tracking-wider">
                  No hay capítulos aún
                </p>
              ) : (
                <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                  {capitulos.map((c) => (
                    <div
                      key={c._id}
                      className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-gray-50 transition gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#2c3e50] truncate">
                          <span className="text-[#e67e22] mr-1">Cap. {c.numeroCapitulo}:</span> {c.titulo}
                        </p>
                      </div>

                      {obra.estado === "Borrador" && (
                        <div className="flex gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditando(c._id);
                              setForm({
                                titulo: c.titulo,
                                contenido: c.contenido,
                                numeroCapitulo: c.numeroCapitulo,
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg transition cursor-pointer"
                          >
                            <MdEdit size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(c._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                          >
                            <MdDelete size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}