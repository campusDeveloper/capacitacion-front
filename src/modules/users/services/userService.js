import axios from "axios";


export function getUsers() {
	return axios.get('/api/users');
}

export function getHeadquarters() {
	return axios.get('/api/select/headquarters');
}

export function getUserHeadquarters(idUser) {
	return axios.get(`/api/user/${idUser}/headquartes`);
}

export function updateMainHeadquarter(idUser, payload) {
	return axios.put(`/api/user/${idUser}/main-headquarter`, payload);
}

export function updateUserHeadquarter(idUser, payload) {
	return axios.put(`/api/user/${idUser}/headquarters`, payload);
}

export function createUser(payload) {
	return axios.post('/api/user/store', payload);
}

export function updateUser(idUser, payload) {
	return axios.put(`/api/user/${idUser}/update`, payload);
}

export function changeUserState(idUser, payload) {
	return axios.put(`/api/user/${idUser}/state`, payload);
}

export function deleteUser(idUser) {
	return axios.delete(`/api/user/${idUser}/delete`);
}
