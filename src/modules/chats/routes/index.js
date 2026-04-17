export default [
	{
		path: 'chats',
		name: 'chats',
		meta: { title: 'Chats' },
		component: () => import('../pages/chat.vue'),
		children: [
			{
				path: ':idChat',
				name: 'chat.details',
				component: () => import('../pages/detailChat.vue'),
				meta: {
					module: 4
				}
			}
		]
	}
]