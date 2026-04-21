import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { login as LoginApi } from '../services/auth'
import { request } from '@request'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		token: Cookies.get('token') || null,
		loading: false
	}),
	getters: {
		isAuthenticated: (state) => !!state.token,
		getUser: (state) => state.user
	},
	actions: {
		async login(credentials) {
			this.loading = true
			const { data, error } = await request(() => LoginApi(credentials.email, credentials.password))
			this.loading = false

			if (error) {
				throw error
			}

			if (data?.token) {
				this.token = data.token
				this.user = data.user || null
				Cookies.set('token', data.token, { expires: 7 })
			}

			return data
		}
	}
})