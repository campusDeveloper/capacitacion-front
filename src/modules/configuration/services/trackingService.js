import axios from "axios";

export function getTrackingOpportunities() {
   return axios.get(`/api/configuration/tracking-opportunities`);
}

export function getTrackingOpportunityDetail(id) {
   return axios.get(`/api/configuration/tracking-opportunity/${id}/detail`);
}

export function createTrackingOpportunity(payload) {
   return axios.post(`/api/configuration/tracking-opportunity/store`, payload);
}

export function updateTrackingOpportunity(id, payload) {
   return axios.put(`/api/configuration/tracking-opportunity/${id}/update`, payload);
}

export function toggleTrackingOpportunityState(id) {
   return axios.put(`/api/configuration/tracking-opportunity/${id}/update-state`);
}

export function deleteTrackingOpportunity(id) {
   return axios.delete(`/api/configuration/tracking-opportunity/${id}/delete`);
}

export function createTrackingChild(parentId, payload) {
   return axios.post(`/api/configuration/tracking-opportunity/${parentId}/sub-state`, payload);
}

export function updateTrackingChild(parentId, childId, payload) {
    return axios.put(`/api/configuration/tracking-opportunity/${parentId}/sub-state`, {
        ...payload,
        idTracking: childId,
    });
}

export function toggleTrackingChildState(parentId, childId) {
    return axios.put(`/api/configuration/tracking-opportunity/${parentId}/sub-state/${childId}/toggle-state`);
}

export function deleteTrackingChild(parentId, childId) {
    return axios.delete(`/api/configuration/tracking-opportunity/${parentId}/sub-state/${childId}/delete`);
}