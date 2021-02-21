import Vue from 'vue'
import Vuex from 'vuex'

// Global vuex
import AppModule from './app'

// Example Apps
import BoardModule from '../apps/board/store'
import EmailModule from '../apps/email/store'
import TodoModule from '../apps/todo/store'
import tickers from './modules/tickers'
import trading from './modules/trading'
import user from './modules/user'
import snackbars from './modules/snackbars'

Vue.use(Vuex);

/**
 * Main Vuex Store
 */
const store = new Vuex.Store({
  modules: {
    app: AppModule,
    tickers: tickers,
    trading: trading,
    user: user,
    snackbars: snackbars,
    'board-app': BoardModule,
    'email-app': EmailModule,
    'todo-app': TodoModule
  }
});

export default store
