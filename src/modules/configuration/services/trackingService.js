import axios from "axios";

// Ver listado de oportunidades de seguimiento
export function getTrackingOpportunities() {
  return axios.get(`/configuration/tracking-opportunities`);
}

// Ver detalle de oportunidad de seguimiento
export function getTrackingOpportunityDetail(id) {
  return axios.get(`/configuration/tracking-opportunity/${id}/detail`);
}

// Crear estado de seguimiento
export function createTrackingOpportunity(payload) {
  return axios.post(`/configuration/tracking-opportunity/store`, payload);
}

// Actualizar estado de seguimiento
export function updateTrackingOpportunity(idTracking, payload) {
  return axios.put(`/configuration/tracking-opportunity/${idTracking}/update`, payload);
}

// Actualizar estado principal
export function toggleTrackingOpportunityState(idTracking) {
  return axios.put(`/configuration/tracking-opportunity/${idTracking}/update-state`);
}

// Eliminar estado principal
export function deleteTrackingOpportunity(idTracking) {
  return axios.delete(`/configuration/tracking-opportunity/${idTracking}/delete`);
}

// Agregar subestado
export function createSubState(idTracking, payload) {
  return axios.post(`/configuration/tracking-opportunity/${idTracking}/sub-state`, payload);
}

// Actualizar subestado
export function updateSubState(idTracking, childId, payload) {
  return axios.put(`/configuration/tracking-opportunity/${idTracking}/sub-state`, {
    ...payload,
    idTracking: childId,
  });
}

// Eliminar subestado
export function deleteSubState(idTracking, idChild) {
  return axios.delete(`/configuration/tracking-opportunity/${idTracking}/sub-state/${idChild}/delete`);
}
