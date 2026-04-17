export default [
	{
		path: 'pre-reservas',
		name: 'preReservation',
		meta: { title: 'Pre Reservas' },
		component: () => import('../pages/preReservation.vue'),
		meta: {
			module: 3
		},
	}
]