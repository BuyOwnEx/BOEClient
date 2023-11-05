import './bootstrap';

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './AuthApp.vue';
import store from './store';

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-head';

// STYLES Именно так и никак иначе, поскольку только variables должны быть в секции css.preprocessorOptions.sass.additionalData
import '../sass/app.scss'
import '../sass/vuetify/overrides.scss'
import '../sass/helpers.scss'


Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$vuetify = vuetify.framework;
Vue.prototype.$eventHub = new Vue();
Vue.prototype.$component = window.component;
Vue.prototype.$spa = false;
Vue.use(i18n);
Vue.use(VueRouter);

export default new Vue({
    i18n,
    vuetify,
    store,
    render: (h) => h(App),
}).$mount('#app');
