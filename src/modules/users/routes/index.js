export default [
	{
		path: 'usuarios',
		name: 'users',
		meta: { layout: 'base' },
		component: () => import('../pages/users.vue'),
		meta: {
			module: 6
		},
	}
]