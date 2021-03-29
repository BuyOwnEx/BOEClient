import './bootstrap';

import Vue from 'vue';
import App from './AuthApp.vue';

// VUEX - https://vuex.vuejs.org/
import store from './store';

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-head';

// STYLES
// Main Theme SCSS
import '../sass/theme.scss';

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue();
Vue.prototype.$component = window.component;
Vue.prototype.$lang = window.locale;

Vue.component('register', require('./pages/auth/Register.vue').default);
Vue.component('login', require('./pages/auth/Login.vue').default);
Vue.component('verify', require('./pages/auth/Verify.vue').default);
Vue.component('email', require('./pages/auth/Email.vue').default);
Vue.component('reset', require('./pages/auth/Reset.vue').default);
Vue.component('2fa', require('./pages/auth/2FA.vue').default);

export default new Vue({
	i18n,
	vuetify,
	store,
	render: (h) => h(App),
}).$mount('#app');