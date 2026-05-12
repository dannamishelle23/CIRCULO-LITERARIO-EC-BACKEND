const Create = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Crear contenido</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Este modulo se reservara para futuras publicaciones, propuestas de lectura o actividades del circulo.</p>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-slate-700">
                <h2 className="text-2xl font-bold text-[#2c3e50]">Modulo en preparacion</h2>
                <p className="mt-3">
                    El backend actual ya cubre autenticacion, recuperacion de acceso y gestion del perfil. Cuando definamos los endpoints de contenido, esta vista se podra conectar aqui.
                </p>
            </div>
        </div>
    )
}

export default Create
