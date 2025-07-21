import './bootstrap';

import Vue from 'vue';
import App from './OverviewApp.vue';
import store from './store';


// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-head';
import './plugins/moment';

// STYLES Именно так и никак иначе, поскольку только variables должны быть в секции css.preprocessorOptions.sass.additionalData
import '../sass/app.scss'
import '../sass/vuetify/overrides.scss'
import '../sass/helpers.scss'

Vue.config.productionTip = false;
Vue.prototype.$store = store;
Vue.prototype.$vuetify = vuetify.framework;
Vue.prototype.$eventHub = new Vue();
Vue.prototype.$trading_currency = window.trading_currency;
Vue.prototype.$trading_market = window.trading_market;
//Vue.prototype.$user = window.user;
//Vue.prototype.$config = window.config;
Vue.prototype.$spa = false;

//import HighchartsVue from 'highcharts-vue';
//Vue.use(HighchartsVue);
Vue.use(i18n);

export default new Vue({
	i18n,
	vuetify,
	store,
	render: h => h(App),
}).$mount('#app');
