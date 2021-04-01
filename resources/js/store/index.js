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

import support from './modules/support';
import notifications from './modules/notifications';

import user from './modules/user';
import snackbar from './modules/snackbar';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		app: AppModule,

		trading: trading,
		tickers: tickers,
		tooltip: ordersTooltip,
		chat: chat,

		support: support,
		notifications: notifications,

		user: user,
		snackbar: snackbar,

		'board-app': BoardModule,
		'email-app': EmailModule,
		'todo-app': TodoModule,
	},
});

export default store;
