export default {
	namespaced: true,
	state: {
		tickersList: null,
		markets: null,
	},
	mutations: {
		setTickersList(state, list) {
			state.tickersList = list;
		},
		updateSingleTicker(state, ticker) {
			if (state.tickersList === null) {
				state.tickersList = [ticker];
				return;
			}
			let list = state.tickersList;
			let i = _.findIndex(list, (item) => {
				return item.currency === ticker.currency && item.market === ticker.market;
			});
			if (i !== -1) {
				list[i] = ticker;
				state.tickersList = list;
			}
		},
		setMarketData(state, list) {
			state.markets = list;
		},
	},
	actions: {
		getTickersListFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios.get('/trader/ext/tickers')
					.then(response => {
						commit('setTickersList', response.data.data);
						resolve();
					}).catch(error => {
					console.log(error);
					reject();
				});
			});
		},
		getMarketDataFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				axios.get('/trader/ext/market_data')
					.then(response => {
						commit('setMarketData', response.data.data);
						resolve();
					}).catch(error => {
					console.log(error);
					reject();
				});
			});
		},
	},
};