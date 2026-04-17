export default [
	{
		path: 'login',
		name: 'login',
		meta: { layout: 'empty', title: 'Login', public: true },
		component: () => import('../pages/login.vue'),
	}
]