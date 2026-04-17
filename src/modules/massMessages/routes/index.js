export default [
	{
		path: 'mensajes-masivos',
		name: 'massMessages',
		meta: { title: 'Mensajes Masivos' },
		redirect: { name: 'massMessages.main' },
		component: () => import('../pages/massMessages.vue'),
		meta: {
			module: 5
		},
		children: [
			{
				path: '',
				name: 'massMessages.main',
				component: () => import('../pages/viewSentList.vue'),
			},
			{
				path: 'nueva-difusion',
				name: 'massMessages.newDiffusion',
				component: () => import('../pages/viewNewDiffusion.vue'),
			}
		]
	}
]