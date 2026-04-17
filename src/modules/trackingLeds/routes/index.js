export default [
	{
		path: 'seguimiento-leads',
		name: 'tracking.leads',
		meta: { title: 'Seguimiento de leads' },
		component: () => import('../pages/trackingLeds.vue'),
		meta: {
			module: 2
		},
	}
]