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
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error al crear obra:", error);
    throw error;
  }
};

/*==========================================================================
| OBTENER OBRA
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
| PERFIL AUTOR (SOLO APROBADAS)
==========================================================================*/
export const listarObrasPublicasAutor = async (autorId) => {
  try {
    const response = await api.get(`/obras/autor/${autorId}`);
    return response.data;
  } catch (error) {
    console.error("Error al listar obras del autor:", error);
    throw error;
  }
};

/*==========================================================================
| OBRAS DEL CLUB (TODAS VISIBLES SEGÚN REGLAS BACKEND)
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
| MIS OBRAS EN CLUB
==========================================================================*/
export const listarMisObrasClub = async (clubId) => {
  try {
    const response = await api.get(`/obras/club/${clubId}/mis-obras`);
    return response.data;
  } catch (error) {
    console.error("Error al listar mis obras:", error);
    throw error;
  }
};

/*==========================================================================
| EN REVISIÓN (MODERADOR)
==========================================================================*/
export const listarObrasEnRevision = async (clubId) => {
  try {
    const response = await api.get(`/obras/moderador/${clubId}/en-revision`);
    return response.data;
  } catch (error) {
    console.error("Error en revisión:", error);
    throw error;
  }
};

/*==========================================================================
| APROBADAS (MODERADOR)
==========================================================================*/
export const listarObrasAprobadas = async (clubId) => {
  try {
    const response = await api.get(`/obras/moderador/${clubId}/aprobadas`);
    return response.data;
  } catch (error) {
    console.error("Error aprobadas:", error);
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
    console.error("Error actualizar obra:", error);
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
    console.error("Error postular obra:", error);
    throw error;
  }
};

/*==========================================================================
| APROBAR OBRA (MODERADOR)
==========================================================================*/
export const aprobarObra = async (id) => {
  try {
    const response = await api.post(`/obras/${id}/aprobar`);
    return response.data;
  } catch (error) {
    console.error("Error aprobar obra:", error);
    throw error;
  }
};

/*==========================================================================
| RECHAZAR OBRA (MODERADOR)
==========================================================================*/
export const rechazarObra = async (id, motivo) => {
  try {
    const response = await api.post(`/obras/${id}/rechazar`, {
      motivo,
    });

    return response.data;
  } catch (error) {
    console.error("Error rechazar obra:", error);
    throw error;
  }
};

/*==========================================================================
| INICIAR VOTACIÓN (MODERADOR)
==========================================================================*/
export const iniciarVotacion = async (clubId, obrasIds) => {
  try {
    const response = await api.post(
      `/obras/club/${clubId}/iniciar-votacion`,
      { obrasIds }
    );

    return response.data;
  } catch (error) {
    console.error("Error iniciar votación:", error);
    throw error;
  }
};

/*==========================================================================
| CERRAR VOTACIÓN (MODERADOR)
==========================================================================*/
export const cerrarVotacion = async (clubId) => {
  try {
    const response = await api.post(
      `/obras/club/${clubId}/cerrar-votacion`
    );

    return response.data;
  } catch (error) {
    console.error("Error cerrar votación:", error);
    throw error;
  }
};

/*==========================================================================
| VOTAR OBRA (USUARIOS DEL CLUB)
==========================================================================*/
export const votarObra = async (id) => {
  try {
    const response = await api.post(`/obras/${id}/votar`);
    return response.data;
  } catch (error) {
    console.error("Error al votar obra:", error);
    throw error;
  }
};