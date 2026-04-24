import axios from "axios";

const baseURL = (axios.defaults.baseURL || "").replace(/\/+$/, "");
const hasApiInBaseURL = baseURL.endsWith("/api");
const API_URL = `${hasApiInBaseURL ? "" : "/api"}/configuration/state-oportunity`;

export function getAllOpportunityStates() {
  return axios.get(API_URL);
}

export function createOpportunityState(payload) {
  return axios.post(API_URL, payload);
}

export function updateOpportunityState(id, payload) {
  return axios.put(`${API_URL}/${id}/update`, payload);
}

export function switchOpportunityStatus(id) {
  return axios.put(`${API_URL}/${id}/state`);
}

export function deleteOpportunityState(id) {
  return axios.delete(`${API_URL}/${id}/delete`);
}
