export const CardProfile = ({ profile }) => {
    return (
        <div className="bg-white border border-slate-200 h-auto p-6 flex flex-col items-center justify-between shadow-xl rounded-lg">
            <div className="relative">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="avatar del usuario" className="m-auto rounded-full border-2 border-gray-300" width={120} height={120} />
            </div>

            <div className="self-start mt-6 w-full">
                <b>Nombre:</b><p className="inline-block ml-3">{profile?.nombres ?? "-"}</p>
            </div>
            <div className="self-start w-full">
                <b>Apellido:</b><p className="inline-block ml-3">{profile?.apellidos ?? "-"}</p>
            </div>
            <div className="self-start w-full">
                <b>Provincia:</b><p className="inline-block ml-3">{profile?.provincia ?? "-"}</p>
            </div>
            <div className="self-start w-full">
                <b>Usuario:</b><p className="inline-block ml-3">{profile?.username ?? "-"}</p>
            </div>
            <div className="self-start w-full">
                <b>Correo:</b><p className="inline-block ml-3">{profile?.email ?? "-"}</p>
            </div>
            <div className="self-start w-full">
                <b>Rol:</b><p className="inline-block ml-3">{profile?.rol ?? "-"}</p>
            </div>
        </div>
    )
}
