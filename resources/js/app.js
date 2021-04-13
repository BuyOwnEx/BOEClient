import './bootstrap';
import Vue from 'vue';
import App from './App.vue';

import store from './store';

//import router from './router'

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-google-maps';
import './plugins/vue-shortkey';
import './plugins/vue-head';
import './plugins/vue-gtag';
import './plugins/apexcharts';
import './plugins/echarts';
import './plugins/clipboard';
import './plugins/moment';

// STYLES
import '../sass/theme.scss';

Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue();
Vue.prototype.$currency = window.currency || 'BTC';
Vue.prototype.$market = window.market || 'USDT';
Vue.prototype.$user = window.user || null;

import HighchartsVue from 'highcharts-vue';
Vue.use(HighchartsVue);

export default new Vue({
	i18n,
	vuetify,
	//router,
	store,
	render: h => h(App),
}).$mount('#app');
