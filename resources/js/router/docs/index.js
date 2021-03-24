export default [
	{
		path: '/api',
		name: 'api',
		component: () =>
			import(/* webpackChunkName: "api" */ '@/pages/docs/Api.vue'),
	},
	{
		path: '/policy',
		name: 'policy',
		component: () =>
			import(/* webpackChunkName: "policy" */ '@/pages/docs/Policy.vue'),
	},
	{
		path: '/terms',
		name: 'terms',
		component: () =>
			import(/* webpackChunkName: "terms" */ '@/pages/docs/Terms.vue'),
	},
]