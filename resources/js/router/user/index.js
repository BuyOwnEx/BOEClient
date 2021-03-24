export default [
	{
		path: '/profile',
		name: 'profile',
		component: () =>
			import(/* webpackChunkName: "profile" */ '@/pages/Profile.vue'),
	},
];
