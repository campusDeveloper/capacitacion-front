import axios from "axios";

export function getChatLeads(params = {}) {
	return axios.get("/chats/leads", { params });
}

export function getLeadMessages(idOpportunity, page = 1) {
	return axios.get(`/opportunity/${idOpportunity}/chat-messages`, {
		params: { page },
	});
}

export function toggleLeadMode(idOpportunity) {
	return axios.post(`/chats/leads/${idOpportunity}/mode`);
}

export function sendLeadMessage(idOpportunity, content) {
	return axios.post(`/chats/leads/${idOpportunity}`, { content });
}

export function getLeadInformation(idOpportunity) {
	return axios.get(`/chats/leads/${idOpportunity}/information`);
}

export function getOpportunityComments(idOpportunity) {
	return axios.get(`/opportunity/${idOpportunity}/comments`);
}

export function createOpportunityComment(idOpportunity, comment) {
	return axios.post(`/opportunity/${idOpportunity}/comment`, { comment });
}

export function updateLeadAssignedUser(idOpportunity, idUserAssigned) {
	return axios.put(`/chats/leads/${idOpportunity}`, { idUserAssigned });
}

export function getHeadquartersOptions() {
	return axios.get("/select/headquarters");
}

export function getExceptionsOptions() {
	return axios.get("/select/exception");
}

export function getTrackingOptions() {
	return axios.get("/select/opportunity-tracking");
}

export function getBusinessUsersOptions() {
	return axios.get("/select/business-users");
}
