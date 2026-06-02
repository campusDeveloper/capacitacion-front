import axios from "axios";

export function getReservationsHeadquarters(params = {}) {
	return axios.get('/api/dashboard/reservations-headquarters', { params });
}

export function getDashboardLeads(params = {}) {
	return axios.get('/api/dashboard/leads', { params });
}
