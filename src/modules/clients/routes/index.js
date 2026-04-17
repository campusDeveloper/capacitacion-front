export default [
	{
		path: 'clientes',
		name: 'clients',
		meta: { title: 'Clientes' },
		component: () => import('../pages/clients.vue'),
		meta: {
			module: 1
		}
	}
]