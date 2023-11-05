import Vue from 'vue'
import Router from 'vue-router'

// Routes
import AuthRoutes from './auth.routes'
import ErrorRoutes from './error.routes'
import MainRoutes from './main.routes'

Vue.use(Router)

export const routes = [{
        path: '/',
        redirect: '/trading/USDT/BTC'
    },
    ...AuthRoutes,
    ...MainRoutes,
    ...ErrorRoutes]

const router = new Router({
    mode: 'history',
    base: import.meta.env.VITE_BASE_URL || '/',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        return { x: 0, y: 0 }
    },
    routes
})

/**
 * Before each route update
 */
router.beforeEach((to, from, next) => {
    return next()
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
})

export default router
