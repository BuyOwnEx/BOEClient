import Layout from '@/layouts/AuthLayout.vue'
export default [{
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/pages/auth/Login.vue'),
    meta: {
        layout: Layout,
        title: 'titles.login',
        requiresAuth: false
    }
}, {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '@/pages/auth/Register.vue'),
    meta: {
        layout: Layout,
        title: 'titles.register',
        requiresAuth: false
    }
}, {
    path: '/password/reset',
    name: 'email',
    component: () => import(/* webpackChunkName: "email" */ '@/pages/auth/Email.vue'),
    meta: {
        layout: Layout,
        title: 'titles.email',
        requiresAuth: false
    }
}, {
    path: '/password/reset/:token',
    name: 'reset',
    component: () => import(/* webpackChunkName: "reset" */ '@/pages/auth/Reset.vue'),
    meta: {
        layout: Layout,
        title: 'titles.reset',
        requiresAuth: false
    }
}, {
    path: '/email/verify',
    name: 'verify',
    component: () => import(/* webpackChunkName: "verify" */ '@/pages/auth/Verify.vue'),
    meta: {
        layout: Layout,
        title: 'titles.verify',
        requiresAuth: false
    }
}, {
    path: '/2fa',
    name: '2fa',
    component: () => import(/* webpackChunkName: "verify" */ '@/pages/auth/G2FA.vue'),
    meta: {
        layout: Layout,
        title: 'titles.2fa',
        requiresAuth: false
    }
}]
