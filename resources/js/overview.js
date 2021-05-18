import './bootstrap';

import Vue from 'vue';
import App from './MainApp.vue';
import store from './store';

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-google-maps';
import './plugins/vue-shortkey';
import './plugins/vue-head';
import './plugins/vue-gtag';
import './plugins/apexcharts';
import './plugins/echarts';
import './plugins/moment';

// STYLES
import '../sass/theme.scss';

Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue();
Vue.prototype.$trading_currency = window.trading_currency;
Vue.prototype.$trading_market = window.trading_market;
Vue.prototype.$user = window.user;
Vue.prototype.$config = window.config;
Vue.prototype.$component = window.component;

Vue.component('overview', require('./pages/overview/Overview.vue').default);

import HighchartsVue from 'highcharts-vue';
Vue.use(HighchartsVue);

export default new Vue({
	i18n,
	vuetify,
	store,
	render: h => h(App),
}).$mount('#app');
