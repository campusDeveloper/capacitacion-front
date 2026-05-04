import axios from "axios";

export function getCustomerTypes() {
	return axios.get('/api/configuration/customer-types');
}

export function createCustomerType(payload) {
	return axios.post('/api/configuration/customer-type', payload);
}

export function updateCustomerType(idType, payload) {
	return axios.put(`/api/configuration/customer-type/${idType}/update`, payload);
}

export function deleteCustomerType(idType) {
	return axios.delete(`/api/configuration/customer-type/${idType}/delete`);
}

export function updateCustomerTypeState(idType, state) {
	return axios.put(`/api/configuration/customer-type/${idType}/state`, { state });
}