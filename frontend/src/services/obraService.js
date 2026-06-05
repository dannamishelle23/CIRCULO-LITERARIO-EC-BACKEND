import api from "./api";

/*==========================================================================
| CREAR OBRA
==========================================================================*/
export const crearObra = async (datosObra) => {
    try {
        const formData = new FormData();
        formData.append("titulo", datosObra.titulo);
        formData.append("sinopsis", datosObra.sinopsis);
        formData.append("prologo", datosObra.prologo);
        formData.append("club", datosObra.club);
        if (datosObra.portada) {
            formData.append("portada", datosObra.portada);
        }

        const response = await api.post("/obras", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error al crear obra:", error);
        throw error;
    }
};

/*==========================================================================
| OBTENER OBRA POR ID
==========================================================================*/
export const obtenerObra = async (id) => {
    try {
        const response = await api.get(`/obras/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener obra:", error);
        throw error;
    }
};

/*==========================================================================
| LISTAR OBRAS DE UN CLUB
==========================================================================*/
export const listarObrasClub = async (clubId) => {
    try {
        const response = await api.get(`/obras/club/${clubId}`);
        return response.data;
    } catch (error) {
        console.error("Error al listar obras del club:", error);
        throw error;
    }
};

/*==========================================================================
| ACTUALIZAR OBRA
==========================================================================*/
export const actualizarObra = async (id, datosObra) => {
    try {
        const response = await api.put(`/obras/${id}`, datosObra);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar obra:", error);
        throw error;
    }
};

/*==========================================================================
| POSTULAR OBRA
==========================================================================*/
export const postularObra = async (id) => {
    try {
        const response = await api.post(`/obras/${id}/postular`);
        return response.data;
    } catch (error) {
        console.error("Error al postular obra:", error);
        throw error;
    }
};

/*==========================================================================
| APROBAR OBRA (Moderador)
==========================================================================*/
export const aprobarObra = async (id) => {
    try {
        const response = await api.post(`/obras/${id}/aprobar`);
        return response.data;
    } catch (error) {
        console.error("Error al aprobar obra:", error);
        throw error;
    }
};

/*==========================================================================
| INICIAR VOTACIÓN (Moderador)
==========================================================================*/
export const iniciarVotacion = async (id) => {
    try {
        const response = await api.post(`/obras/${id}/votacion`);
        return response.data;
    } catch (error) {
        console.error("Error al iniciar votación:", error);
        throw error;
    }
};

/*==========================================================================
| OBTENER VOTOS DE UNA OBRA
==========================================================================*/
export const obtenerVotos = async (id) => {
    try {
        const response = await api.get(`/obras/${id}/votos`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener votos:", error);
        throw error;
    }
};

/*==========================================================================
| VOTAR OBRA
==========================================================================*/
export const votarObra = async (id) => {
    try {
        const response = await api.post(`/obras/${id}/votar`, {});
        return response.data;
    } catch (error) {
        console.error("Error al votar obra:", error);
        throw error;
    }
};

/*==========================================================================
| OBTENER LIKES
==========================================================================*/
export const obtenerLikes = async (id) => {
    try {
        const response = await api.get(`/obras/${id}/likes`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener likes:", error);
        throw error;
    }
};

/*==========================================================================
| DAR LIKE A OBRA
==========================================================================*/
export const likeObra = async (id) => {
    try {
        const response = await api.post(`/obras/${id}/like`, {});
        return response.data;
    } catch (error) {
        console.error("Error al dar like:", error);
        throw error;
    }
};