export default [
	{
		path: '*',
		name: 'error',
		component: () =>
			import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
		meta: {
			layout: 'error',
		},
	},
	{
		path: '/error/not-found',
		name: 'error-not-found',
		component: () =>
			import(
				/* webpackChunkName: "error-not-found" */ '@/pages/error/NotFoundPage.vue'
			),
		meta: {
			layout: 'error',
		},
	},
	{
		path: '/error/unexpected',
		name: 'error-unexpected',
		component: () =>
			import(
				/* webpackChunkName: "error-unexpected" */ '@/pages/error/UnexpectedPage.vue'
			),
		meta: {
			layout: 'error',
		},
	},
];
