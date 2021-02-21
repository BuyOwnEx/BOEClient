export default [{
  path: '/login',
  name: 'login',
  component: () => import(/* webpackChunkName: "auth-signin" */ '@/pages/auth/Login.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/register',
  name: 'register',
  component: () => import(/* webpackChunkName: "auth-signup" */ '@/pages/auth/Register.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/email/verify',
  name: 'verify',
  component: () => import(/* webpackChunkName: "auth-verify-email" */ '@/pages/auth/Verify.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/password/reset',
  name: 'email',
  component: () => import(/* webpackChunkName: "auth-forgot" */ '@/pages/auth/Email.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/password/reset/{token}',
  name: 'reset',
  component: () => import(/* webpackChunkName: "auth-reset" */ '@/pages/auth/Reset.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/error/not-found',
  name: 'error-not-found',
  component: () => import(/* webpackChunkName: "error-not-found" */ '@/pages/error/NotFoundPage.vue'),
  meta: {
    layout: 'error'
  }
}, {
  path: '/error/unexpected',
  name: 'error-unexpected',
  component: () => import(/* webpackChunkName: "error-unexpected" */ '@/pages/error/UnexpectedPage.vue'),
  meta: {
    layout: 'error'
  }
}, {
  path: '/utility/maintenance',
  name: 'utility-maintenance',
  component: () => import(/* webpackChunkName: "utility-maintenance" */ '@/pages/utility/MaintenancePage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/utility/coming-soon',
  name: 'utility-soon',
  component: () => import(/* webpackChunkName: "utility-soon" */ '@/pages/utility/SoonPage.vue'),
  meta: {
    layout: 'auth'
  }
}, {
  path: '/utility/help',
  name: 'utility-help',
  component: () => import(/* webpackChunkName: "utility-help" */ '@/pages/utility/HelpPage.vue')
}]
