import './bootstrap';

import Vue from 'vue';
import App from './ErrorApp.vue';
import store from './store';

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-head';

// STYLES
import '../sass/theme.scss';

Vue.config.productionTip = false;

Vue.prototype.$component = window.component;
Vue.prototype.$lang = window.locale;

Vue.component('not-found-page', require('./pages/error/NotFoundPage.vue').default);
Vue.component('unexpected-page', require('./pages/error/UnexpectedPage.vue').default);

export default new Vue({
	i18n,
	vuetify,
	store,
	render: (h) => h(App),
}).$mount('#app');