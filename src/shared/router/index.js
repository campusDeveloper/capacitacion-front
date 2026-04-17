import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';


const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

/* 🔐 GUARD GLOBAL */
router.beforeEach(async (to, from, next) => {
	if (to.meta.public) {
		return next();
	}

	next();
});


export default router;
