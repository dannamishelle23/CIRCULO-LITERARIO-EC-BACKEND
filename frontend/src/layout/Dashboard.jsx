import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { clearSession, getStoredSession } from '../utils/auth'

const Dashboard = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const urlActual = location.pathname
    const [session, setSession] = useState(() => getStoredSession())

    useEffect(() => {
        setSession(getStoredSession())
    }, [])

    if (!session?.token) {
        return <Navigate to="/login" replace />
    }

    const logout = () => {
        clearSession()
        navigate("/login")
    }

    return (
        <div className='md:flex md:min-h-screen'>
            <div className='md:w-1/5 bg-[#2c3e50] px-5 py-4'>
                <h2 className='text-3xl font-black text-center text-slate-100'>Circulo Literario</h2>

                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="usuario" className="m-auto mt-8 p-1 border-2 border-slate-500 rounded-full" width={120} height={120} />
                <p className='text-slate-300 text-center my-4 text-sm'><span className='bg-green-500 w-3 h-3 inline-block rounded-full mr-2'></span>Bienvenido</p>
                <p className='text-slate-400 text-center my-4 text-sm'>Rol - {session.rol}</p>
                <hr className="mt-5 border-slate-500" />

                <ul className="mt-5">
                    <li className="text-center">
                        <Link to='/dashboard' className={`${urlActual === '/dashboard' ? 'text-slate-100 bg-[#1b2836] px-3 py-2 rounded-md text-center' : 'text-slate-400'} text-xl block mt-2 hover:text-slate-100`}>Perfil</Link>
                    </li>

                    <li className="text-center">
                        <Link to='/dashboard/listar' className={`${urlActual === '/dashboard/listar' ? 'text-slate-100 bg-[#1b2836] px-3 py-2 rounded-md text-center' : 'text-slate-400'} text-xl block mt-2 hover:text-slate-100`}>Listar</Link>
                    </li>

                    <li className="text-center">
                        <Link to='/dashboard/crear' className={`${urlActual === '/dashboard/crear' ? 'text-slate-100 bg-[#1b2836] px-3 py-2 rounded-md text-center' : 'text-slate-400'} text-xl block mt-2 hover:text-slate-100`}>Crear</Link>
                    </li>

                    <li className="text-center">
                        <Link to='/dashboard/chat' className={`${urlActual === '/dashboard/chat' ? 'text-slate-100 bg-[#1b2836] px-3 py-2 rounded-md text-center' : 'text-slate-400'} text-xl block mt-2 hover:text-slate-100`}>Chat</Link>
                    </li>
                </ul>
            </div>

            <div className='flex-1 flex flex-col justify-between h-screen bg-gray-100'>
                <div className='bg-[#2c3e50] py-2 flex md:justify-end items-center gap-5 justify-center px-6'>
                    <div className='text-md font-semibold text-slate-100'>
                        {session.nombres} {session.apellidos}
                    </div>
                    <div>
                        <img src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" alt="avatar" className="border-2 border-green-600 rounded-full" width={50} height={50} />
                    </div>
                    <button
                        type="button"
                        onClick={logout}
                        className="text-white mr-3 text-md block hover:bg-red-900 text-center bg-red-800 px-4 py-1 rounded-lg"
                    >
                        Salir
                    </button>
                </div>
                <div className='overflow-y-scroll p-8'>
                    <Outlet />
                </div>
                <div className='bg-[#2c3e50] h-12'>
                    <p className='text-center text-slate-100 leading-[2.9rem]'>Todos los derechos reservados</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
