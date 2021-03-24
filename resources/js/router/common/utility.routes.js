export default [
	{
		path: '/utility/maintenance',
		name: 'utility-maintenance',
		component: () =>
			import(
				/* webpackChunkName: "utility-maintenance" */ '@/pages/utility/MaintenancePage.vue'
			),
		meta: {
			layout: 'auth',
		},
	},
	{
		path: '/utility/coming-soon',
		name: 'utility-soon',
		component: () =>
			import(
				/* webpackChunkName: "utility-soon" */ '@/pages/utility/SoonPage.vue'
			),
		meta: {
			layout: 'auth',
		},
	},
	{
		path: '/utility/help',
		name: 'utility-help',
		component: () =>
			import(
				/* webpackChunkName: "utility-help" */ '@/pages/utility/HelpPage.vue'
			),
	},
	{
		path: '/blank',
		name: 'blank',
		component: () =>
			import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue'),
	},
];
