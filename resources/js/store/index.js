import Vue from 'vue';
import Vuex from 'vuex';

// Global vuex
import AppModule from './app';

// Example Apps
import BoardModule from '../apps/board/store';
import EmailModule from '../apps/email/store';
import TodoModule from '../apps/todo/store';

import tickers from './modules/tickers';
import trading from './modules/trading';
import chat from './modules/chat';
import user from './modules/user';
import ordersTooltip from './modules/ordersTooltip';
import snackbar from './modules/snackbar';

Vue.use(Vuex);

/**
 * Main Vuex Store
 */
const store = new Vuex.Store({
	modules: {
		app: AppModule,
		tickers: tickers,
		trading: trading,
		chat: chat,
		user: user,
		snackbar: snackbar,
		tooltip: ordersTooltip,
		'board-app': BoardModule,
		'email-app': EmailModule,
		'todo-app': TodoModule,
	},
});

export default store;
