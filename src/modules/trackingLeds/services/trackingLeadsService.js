import axios from "axios";

function apiPrefix() {
  const baseURL = (axios.defaults.baseURL || "").replace(/\/+$/, "");
  const hasApiInBaseURL = baseURL.endsWith("/api");
  return hasApiInBaseURL ? "" : "/api";
}

export function getTrackingLeads(params = {}) {
  return axios.get(`${apiPrefix()}/opportunities/list`, { params });
}

export function getOpportunityComments(idOpportunity) {
  return axios.get(`${apiPrefix()}/opportunity/${idOpportunity}/comments`);
}

export function getCustomerMessagesHistory(idCustomer) {
  return axios.get(`${apiPrefix()}/customer/${idCustomer}/messages-history`);
}

export function createOpportunityComment(idOpportunity, payload) {
  return axios.post(`${apiPrefix()}/opportunity/${idOpportunity}/comment`, payload);
}

export function changeOpportunityState(idOpportunity, payload) {
  return axios.put(`${apiPrefix()}/opportunity/${idOpportunity}/change-state`, payload);
}

export function changeAssignedUser(idOpportunity, payload) {
  return axios.put(`${apiPrefix()}/opportunity/${idOpportunity}/change-user`, payload);
}

export function getHeadquarters() {
  return axios.get(`${apiPrefix()}/select/headquarters`);
}

export function getUsers() {
  return axios.get(`${apiPrefix()}/select/users`);
}

export function getOpportunityStates() {
  return axios.get(`${apiPrefix()}/select/states`);
}

export function getTrackingParents() {
  return axios.get(`${apiPrefix()}/select/seguimiento`);
}
