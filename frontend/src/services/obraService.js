import api from "./api";

/*OBTENER VOTOS DE UNA OBRA*/
export const obtenerVotos = async (id) => {

    try {

        const response = await api.get(
            `/obras/${id}/votos`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error al obtener votos:",
            error
        );

        throw error;
    }
};

/*VOTAR OBRA*/
export const votarObra = async (id) => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.post(
            `/obras/${id}/votar`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error al votar obra:",
            error
        );

        throw error;
    }
};
/*
|--------------------------------------------------------------------------
| OBTENER LIKES
|--------------------------------------------------------------------------
*/
export const obtenerLikes = async (id) => {

    try {

        const response = await api.get(
            `/obras/${id}/likes`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error al obtener likes:",
            error
        );

        throw error;
    }
};

/*DAR LIKE A OBRA*/
export const likeObra = async (id) => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.post(
            `/obras/${id}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error al dar like:",
            error
        );

        throw error;
    }
};