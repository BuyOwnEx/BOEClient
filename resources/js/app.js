import './bootstrap';
import Vue from 'vue';
import VueRouter from 'vue-router'
import App from './App.vue';

import store from './store';
import router from './router';

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
Vue.prototype.$trading_currency = window.trading_currency || 'BTC';
Vue.prototype.$trading_market = window.trading_market || 'USDT';
Vue.prototype.$user = window.user || null;
Vue.prototype.$config = window.config || null;
Vue.prototype.$component = window.component;
Vue.prototype.$spa = true;

Vue.use(i18n);
Vue.use(VueRouter)

export default new Vue({
    i18n,
    vuetify,
    router,
    store,
    render: h => h(App),
}).$mount('#app');
