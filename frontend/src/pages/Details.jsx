import { useEffect, useState } from "react";
import {
    FaHeart,
    FaStar,
    FaBookOpen,
    FaUserCircle
} from "react-icons/fa";

import {
    createComentario,
    getComentariosByObra,
    deleteComentario
} from "../services/comentarioService";

import {
    votarObra,
    obtenerVotos,
    likeObra,
    obtenerLikes
} from "../services/obraService";

const Details = () => {

    /*STATES*/
    const [comentario, setComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);
    const [likes, setLikes] = useState(0);
    const [votos, setVotos] = useState(0);

    /*ID SIMULADO*/
    const obraId = "123456";

    /*CARGAR COMENTARIOS*/
    const fetchComentarios = async () => {

        try {

            const data = await getComentariosByObra(obraId);

            setComentarios(data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        fetchComentarios();
        fetchVotos();
        fetchLikes();

    }, []);

    const fetchVotos = async () => {

    try {

        const data = await obtenerVotos(
            obraId
        );

        setVotos(data.totalVotos || 0);

    } catch (error) {

        console.error(error);
    }
};

const fetchLikes = async () => {

    try {

        const data = await obtenerLikes(
            obraId
        );

        setLikes(data.totalLikes || 0);

    } catch (error) {

        console.error(error);
    }
};

    /*CREAR COMENTARIO*/
    const handleComentario = async () => {

        if (comentario.trim() === "") return;

        try {

            await createComentario({
                contenido: comentario,
                obraId
            });

            setComentario("");

            fetchComentarios();

        } catch (error) {

            console.error(error);
        }
    };

    const handleVoto = async () => {

    try {

        await votarObra(obraId);

        fetchVotos();

    } catch (error) {

        console.error(error);
    }
};

    const handleLike = async () => {

    try {

        await likeObra(obraId);

        fetchLikes();

    } catch (error) {

        console.error(error);
    }
};

    /*ELIMINAR COMENTARIO*/
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "¿Deseas eliminar este comentario?"
        );

        if (!confirmDelete) return;

        try {

            await deleteComentario(id);

            fetchComentarios();

        } catch (error) {

            console.error(error);
        }
    };

    return (
        <section className="min-h-screen bg-[#FEF2E1] py-12 px-6">

            <div className="max-w-6xl mx-auto">

                {/* HERO */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    {/* PORTADA */}
                    <div className="h-72 bg-gradient-to-r from-amber-700 to-orange-500 flex items-center justify-center">

                        <div className="text-center text-white">

                            <FaBookOpen className="text-7xl mx-auto mb-4" />

                            <h1 className="text-5xl font-black">
                                Sombras del Ayer
                            </h1>

                            <p className="mt-3 text-lg opacity-90">
                                Una historia de misterio y emociones
                            </p>

                        </div>

                    </div>

                    {/* INFO */}
                    <div className="p-8 grid md:grid-cols-3 gap-6">

                        {/* DESCRIPCION */}
                        <div className="md:col-span-2">

                            <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">
                                Descripción
                            </h2>

                            <p className="text-slate-600 leading-relaxed">
                                Esta obra narra el viaje de personajes atrapados
                                entre recuerdos y secretos del pasado. La historia
                                explora emociones humanas, conflictos internos y
                                relaciones profundas dentro de un universo literario
                                lleno de misterio.
                            </p>

                            {/* TAGS */}
                            <div className="flex gap-3 mt-6 flex-wrap">

                                <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    Drama
                                </span>

                                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    Misterio
                                </span>

                                <span className="bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold">
                                    Literatura
                                </span>

                            </div>

                        </div>

                        {/* ESTADISTICAS */}
                        <div className="bg-amber-50 rounded-2xl p-6 shadow-sm">

                            <h3 className="text-xl font-bold text-[#2c3e50] mb-6">
                                Interacciones
                            </h3>

                            <div className="space-y-5">

                                <button
                                    onClick={handleLike}
                                    className="w-full flex items-center justify-between bg-white p-4 rounded-xl hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaHeart className="text-red-500 text-2xl" />
                                        <span className="font-semibold">
                                            Likes
                                        </span>
                                    </div>

                                    <span className="font-bold text-slate-700">
                                        {likes}
                                    </span>
                                </button>

                                <button
                                    onClick={handleVoto}
                                    className="w-full flex items-center justify-between bg-white p-4 rounded-xl hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaStar className="text-amber-500 text-2xl" />
                                        <span className="font-semibold">
                                            Votos
                                        </span>
                                    </div>

                                    <span className="font-bold text-slate-700">
                                        {votos}
                                    </span>
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* COMENTARIOS */}
                <div className="mt-10 bg-white rounded-3xl shadow-xl p-8">

                    <h2 className="text-3xl font-black text-[#2c3e50] mb-6">
                        Comentarios
                    </h2>

                    {/* TEXTAREA */}
                    <div className="bg-amber-50 rounded-2xl p-6">

                        <textarea
                            placeholder="Comparte tu opinión sobre esta obra..."
                            className="w-full rounded-2xl border border-slate-300 p-5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            rows="4"
                            value={comentario}
                            onChange={(e) =>
                                setComentario(e.target.value)
                            }
                        />

                        <div className="flex justify-end mt-4">

                            <button
                                onClick={handleComentario}
                                className="bg-amber-700 text-white px-8 py-3 rounded-2xl hover:bg-amber-600 transition font-semibold"
                            >
                                Publicar comentario
                            </button>

                        </div>

                    </div>

                    {/* LISTA */}
                    <div className="mt-10 space-y-5">

                        {
                            comentarios.length === 0 ? (

                                <div className="text-center py-10">

                                    <FaUserCircle className="text-6xl text-slate-300 mx-auto mb-4" />

                                    <p className="text-slate-500 text-lg">
                                        No existen comentarios todavía
                                    </p>

                                </div>

                            ) : (

                                comentarios.map((item) => (

                                    <div
                                        key={item._id}
                                        className="bg-[#fffaf3] border border-amber-100 rounded-2xl p-6 shadow-sm"
                                    >

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-3">

                                                <FaUserCircle className="text-4xl text-amber-700" />

                                                <div>

                                                    <h4 className="font-bold text-[#2c3e50]">
                                                        {item.usuario?.name || "Usuario"}
                                                    </h4>

                                                    <p className="text-sm text-slate-400">
                                                        Miembro de la comunidad
                                                    </p>

                                                </div>

                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-400 transition"
                                            >
                                                Eliminar
                                            </button>

                                        </div>

                                        <p className="mt-5 text-slate-700 leading-relaxed">
                                            {item.contenido}
                                        </p>

                                    </div>

                                ))
                            )
                        }

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Details;