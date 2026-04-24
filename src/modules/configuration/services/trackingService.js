import axios from "axios";

export function getTrackingOpportunities() {
   return axios.get(`/api/configuration/tracking-opportunities`);
}

export function getTrackingChildren(parentId) {
   return axios.get(`/api/configuration/tracking-opportunities/${parentId}/children`);
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

export function createTrackingChild(payload) {
   return axios.post(`/api/configuration/tracking-opportunities/children`, payload);
}

export function updateTrackingChild(parentId, childId, payload) {
    console.log('[trackingService] updateTrackingChild:', {
        url: `/api/configuration/tracking-opportunity/${parentId}/sub-state`,
        payload: { ...payload, idTracking: childId }
    });
    return axios.put(`/api/configuration/tracking-opportunity/${parentId}/sub-state`, {
        ...payload,
        idTracking: childId,
    });
}

export function toggleTrackingChildState(parentId, childId) {
    console.log('[trackingService] toggleTrackingChildState:', { parentId, childId });
    return axios.put(`/api/configuration/tracking-opportunity/${parentId}/sub-state/${childId}/toggle-state`);
}

export async function deleteTrackingChild(parentId, childId) {
    console.log('[trackingService] deleteTrackingChild:', { parentId, childId });

    const urls = [
        `/api/configuration/tracking-opportunity/${parentId}/sub-state/${childId}/delete`,
        `/api/configuration/tracking-opportunities/children/${childId}`,
    ];

    let lastError;

    for (const url of urls) {
        console.log('[trackingService] Trying DELETE:', url);
        try {
            const result = await axios.delete(url);
            console.log('[trackingService] DELETE success:', url, result.data);
            return result;
        } catch (error) {
            console.log('[trackingService] DELETE failed:', url, error?.response?.status);
            lastError = error;
            const status = error?.response?.status;

            if (status && status !== 404 && status !== 405) {
                throw error;
            }
        }
    }

    throw lastError;
}