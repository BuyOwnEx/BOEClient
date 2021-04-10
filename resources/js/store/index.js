import Vue from 'vue';
import Vuex from 'vuex';

import AppModule from './app';

import BoardModule from '../apps/board/store';
import EmailModule from '../apps/email/store';
import TodoModule from '../apps/todo/store';

import trading from './modules/trading';
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
		app: AppModule,

		trading,
		tickers,
		tooltip: ordersTooltip,
		chat,

		balance,
		support,
		notifications,
		user,

		snackbar,

		'board-app': BoardModule,
		'email-app': EmailModule,
		'todo-app': TodoModule,
	},
});

export default store;
