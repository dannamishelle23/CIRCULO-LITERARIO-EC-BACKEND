const Table = () => {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full table-auto">
                <thead className="bg-[#2c3e50] text-slate-100">
                    <tr>
                        {["N.", "Titulo", "Categoria", "Autor", "Estado", "Acciones"].map((header) => (
                            <th key={header} className="p-3 text-left">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr className="text-slate-600">
                        <td className="p-3">1</td>
                        <td className="p-3">Sin registros</td>
                        <td className="p-3">-</td>
                        <td className="p-3">-</td>
                        <td className="p-3">Pendiente</td>
                        <td className="p-3">-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table
