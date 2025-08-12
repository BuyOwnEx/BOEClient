import Layout from '@/layouts/DefaultLayout.vue'
import i18n from '@/plugins/vue-i18n.js';
export default [{
    path: '/overview',
    name: 'overview',
    component: () => import(/* webpackChunkName: "overview" */ '@/pages/overview/Overview.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.overview'),
        needTradeUIStatus: true,
        requiresAuth: false
    }
}, {
    path: '/trading',
    redirect: '/trading/'+import.meta.env.VITE_DEFAULT_MARKET+'/'+import.meta.env.VITE_DEFAULT_CURRENCY,
    meta: {
        needTradeUIStatus: true
    }
}, {
    path: '/trading/:market([A-Z0-9]{1,10})/:currency([A-Z0-9]{1,10})',
    name: 'trading',
    component: () => import(/* webpackChunkName: "trading" */ '@/pages/trading/Trading.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.trading'),
        requiresAuth: false,
        needTradeUIStatus: true,
    }
}, {
    path: '/exchange',
    redirect: import.meta.env.VITE_CONFIG_ENABLED_OTC ? '/exchange/'+import.meta.env.VITE_DEFAULT_OTC_CURRENCY_OUT+'/'+import.meta.env.VITE_DEFAULT_OTC_CURRENCY_IN : '/not-found'
}, {
    path: '/exchange/:currency_out([A-Z0-9]{1,10})/:currency_in([A-Z0-9]{1,10})',
    name: 'exchange',
    component: () => import(/* webpackChunkName: "exchange" */ '@/pages/exchange/Exchange.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.exchange'),
        requiresAuth: false
    }
}, {
    path: '/api',
    name: 'api',
    component: () => import(/* webpackChunkName: "api" */ '@/pages/main/Api.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.api'),
        needTradeUIStatus: true,
        requiresAuth: false
    }
}, {
    path: '/balance',
    name: 'balance',
    component: () => import(/* webpackChunkName: "balance" */ '@/pages/main/Balance.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.balance'),
        requiresAuth: true
    }
}, {
    path: '/contacts',
    name: 'contacts',
    component: () => import(/* webpackChunkName: "contacts" */ '@/pages/main/Contacts.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.contacts'),
        requiresAuth: false
    }
}, {
    path: '/deals',
    name: 'deals',
    component: () => import(/* webpackChunkName: "deals" */ '@/pages/main/Deals.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.deals'),
        needTradeUIStatus: true,
        requiresAuth: true
    }
}, {
    path: '/exchange/history',
    name: 'exchange_history',
    component: () => import(/* webpackChunkName: "deals" */ '@/pages/main/ExchangeHistory.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.exchange_history'),
        needTradeUIStatus: false,
        requiresAuth: true
    }
}, {
    path: '/fees',
    name: 'fees',
    component: () => import(/* webpackChunkName: "fees" */ '@/pages/main/Fees.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.fees'),
        requiresAuth: false
    }
}, {
    path: '/fiat_transactions',
    name: 'fiat_transactions',
    component: () => import(/* webpackChunkName: "fiat_transactions" */ '@/pages/main/FiatTransactions.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.fiat_transactions'),
        requiresAuth: true
    }
}, {
    path: '/notifications',
    name: 'notifications',
    component: () => import(/* webpackChunkName: "notifications" */ '@/pages/main/Notifications.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.notifications'),
        requiresAuth: true
    }
}, {
    path: '/orders',
    name: 'orders',
    component: () => import(/* webpackChunkName: "orders" */ '@/pages/main/Orders.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.orders'),
        needTradeUIStatus: true,
        requiresAuth: true
    }
}, {
    path: '/policy',
    name: 'policy',
    component: () => import(/* webpackChunkName: "policy" */ '@/pages/main/Policy.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.policy'),
        requiresAuth: false
    }
}, {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/pages/main/Profile.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.profile'),
        requiresAuth: true
    }
}, {
    path: '/ref_payments',
    name: 'ref_payments',
    component: () => import(/* webpackChunkName: "ref_payments" */ '@/pages/main/RefPayments.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.ref_payments'),
        needTradeUIStatus: true,
        requiresAuth: true
    }
}, {
    path: '/status',
    name: 'status',
    component: () => import(/* webpackChunkName: "status" */ '@/pages/main/Status.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.status'),
        requiresAuth: false
    }
}, {
    path: '/support',
    name: 'support',
    component: () => import(/* webpackChunkName: "support" */ '@/pages/main/Support.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.support'),
        requiresAuth: false
    }
}, {
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "terms" */ '@/pages/main/Terms.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.terms'),
        requiresAuth: false
    }
}, {
    path: '/transactions',
    name: 'transactions',
    component: () => import(/* webpackChunkName: "transactions" */ '@/pages/main/Transactions.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.transactions'),
        requiresAuth: true
    }
}, {
    path: '/transfers',
    name: 'transfers',
    component: () => import(/* webpackChunkName: "transfers" */ '@/pages/main/Transfers.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.transfers'),
        requiresAuth: true
    }
}]
