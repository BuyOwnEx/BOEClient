import './bootstrap';

import Vue from 'vue';
import App from './MainApp.vue';
import store from './store';

// PLUGINS
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-i18n';
import './plugins/vue-head';
import './plugins/clipboard';

// STYLES
import '../sass/theme.scss';

Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue();
Vue.prototype.$user = window.user;
Vue.prototype.$component = window.component;

Vue.component('balance', require('./pages/balance/Balance.vue').default);
Vue.component('deals', require('./pages/Deals.vue').default);
Vue.component('fiat-transactions', require('./pages/FiatTransactions.vue').default);
Vue.component('notifications', require('./pages/notifications/Notifications.vue').default);
Vue.component('orders', require('./pages/Orders.vue').default);
Vue.component('ref-payments', require('./pages/RefPayments.vue').default);
Vue.component('profile', require('./pages/user/Profile.vue').default);
Vue.component('support', require('./pages/support/Support.vue').default);
Vue.component('transactions', require('./pages/Transactions.vue').default);
Vue.component('transfers', require('./pages/Transfers.vue').default);
Vue.component('policy', require('./pages/docs/Policy.vue').default);
Vue.component('terms', require('./pages/docs/Terms.vue').default);
Vue.component('api', require('./pages/docs/Api.vue').default);
Vue.component('fees', require('./pages/info/Fees.vue').default);
Vue.component('status', require('./pages/info/Status.vue').default);
Vue.component('contacts', require('./pages/info/Contacts.vue').default);

export default new Vue({
	i18n,
	vuetify,
	store,
	render: h => h(App),
}).$mount('#app');
