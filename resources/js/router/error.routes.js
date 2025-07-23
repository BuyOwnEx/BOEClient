import Layout from '@/layouts/ErrorLayout.vue'
import i18n from '@/plugins/vue-i18n.js';
export default [{
    path: '/not-found',
    name: 'error_not_found',
    component: () => import(/* webpackChunkName: "error_not_found" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.error_not_found'),
        requiresAuth: false
    }
}, {
    path: '/unexpected',
    name: 'error_unexpected',
    component: () => import(/* webpackChunkName: "error_unexpected" */ '@/pages/error/UnexpectedPage.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.error_unexpected'),
        requiresAuth: false
    }
}, {
    path: '/maintenance',
    name: 'error_maintenance',
    component: () => import(/* webpackChunkName: "error_maintenance" */ '@/pages/error/MaintenancePage.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.error_maintenance'),
        requiresAuth: false
    }
}, {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
        layout: Layout,
        title: i18n.t('titles.error'),
        requiresAuth: false
    }
}]
