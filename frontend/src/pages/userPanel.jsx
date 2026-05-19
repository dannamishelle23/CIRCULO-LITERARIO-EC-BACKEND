import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PanelMenu from "../components/PanelMenu"
import {
  MdAutoStories,
} from "react-icons/md"

export default function UserPanel() {
  const [joinedClub, setJoinedClub] = useState(() => {
    return JSON.parse(localStorage.getItem("joinedClub")) ?? false
  })
  const navigate = useNavigate()

  const usuario = JSON.parse(localStorage.getItem("usuario"))

  useEffect(() => {
    localStorage.setItem("joinedClub", JSON.stringify(joinedClub))
  }, [joinedClub])

  const handleJoinClub = () => {
    setJoinedClub(true)
  }

  return (
    <section className="min-h-screen bg-[#f8f9fa] py-8 px-4 font-sans sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* TOPBAR */}
        <PanelMenu />

        {/* BIENVENIDA */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="bg-amber-50 p-4 rounded-xl text-[#e67e22] border border-amber-100/50">
              <MdAutoStories size={44} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2c3e50] uppercase tracking-tight">
                Panel de <span className="text-[#e67e22]">Lectores</span>
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-2 font-medium">
                ¡Qué bueno verte de nuevo, <span className="capitalize text-gray-700 font-bold">{usuario?.nombres ?? "lector"}</span>! Gestiona tu camino literario hoy.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {!joinedClub ? (
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-8 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-[#2c3e50]">Únete a un Club Literario</h2>
                <p className="mt-3 text-gray-500">
                  Para acceder a la gestión de obras necesitas primero formar parte de un club literario.
                </p>
              </div>
              <button
                onClick={handleJoinClub}
                className="inline-flex items-center justify-center rounded-full bg-[#e67e22] px-8 py-3 text-white font-bold shadow-sm hover:bg-[#d35400] transition"
              >
                Unirte a un club literario
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-8 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-[#2c3e50]">¡Bienvenido al Club!</h2>
                <p className="mt-3 text-gray-500">
                  Ahora puedes continuar a las opciones de obra para publicar o administrar tus piezas.
                </p>
              </div>
              <button
                onClick={() => navigate("/obras")}
                className="inline-flex items-center justify-center rounded-full bg-[#2c3e50] px-8 py-3 text-white font-bold shadow-sm hover:bg-[#1b2836] transition"
              >
                Ver opciones de Obra
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}