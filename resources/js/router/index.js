import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import config from '@/configs'
import i18n from '@/plugins/vue-i18n';
// Routes
import AuthRoutes from './auth.routes'
import ErrorRoutes from './error.routes'
import MainRoutes from './main.routes'

import Layout from '@/layouts/LandingLayout.vue';
Vue.use(Router)

export const routes = [{
        path: '/',
        name: 'landing',
        component: () => import(/* webpackChunkName: "landing" */ '@/pages/landing/Home.vue'),
        meta: {
            layout: Layout,
            title: i18n.t('titles.landing')
        },
        alias: '/landing',
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
  if (to.matched.some(record => record.meta.needTradeUIStatus)) {
    if (store.getters['user/isTradeHidden']) {
      next({
        path: '/not-found',
      })
    }
  }
  if(to.path === '/' && store.getters['app/isLogged'])
  {
    if(import.meta.env.VITE_CONFIG_START_AUTHED_PAGE === 'profile')
    {
      next({
        path: '/profile',
      })
    }
    else if(import.meta.env.VITE_CONFIG_START_AUTHED_PAGE === 'exchange')
    {
      next({
        path: '/exchange',
      })
    }
    else
    {
      next({
        path: '/trading/'+import.meta.env.VITE_DEFAULT_MARKET+'/'+import.meta.env.VITE_DEFAULT_CURRENCY,
      })
    }
  }
  else if(to.path === '/' && !store.getters['app/isLogged'])
  {
    if(import.meta.env.VITE_CONFIG_START_PAGE === 'landing')
    {
      next()
    }
    else if(import.meta.env.VITE_CONFIG_START_PAGE === 'login')
    {
      next({
        path: '/login',
      })
    }
    else if(import.meta.env.VITE_CONFIG_START_PAGE === 'exchange')
    {
      next({
        path: '/exchange',
      })
    }
    else
    {
      next({
        path: '/trading/'+import.meta.env.VITE_DEFAULT_MARKET+'/'+import.meta.env.VITE_DEFAULT_CURRENCY,
      })
    }
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['app/isLogged']) {
      next({
        path: '/login',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
    if(to.name === 'trading') document.title = config.product.name + ' - ' + to.params.currency + '/' + to.params.market;
    else document.title = config.product.name + ' - ' + to.meta.title;
})

export default router
