import './bootstrap';

import Vue from 'vue';
import App from './MainApp.vue';

// VUEX - https://vuex.vuejs.org/
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
import './plugins/animate';
import './plugins/clipboard';
import './plugins/moment';

// FILTERS
import './filters/capitalize';
import './filters/lowercase';
import './filters/uppercase';
import './filters/formatCurrency';
import './filters/formatDate';

// STYLES
// Main Theme SCSS
import '../sass/theme.scss';

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue();
Vue.prototype.$trading_currency = window.trading_currency;
Vue.prototype.$trading_market = window.trading_market;
Vue.prototype.$user = window.user;
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