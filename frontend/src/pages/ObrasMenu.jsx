import { useNavigate } from "react-router-dom"
import { MdLibraryBooks, MdCreate, MdListAlt } from "react-icons/md"
import { getStoredSession } from "../utils/auth"

export default function ObrasMenu() {
  const navigate = useNavigate()
  const usuario = getStoredSession()

  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#e67e22]">Obras</p>
              <h1 className="mt-3 text-3xl font-black text-[#2c3e50]">Opciones de Obra</h1>
              <p className="mt-2 text-sm text-gray-500">
                {usuario?.nombres ? `${usuario.nombres} ${usuario.apellidos}` : "Usuario"}, elige qué hacer ahora que formas parte de un club literario.
              </p>
            </div>
            <div className="rounded-3xl bg-[#e67e22] p-4 text-white">
              <MdLibraryBooks size={36} />
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <button
            type="button"
            onClick={() => navigate("/crear-obra")}
            className="flex items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-400">Crear Nueva Obra</p>
              <p className="mt-2 text-xl font-bold text-[#2c3e50]">Publica tu siguiente historia</p>
            </div>
            <MdCreate size={32} className="text-[#2c3e50]" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/mis-obras")}
            className="flex items-center justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-400">Administrar Mis Obras</p>
              <p className="mt-2 text-xl font-bold text-[#2c3e50]">Edita, revisa y publica tus obras</p>
            </div>
            <MdListAlt size={32} className="text-[#e67e22]" />
          </button>
        </div>
      </div>
    </section>
  )
}
