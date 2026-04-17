import { defineStore } from "pinia";

export const useErrors = defineStore({
	id: 'errors',
	state: () => ({
		errors: []
	}),
	getters:{
		hasErrors: state => state.errors ? Object.keys(state.errors).length > 0 : false,
	},
	actions: {
		setErrors(errors){
			this.errors = errors;
		},
	},
})