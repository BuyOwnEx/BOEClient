export default [
	{
		path: '/trading',
		name: 'trading',
		component: () =>
			import(/* webpackChunkName: "trading" */ '@/pages/trading/Trading.vue'),
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		component: () =>
			import(
				/* webpackChunkName: "dashboard" */ '@/pages/dashboard/DashboardPage.vue'
			),
	},
	{
		path: '/overview',
		name: 'overview',
		component: () =>
			import(
				/* webpackChunkName: "dashboard" */ '@/pages/overview/Overview.vue'
			),
	},

	{
		path: '/transactions',
		name: 'transactions',
		component: () =>
			import(
				/* webpackChunkName: "transactions" */ '@/pages/Transactions.vue'
			),
	},
	{
		path: '/fiat-transactions',
		name: 'fiat-transactions',
		component: () =>
			import(
				/* webpackChunkName: "fiat-transactions" */ '@/pages/FiatTransactions.vue'
			),
	},
	{
		path: '/orders',
		name: 'orders',
		component: () =>
			import(
				/* webpackChunkName: "orders" */ '@/pages/Orders.vue'
			),
	},
	{
		path: '/deals',
		name: 'deals',
		component: () =>
			import(
				/* webpackChunkName: "deals" */ '@/pages/Deals.vue'
			),
	},
	{
		path: '/transfers',
		name: 'transfers',
		component: () =>
			import(
				/* webpackChunkName: "transfers" */ '@/pages/Transfers.vue'
			),
	},
	{
		path: '/balance',
		name: 'balance',
		component: () =>
			import(
				/* webpackChunkName: "balance" */ '@/pages/Balance.vue'
			),
	},
	{
		path: '/ref-payments',
		name: 'ref-payments',
		component: () =>
			import(
				/* webpackChunkName: "ref-payments" */ '@/pages/RefPayments.vue'
			),
	},
	{
		path: '/notifications',
		name: 'notifications',
		component: () =>
			import(
				/* webpackChunkName: "notifications" */ '@/pages/Notifications.vue'
			),
	},
];
