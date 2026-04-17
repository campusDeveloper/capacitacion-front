export default [
	{
		path: 'configuracion',
		name: 'configuration',
		meta: { layout: 'base', title: 'configuración' },
		component: () => import('../pages/index.vue'),
		meta: {
			module: 7
		},
		redirect: { name: 'configuration.main' },
		children: [
			{
				path: '',
				name: 'configuration.main',
				component: () => import('../pages/configuration.vue'),
			},
			{
				path: 'estado-interes',
				name: 'configuration.interest',
				component: () => import('../pages/interest.vue'),
			},
			{
				path: 'seguimiento',
				name: 'configuration.follow',
				component: () => import('../pages/follow.vue'),
			},
			{
				path: 'tipo-cliente',
				name: 'configuration.type.client',
				component: () => import('../pages/typeClient.vue'),
			},
			{
				path: 'configuracion-agente-IA',
				name: 'configuration.agent.IA',
				component: () => import('../pages/agentIA.vue'),
			},
			{
				path: 'sedes',
				name: 'configuration.headquarters',
				component: () => import('../pages/knowledge.vue'),
			},
			{
				path: 'conocimiento/:id?',
				name: 'configuration.knowledge',
				component: () => import('../pages/knowledgeDetail.vue'),
			},
			{
				path: 'planetillas-whatsapp',
				name: 'configuration.templates.whatsapp',
				component: () => import('../pages/templatesWPP.vue'),
			}
		],
	}
]
