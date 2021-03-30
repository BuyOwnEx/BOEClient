import './bootstrap';

import Vue from 'vue';
import App from './MainApp.vue';

// VUEX - https://vuex.vuejs.org/
import store from './store';

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-head';
import './plugins/clipboard';

// STYLES
// Main Theme SCSS
import '../sass/theme.scss';

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue();
Vue.prototype.$user = window.user;
Vue.prototype.$component = window.component;

Vue.component('balance', require('./pages/Balance.vue').default);
Vue.component('deals', require('./pages/Deals.vue').default);
Vue.component('fiat-transactions', require('./pages/FiatTransactions.vue').default);
Vue.component('notifications', require('./pages/Notifications.vue').default);
Vue.component('orders', require('./pages/Orders.vue').default);
Vue.component('ref-payments', require('./pages/RefPayments.vue').default);
Vue.component('profile', require('./pages/Profile.vue').default);
Vue.component('support', require('./pages/Support.vue').default);
Vue.component('transactions', require('./pages/Transactions.vue').default);
Vue.component('transfers', require('./pages/Transfers.vue').default);
Vue.component('policy', require('./pages/docs/Policy.vue').default);
Vue.component('terms', require('./pages/docs/Terms.vue').default);
Vue.component('api', require('./pages/docs/Api.vue').default);
Vue.component('fees', require('./pages/info/Fees.vue').default);
Vue.component('status', require('./pages/info/Status.vue').default);

export default new Vue({
	i18n,
	vuetify,
	store,
	render: h => h(App),
}).$mount('#app');
