import axios from "axios";

export function getReservationsHeadquarters(params = {}) {
	return axios.get('/api/dashboard/reservations-headquarters', { params });
}

export function getDashboardLeads(params = {}) {
	return axios.get('/api/dashboard/leads', { params });
}

export function getCustomerTypesMetric(params = {}) {
	return axios.get('/api/dashboard/type-customers', { params });
}

export function getComparativeYearMetrics(params = {}) {
	return axios.get('/api/dashboard/comparative/current-year', { params });
}

export function getGeneralStatistics(params = {}) {
	return axios.get('/api/dashboard/general-statistics', { params });
}
