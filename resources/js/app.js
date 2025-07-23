import './bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router'
import App from './App.vue';

import store from './store';
import router from './router';

import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-head';
import './plugins/clipboard';
import './plugins/gt4';
import './plugins/moment';

// STYLES Именно так и никак иначе, поскольку только variables должны быть в секции css.preprocessorOptions.sass.additionalData
import '../sass/app.scss'
import '../sass/vuetify/overrides.scss'
import '../sass/helpers.scss'

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$vuetify = vuetify.framework;
Vue.prototype.$eventHub = new Vue();
store.commit('app/setAuthUser', { user: window.user || null, vm: this })

Vue.use(i18n);
Vue.use(VueRouter)

export default new Vue({
    i18n,
    vuetify,
    router,
    store,
    render: h => h(App),
}).$mount('#app');
