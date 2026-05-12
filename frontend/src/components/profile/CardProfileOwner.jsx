export const CardProfileOwner = () => {
    return (
        <div className="bg-white border border-slate-200 h-auto p-4 flex flex-col items-center justify-between shadow-xl rounded-lg">
            <div>
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="usuario" className="m-auto rounded-full" width={120} height={120} />
            </div>
            <div className="self-start">
                <b>Nombre:</b><p className="inline-block ml-3">-</p>
            </div>
            <div className="self-start">
                <b>Correo:</b><p className="inline-block ml-3">-</p>
            </div>
            <div className="self-start">
                <b>Rol:</b><p className="inline-block ml-3">-</p>
            </div>
            <div className="self-start">
                <b>Provincia:</b><p className="inline-block ml-3">-</p>
            </div>
            <div className="self-start">
                <b>Participacion:</b><p className="inline-block ml-3">Pendiente</p>
            </div>
        </div>
    )
}
