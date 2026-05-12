import axios from "axios";


export function getUsers() {
	return axios.get('/api/users');
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
