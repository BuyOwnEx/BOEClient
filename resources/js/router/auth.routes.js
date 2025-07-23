import Layout from '@/layouts/AuthLayout.vue'
import i18n from '@/plugins/vue-i18n.js';
export default [{
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/pages/auth/Login.vue'),
    props: { isCaptchaEnabled: import.meta.env.VITE_CAPTCHA_ENABLED === "true", captchaType: import.meta.env.VITE_CAPTCHA_TYPE },
    meta: {
        layout: Layout,
        title: i18n.t('titles.login'),
        requiresAuth: false
    }
}, {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '@/pages/auth/Register.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.register'),
        requiresAuth: false
    }
}, {
    path: '/password/reset',
    name: 'email',
    component: () => import(/* webpackChunkName: "email" */ '@/pages/auth/Email.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.email'),
        requiresAuth: false
    }
}, {
    path: '/password/reset/:token',
    name: 'reset',
    component: () => import(/* webpackChunkName: "reset" */ '@/pages/auth/Reset.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.reset'),
        requiresAuth: false
    }
}, {
    path: '/email/verify',
    name: 'verify',
    component: () => import(/* webpackChunkName: "verify" */ '@/pages/auth/Verify.vue'),
    props: true,
    meta: {
        layout: Layout,
        title: i18n.t('titles.verify'),
        requiresAuth: false
    }
}, {
    path: '/2fa',
    name: '2fa',
    component: () => import(/* webpackChunkName: "verify" */ '@/pages/auth/G2FA.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.2fa'),
        requiresAuth: false
    }
}]
