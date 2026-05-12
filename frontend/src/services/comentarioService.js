import api from "./api";

/*OBTENER COMENTARIOS POR OBRA*/
export const getComentariosByObra = async (obraId) => {

    try {

        const response = await api.get(
            `/comentarios/obra/${obraId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error al obtener comentarios:",
            error
        );

        throw error;
    }
};

/*CREAR COMENTARIO*/
export const createComentario = async (data) => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.post(
            "/comentarios",
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error al crear comentario:",
            error
        );

        throw error;
    }
};

/*ELIMINAR COMENTARIO*/
export const deleteComentario = async (id) => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.delete(
            `/comentarios/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error al eliminar comentario:",
            error
        );

        throw error;
    }
};