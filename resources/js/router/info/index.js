export default [
	{
		path: '/status',
		name: 'status',
		component: () =>
			import(/* webpackChunkName: "status" */ '@/pages/info/Status.vue'),
	},
	{
		path: '/fees',
		name: 'fees',
		component: () =>
			import(/* webpackChunkName: "fees" */ '@/pages/info/Fees.vue'),
	},
];
