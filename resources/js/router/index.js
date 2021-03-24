import Vue from 'vue';
import Router from 'vue-router';

// Routes
import AppsRoutes from './apps.routes';
import UIRoutes from './ui.routes';
import PagesRoutes from './pages.routes';
import UsersRoutes from './users.routes';
import EcommerceRoutes from './ecommerce.routes';
import LandingRoutes from './landing.routes';

import AuthRoutes from './auth';
import DocsRoutes from './docs';
import InfoRoutes from './info';
import UserRoutes from './user';
import { ErrorRoutes, UtilityRoutes } from './common';

Vue.use(Router);

export const routes = [
	...AppsRoutes,
	...UIRoutes,
	...PagesRoutes,
	...UsersRoutes,
	...EcommerceRoutes,
	...LandingRoutes,
	...AuthRoutes,
	...DocsRoutes,
	...InfoRoutes,
	...UserRoutes,
	...ErrorRoutes,
	...UtilityRoutes,
];

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL || '/',
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;

		return { x: 0, y: 0 };
	},
	routes,
});

router.beforeEach((to, from, next) => {
	return next();
});
router.afterEach((to, from) => {});

export default router;
