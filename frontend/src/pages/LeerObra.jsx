import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { 
  MdArrowBack, 
  MdNavigateBefore, 
  MdNavigateNext, 
  MdMenuBook, 
  MdList, 
  MdFormatSize, 
  MdDarkMode,
  MdLightMode
} from "react-icons/md"
import { getCapitulos } from "../services/capituloService"

export default function LeerObra() {
  const { obraId } = useParams()
  const navigate = useNavigate()
  const contenidoRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [capitulos, setCapitulos] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0) 
  
  // Estados para personalización de lectura
  const [theme, setTheme] = useState("light") // "light", "sepia", "dark"
  const [fontSize, setFontSize] = useState("base") // "sm", "base", "lg", "xl", "2xl"
  const [showTOC, setShowTOC] = useState(false) // Mostrar índice de capítulos
  const [progress, setProgress] = useState(0) // Progreso de lectura de la página

  useEffect(() => {
    const cargarCapitulos = async () => {
      try {
        setLoading(true)
        const res = await getCapitulos(obraId)
        if (res.ok && res.capitulos) {
          const capsOrdenados = res.capitulos.sort((a, b) => a.numeroCapitulo - b.numeroCapitulo)
          setCapitulos(capsOrdenados)
        }
      } catch (error) {
        console.error("Error al cargar capítulos:", error)
        toast.error("No se pudieron cargar los capítulos de la obra")
      } finally {
        setLoading(false)
      }
    }
    cargarCapitulos()
  }, [obraId])

  // Scroll al inicio y reseteo de barra al cambiar de capítulo
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setProgress(0)
  }, [currentIndex])

  // Calcular porcentaje de lectura scrolleada en el capítulo actual
  useEffect(() => {
    const handleScroll = () => {
      if (!contenidoRef.current) return
      const element = contenidoRef.current
      const totalHeight = element.clientHeight - window.innerHeight
      const windowScroll = window.scrollY || document.documentElement.scrollTop
      
      if (totalHeight > 0) {
        const currentProgress = (windowScroll / totalHeight) * 100
        setProgress(Math.min(100, Math.max(0, currentProgress)))
      } else {
        setProgress(100)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Clases dinámicas según el tema seleccionado
  const themeClasses = {
    light: "bg-[#f8f9fa] text-slate-800",
    sepia: "bg-[#fdfbf7] text-[#5c4033]",
    dark: "bg-slate-950 text-slate-200"
  }

  const containerTheme = {
    light: "bg-white border-slate-100 shadow-sm",
    sepia: "bg-[#f9f4eb] border-[#ebdcc4] shadow-sm",
    dark: "bg-slate-900 border-slate-800 shadow-none"
  }

  // Tamaños de fuente
  const fontSizeClasses = {
    sm: "text-sm md:text-base",
    base: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl",
    "2xl": "text-2xl md:text-3xl"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <MdMenuBook size={40} className="text-slate-400" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cargando experiencia de lectura...</p>
        </div>
      </div>
    )
  }

  if (capitulos.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-100 max-w-sm w-full space-y-4 shadow-sm">
          <MdMenuBook size={48} className="mx-auto text-slate-300" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Aún no hay capítulos publicados</p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-3 text-xs font-black bg-slate-800 text-white rounded-xl uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  const capituloActual = capitulos[currentIndex]
  const esUltimoCapitulo = currentIndex === capitulos.length - 1

  return (
    <div className={`min-h-screen font-sans pb-16 transition-colors duration-300 ${themeClasses[theme]}`}>
      
      {/* Barra de Progreso de Lectura */}
      <div className="fixed top-0 left-0 h-1 bg-amber-500 z-50 transition-all duration-150" style={{ width: `${progress}%` }} />

      {/* Barra superior flotante (E-reader Header) */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md bg-opacity-95 transition-colors duration-300 ${containerTheme[theme]}`}>
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Botón Volver */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer active:scale-95"
          >
            <MdArrowBack size={16} /> <span className="hidden sm:inline">Biblioteca</span>
          </button>

          {/* Título de Obra / Capítulo */}
          <div className="flex-1 text-center truncate px-2">
            <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-amber-100">
              Capítulo {capituloActual?.numeroCapitulo}
            </span>
            <h2 className="text-sm font-black truncate mt-1 opacity-90">
              {capituloActual?.titulo}
            </h2>
          </div>

          {/* Opciones de Personalización */}
          <div className="flex items-center gap-1">
            
            {/* Selector de Tamaño de Fuente */}
            <div className="relative group">
              <button className="p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer text-slate-600">
                <MdFormatSize size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 hidden group-hover:flex flex-col gap-1 z-50 text-xs font-bold text-slate-700">
                <button onClick={() => setFontSize("sm")} className="px-4 py-2 hover:bg-slate-50 text-left cursor-pointer flex justify-between">Chica <span>A-</span></button>
                <button onClick={() => setFontSize("base")} className="px-4 py-2 hover:bg-slate-50 text-left cursor-pointer flex justify-between">Mediana <span>A</span></button>
                <button onClick={() => setFontSize("lg")} className="px-4 py-2 hover:bg-slate-50 text-left cursor-pointer flex justify-between">Grande <span>A+</span></button>
                <button onClick={() => setFontSize("2xl")} className="px-4 py-2 hover:bg-slate-50 text-left cursor-pointer flex justify-between">Enorme <span>A++</span></button>
              </div>
            </div>

            {/* Selector de Temas */}
            <div className="relative group">
              <button className="p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer text-slate-600">
                <MdDarkMode size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 hidden group-hover:flex flex-col gap-1 z-50 text-xs font-bold text-slate-700">
                <button onClick={() => setTheme("light")} className="px-4 py-2 hover:bg-slate-50 text-left cursor-pointer flex items-center justify-between">Claro <span className="w-4 h-4 rounded-full border border-slate-300 bg-slate-50"></span></button>
                <button onClick={() => setTheme("sepia")} className="px-4 py-2 hover:bg-slate-50 text-left cursor-pointer flex items-center justify-between">Sepia <span className="w-4 h-4 rounded-full border border-[#ebdcc4] bg-[#fdfbf7]"></span></button>
                <button onClick={() => setTheme("dark")} className="px-4 py-2 hover:bg-slate-50 text-left cursor-pointer flex items-center justify-between">Oscuro <span className="w-4 h-4 rounded-full border border-slate-700 bg-slate-950"></span></button>
              </div>
            </div>

            {/* Botón de Índice (Menú lateral de caps) */}
            <button 
              onClick={() => setShowTOC(!showTOC)}
              className="p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer text-slate-600 relative"
            >
              <MdList size={22} />
            </button>

          </div>
        </div>
      </header>

      {/* Panel Desplegable: Índice de capítulos (Tabla de contenidos) */}
      {showTOC && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Fondo oscuro traslúcido */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setShowTOC(false)} />
          
          {/* Panel Lateral */}
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col border-l border-slate-100">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">Índice de Capítulos</span>
              <button 
                onClick={() => setShowTOC(false)}
                className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {capitulos.map((cap, idx) => (
                <button
                  key={cap._id}
                  onClick={() => {
                    setCurrentIndex(idx)
                    setShowTOC(false)
                  }}
                  className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-center justify-between border ${
                    idx === currentIndex 
                      ? "bg-amber-50 border-amber-200 text-amber-800 font-black text-xs" 
                      : "bg-white border-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">Cap. {cap.numeroCapitulo} - {cap.titulo}</span>
                  {idx === currentIndex && <span className="text-amber-500 text-lg leading-none">•</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenedor principal de lectura */}
      <main className="max-w-3xl mx-auto px-4 mt-8 space-y-8">
        
        <article 
          ref={contenidoRef}
          className={`rounded-3xl border p-8 md:p-12 transition-all duration-300 font-serif space-y-6 shadow-sm ${containerTheme[theme]} ${fontSizeClasses[fontSize]}`}
        >
          {/* Título de cabecera dentro de la página */}
          <div className="border-b border-slate-200/40 pb-6 space-y-2 text-center">
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-100/50">
              Capítulo {capituloActual?.numeroCapitulo}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight pt-2">
              {capituloActual?.titulo}
            </h1>
          </div>

          {/* Cuerpo o Contenido del libro */}
          <div className="leading-relaxed whitespace-pre-wrap min-h-[400px] text-justify">
            {capituloActual?.contenido}
          </div>
        </article>

        {/* Barra de Navegación (Anterior / Siguiente estilo minimalista) */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors duration-300 ${containerTheme[theme]}`}>
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl transition cursor-pointer ${
              currentIndex === 0 
                ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-50" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 border-transparent"
            }`}
          >
            <MdNavigateBefore size={18} /> Anterior
          </button>

          <span className="text-[10px] font-extrabold tracking-widest text-slate-400">
            {currentIndex + 1} / {capitulos.length}
          </span>

          <button
            onClick={() => {
              if (esUltimoCapitulo) {
                toast.info("¡Has llegado al final de la lectura!")
              } else {
                setCurrentIndex(prev => Math.min(capitulos.length - 1, prev + 1))
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider bg-amber-600 px-5 py-3.5 rounded-xl transition cursor-pointer active:scale-95 hover:bg-amber-500 shadow-sm shadow-amber-900/10"
          >
            {esUltimoCapitulo ? "Finalizar" : "Siguiente"} <MdNavigateNext size={18} />
          </button>
        </div>

      </main>
    </div>
  )
}