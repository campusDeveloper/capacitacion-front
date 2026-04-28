import axios from "axios";

async function request(method, url, data = null, params = null) {
  try {
    const config = {
      method,
      url,
      ...(data !== null && { data }),
      ...(params !== null && { params })
    };
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data?.message || error.response.statusText,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      throw {
        message: 'No se recibió respuesta del servidor',
        status: 0,
        data: null
      };
    } else {
      throw {
        message: error.message,
        status: 0,
        data: null
      };
    }
  }
}

//Ver listado de oportunidades de seguimiento
export function getTrackingOpportunities() {
    return request('get', `/configuration/tracking-opportunities`).then(res => res.data);
}
//ver detalle de oportunidad de seguimiento
export function getTrackingOpportunityDetail(id) {
    return request('get', `/configuration/tracking-opportunity/${id}/detail`);
}
//Crear estado de seguimiento
export function createTrackingOpportunity(payload) {
    return request('post', `/configuration/tracking-opportunity/store`, payload);
}
//Actualizar estado de seguimiento
export function updateTrackingOpportunity(idTracking, payload) {
    return request('put', `/configuration/tracking-opportunity/${idTracking}/update`, payload);
}
//Actualizar estado principal
export function toggleTrackingOpportunityState(idTracking) {
    return request('put', `/configuration/tracking-opportunity/${idTracking}/update-state`);
}
//Eliminar estado
export function deleteTrackingOpportunity(idTracking) {
    return request('delete', `/configuration/tracking-opportunity/${idTracking}/delete`);
}

// Agregar subestado
export function createSubState(idTracking, payload) {
    return request('post', `/configuration/tracking-opportunity/${idTracking}/sub-state`, payload);
}
// Actualizar subestado
export function updateSubState(idTracking, childId, payload) {
    return request('put', `/configuration/tracking-opportunity/${idTracking}/sub-state`, { ...payload, idTracking: childId });
}
// Eliminar subestado
export function deleteSubState(idTracking, idChild) {
    return request('delete', `/configuration/tracking-opportunity/${idTracking}/sub-state/${idChild}/delete`);
}
