import { useNavigate } from "react-router-dom"
import { getStoredSession } from "../utils/auth"
import { MdMenu } from "react-icons/md"

export default function PanelMenu() {
  const navigate = useNavigate()
  const usuario = getStoredSession()
  const inicial = usuario?.nombres ? usuario.nombres.charAt(0).toUpperCase() : "U"

  return (
    <div className="flex justify-end mb-6">
      <button
        type="button"
        onClick={() => navigate("/menu")}
        className="inline-flex items-center gap-3 bg-white border border-gray-200 text-[#2c3e50] px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition"
      >
        <div className="w-8 h-8 rounded-full bg-[#e67e22] text-white flex items-center justify-center font-black">
          {inicial}
        </div>
        <div className="text-left leading-tight">
          <p className="text-sm font-semibold">{usuario?.username ?? "Mi Cuenta"}</p>
          <p className="text-xs text-slate-500">Menú</p>
        </div>
        <MdMenu size={20} className="text-[#2c3e50]" />
      </button>
    </div>
  )
}
