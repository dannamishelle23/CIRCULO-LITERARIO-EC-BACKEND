const Update = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Actualizar contenido</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Esta pantalla quedara disponible cuando el backend exponga recursos editables mas alla del perfil del usuario.</p>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#2c3e50]">Proximo paso</h2>
                <p className="mt-3 text-slate-600">
                    Si quieres, despues podemos disenar los endpoints para obras, clubes, eventos o publicaciones y conectar esta vista a ese flujo.
                </p>
            </div>
        </div>
    )
}

export default Update
