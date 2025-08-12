import Vue from 'vue';
import Vuex from 'vuex';

import app from './app';

import trading from './modules/trading';
import exchange from './modules/exchange';
import tickers from './modules/tickers';
import ordersTooltip from './modules/ordersTooltip';
import chat from './modules/chat';

import balance from './modules/balance';
import support from './modules/support';
import notifications from './modules/notifications';

import user from './modules/user';
import snackbar from './modules/snackbar';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		app,
		trading,
		exchange,
		tickers,
		tooltip: ordersTooltip,
		chat,
		balance,
		support,
		notifications,
		user,
		snackbar,
	},
});

export default store;
