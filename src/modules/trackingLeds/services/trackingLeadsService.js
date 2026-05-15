import axios from "axios";

function apiPrefix() {
  const baseURL = (axios.defaults.baseURL || "").replace(/\/+$/, "");
  const hasApiInBaseURL = baseURL.endsWith("/api");
  return hasApiInBaseURL ? "" : "/api";
}

export function getTrackingLeads(params = {}) {
  const API_URL = `${apiPrefix()}/opportunities/list`;
  return axios.get(API_URL, {
    params,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}

export function getOpportunityComments(idOpportunity) {
  return axios.get(`${apiPrefix()}/opportunity/${idOpportunity}/comments`);
}

export function createOpportunityComment(idOpportunity, payload) {
  return axios.post(`${apiPrefix()}/opportunity/${idOpportunity}/comment`, payload, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}

export function getHeadquarters() {
  return axios.get(`${apiPrefix()}/select/headquarters`, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}

export function getUsers() {
  return axios.get(`${apiPrefix()}/select/users`, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}

export function getOpportunityStates() {
  return axios.get(`${apiPrefix()}/select/states`, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}

export function getTrackingParents() {
  return axios.get(`${apiPrefix()}/select/seguimiento`, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}
