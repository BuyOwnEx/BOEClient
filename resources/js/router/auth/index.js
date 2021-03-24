export default [
	{
		path: '/login',
		name: 'login',
		component: () =>
			import(/* webpackChunkName: "auth-signin" */ '@/pages/auth/Login.vue'),
		meta: {
			layout: 'auth',
		},
	},
	{
		path: '/register',
		name: 'register',
		component: () =>
			import(/* webpackChunkName: "auth-signup" */ '@/pages/auth/Register.vue'),
		meta: {
			layout: 'auth',
		},
	},
	{
		path: '/email/verify',
		name: 'verify',
		component: () =>
			import(
				/* webpackChunkName: "auth-verify-email" */ '@/pages/auth/Verify.vue'
			),
		meta: {
			layout: 'auth',
		},
	},
	{
		path: '/password/reset',
		name: 'email',
		component: () =>
			import(/* webpackChunkName: "auth-forgot" */ '@/pages/auth/Email.vue'),
		meta: {
			layout: 'auth',
		},
	},
	{
		path: '/password/reset/{token}',
		name: 'reset',
		component: () =>
			import(/* webpackChunkName: "auth-reset" */ '@/pages/auth/Reset.vue'),
		meta: {
			layout: 'auth',
		},
	},
];
