import axios from "axios";

export function createUser(payload) {
	return axios.post('/api/user/store', payload);
}
