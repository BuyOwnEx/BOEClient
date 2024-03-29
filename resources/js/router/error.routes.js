import Layout from '@/layouts/ErrorLayout.vue'
export default [{
    path: '/not-found',
    name: 'error_not_found',
    component: () => import(/* webpackChunkName: "error_not_found" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
        layout: Layout,
        title: 'titles.error_not_found'
    }
}, {
    path: '/unexpected',
    name: 'error_unexpected',
    component: () => import(/* webpackChunkName: "error_unexpected" */ '@/pages/error/UnexpectedPage.vue'),
    meta: {
        layout: Layout,
        title: 'titles.error_unexpected'
    }
}, {
    path: '/maintenance',
    name: 'error_maintenance',
    component: () => import(/* webpackChunkName: "error_maintenance" */ '@/pages/error/MaintenancePage.vue'),
    meta: {
        layout: Layout,
        title: 'titles.error_maintenance'
    }
}, {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
        layout: Layout,
        title: 'titles.error'
    }
}]
