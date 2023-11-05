import Layout from '@/layouts/DefaultLayout.vue'
export default [{
    path: '/overview',
    name: 'overview',
    component: () => import(/* webpackChunkName: "overview" */ '@/pages/overview/Overview.vue'),
    meta: {
        layout: Layout,
        title: 'titles.overview'
    }
}, {
    path: '/trading/:market([A-Z0-9]{1,10})/:currency([A-Z0-9]{1,10})',
    name: 'trading',
    component: () => import(/* webpackChunkName: "trading" */ '@/pages/trading/Trading.vue'),
    meta: {
        layout: Layout,
        title: 'titles.trading'
    }
}, {
    path: '/api',
    name: 'api',
    component: () => import(/* webpackChunkName: "api" */ '@/pages/main/Api.vue'),
    meta: {
        layout: Layout,
        title: 'titles.api'
    }
}, {
    path: '/balance',
    name: 'balance',
    component: () => import(/* webpackChunkName: "balance" */ '@/pages/main/Balance.vue'),
    meta: {
        layout: Layout,
        title: 'titles.balance'
    }
}, {
    path: '/contacts',
    name: 'contacts',
    component: () => import(/* webpackChunkName: "contacts" */ '@/pages/main/Contacts.vue'),
    meta: {
        layout: Layout,
        title: 'titles.contacts'
    }
}, {
    path: '/deals',
    name: 'deals',
    component: () => import(/* webpackChunkName: "deals" */ '@/pages/main/Deals.vue'),
    meta: {
        layout: Layout,
        title: 'titles.deals'
    }
}, {
    path: '/fees',
    name: 'fees',
    component: () => import(/* webpackChunkName: "fees" */ '@/pages/main/Fees.vue'),
    meta: {
        layout: Layout,
        title: 'titles.fees'
    }
}, {
    path: '/fiat_transactions',
    name: 'fiat_transactions',
    component: () => import(/* webpackChunkName: "fiat_transactions" */ '@/pages/main/FiatTransactions.vue'),
    meta: {
        layout: Layout,
        title: 'titles.fiat_transactions'
    }
}, {
    path: '/notifications',
    name: 'notifications',
    component: () => import(/* webpackChunkName: "notifications" */ '@/pages/main/Notifications.vue'),
    meta: {
        layout: Layout,
        title: 'titles.notifications'
    }
}, {
    path: '/orders',
    name: 'orders',
    component: () => import(/* webpackChunkName: "orders" */ '@/pages/main/Orders.vue'),
    meta: {
        layout: Layout,
        title: 'titles.orders'
    }
}, {
    path: '/policy',
    name: 'policy',
    component: () => import(/* webpackChunkName: "policy" */ '@/pages/main/Policy.vue'),
    meta: {
        layout: Layout,
        title: 'titles.policy'
    }
}, {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/pages/main/Profile.vue'),
    meta: {
        layout: Layout,
        title: 'titles.profile'
    }
}, {
    path: '/ref_payments',
    name: 'ref_payments',
    component: () => import(/* webpackChunkName: "ref_payments" */ '@/pages/main/RefPayments.vue'),
    meta: {
        layout: Layout,
        title: 'titles.ref_payments'
    }
}, {
    path: '/status',
    name: 'status',
    component: () => import(/* webpackChunkName: "status" */ '@/pages/main/Status.vue'),
    meta: {
        layout: Layout,
        title: 'titles.status'
    }
}, {
    path: '/support',
    name: 'support',
    component: () => import(/* webpackChunkName: "support" */ '@/pages/main/Support.vue'),
    meta: {
        layout: Layout,
        title: 'titles.support'
    }
}, {
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "terms" */ '@/pages/main/Terms.vue'),
    meta: {
        layout: Layout,
        title: 'titles.terms'
    }
}, {
    path: '/transactions',
    name: 'transactions',
    component: () => import(/* webpackChunkName: "transactions" */ '@/pages/main/Transactions.vue'),
    meta: {
        layout: Layout,
        title: 'titles.transactions'
    }
}, {
    path: '/transfers',
    name: 'transfers',
    component: () => import(/* webpackChunkName: "transfers" */ '@/pages/main/Transfers.vue'),
    meta: {
        layout: Layout,
        title: 'titles.transfers'
    }
}]
