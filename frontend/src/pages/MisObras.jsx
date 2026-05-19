import { MdBook, MdSearch } from "react-icons/md"

export default function MisObras() {
  return (
    <section className="min-h-screen bg-[#FEF2E1] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#e67e22]">Mis Obras</p>
              <h1 className="mt-3 text-3xl font-black text-[#2c3e50]">Administrar tus obras</h1>
              <p className="mt-2 text-sm text-gray-500">
                Este espacio te permitirá ver y gestionar tus publicaciones literarias.
              </p>
            </div>
            <div className="rounded-3xl bg-[#2c3e50] p-4 text-white">
              <MdBook size={36} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          <MdSearch size={48} className="mx-auto text-[#e67e22]" />
          <h2 className="mt-6 text-2xl font-bold text-[#2c3e50]">Tus obras estarán aquí</h2>
          <p className="mt-3 text-gray-500">
            Una vez que publiques obras, podrás revisarlas, editarlas y ver su progreso desde esta pantalla.
          </p>
        </div>
      </div>
    </section>
  )
}
