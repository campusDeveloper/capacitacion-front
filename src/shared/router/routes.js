import Login from '../../modules/auth/routes';
import Dashboard from '../../modules/dashboard/routes';
import Clients from '../../modules/clients/routes';
import Users from '../../modules/users/routes';
import massMessages from '../../modules/massMessages/routes';
import preReservation from '../../modules/preReservation/routes';
import Chats from '../../modules/chats/routes';
import TrakingLeads from '../../modules/trackingLeds/routes';
import Configuration from '../../modules/configuration/routes';

export default [
	{
		path: '/',
		name: 'home',
		component: () => import('../pages/home.vue'),
		redirect: { name: 'login' },
		meta: { layout: 'base', requiresAuth: true, },
		children: [
			...Login,
			...Dashboard,
			...Clients,
			...Users,
			...massMessages,
			...preReservation,
			...Chats,
			...TrakingLeads,
			...Configuration,
			{
				path: 'base',
				name: 'base',
				meta: { layout: 'empty' },
				component: () => import('../pages/baseView.vue'),
			}
		]
	},
];
