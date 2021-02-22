import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
const intervals = [
	{ room: 1, range: '1m' },
	{ room: 5, range: '5m' },
	{ room: 15, range: '15m' },
	{ room: 30, range: '30m' },
	{ room: 60, range: '1h' },
	{ room: 240, range: '4h' },
	{ room: 1440, range: '1d' },
	{ room: 10080, range: '1w' },
];
export default {
	namespaced: true,
	state: {
		selectedMarket: null,
		selectedCurrency: null,

		ask_list: null,
		bid_list: null,
		ask_amount_depth: 0,
		bid_amount_depth: 0,
		ask_volume_depth: 0,
		bid_volume_depth: 0,
		best_ask: 0,
		best_bid: 0,

		history_deal_list: null,
		history_length_limit: 50,
		orderBookInit: false,
		historyDealListInit: false,

		selectedPeriod: null,
		selectedRoom: null,
		valuesToDisplay: 97,
		candlesData: [],
		volumeData: [],
	},
	getters: {
		selectedPair: state => {
			return state.selectedCurrency + '/' + state.selectedMarket;
		},
		activeTicker: (state, getters, rootState) => {
			let selectedMarket = state.selectedMarket;
			if (!selectedMarket) {
				return null;
			}
			let selectedCurrency = state.selectedCurrency;
			if (!selectedCurrency) {
				return null;
			}
			let tickersList = rootState.tickers.tickersList;
			if (!tickersList) {
				return null;
			}

			let ticker = _.find(tickersList, item => {
				return item.market.toLowerCase() === selectedMarket.toLowerCase() && item.currency.toLowerCase() === selectedCurrency.toLowerCase();
			});
			return ticker === undefined ? null : ticker;
		},
	},
	mutations: {
		setPair(state, payload) {
			state.selectedCurrency = payload.currency.toLowerCase();
			state.selectedMarket = payload.market.toLowerCase();
		},
		setAskList(state, list) {
			state.ask_list = list;
		},
		setBidList(state, list) {
			state.bid_list = list;
		},
		setAskAmountDepth(state, val) {
			state.ask_amount_depth = val;
		},
		setBidAmountDepth(state, val) {
			state.bid_amount_depth = val;
		},
		setAskVolumeDepth(state, val) {
			state.ask_volume_depth = val;
		},
		setBidVolumeDepth(state, val) {
			state.bid_volume_depth = val;
		},
		setBestAsk(state, val) {
			state.best_ask = val;
		},
		setBestBid(state, val) {
			state.best_bid = val;
		},
		setOrderBookInit(state, val) {
			state.orderBookInit = val;
		},
		resetOrderBook(state) {
			state.ask_list = null;
			state.bid_list = null;
			state.ask_amount_depth = 0;
			state.bid_amount_depth = 0;
			state.ask_volume_depth = 0;
			state.bid_volume_depth = 0;
			state.best_ask = 0;
			state.best_bid = 0;
			state.orderBookInit = false;
		},
		setHistoryDealList(state, list) {
			state.history_deal_list = list;
		},
		addDealToHistoryDealList(state, item) {
			state.history_deal_list.unshift(item.deal);
			if (state.history_deal_list.length > state.history_length_limit) {
				state.history_deal_list.pop();
			}
		},
		setHistoryDealListInit(state, val) {
			state.historyDealListInit = val;
		},
		resetHistoryDealList(state) {
			state.history_deal_list = null;
			state.historyDealListInit = false;
		},
		setGraphPeriod(state, period) {
			state.selectedPeriod = period;
			let room = _.find(intervals, item => {
				return item.range === state.selectedPeriod;
			});
			state.selectedRoom = room.room;
		},
		setGraphData(state, payload) {
			state.candlesData = payload.candlesData;
			state.volumeData = payload.volumeData;
			payload.vm.vm.$eventHub.$emit('initGraphData', { xData: payload.candlesData, yData: payload.volumeData });
		},
	},
	actions: {
		getOrderBookFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				let queryParams = {
					params: {
						currency: this.state.trading.selectedCurrency,
						market: this.state.trading.selectedMarket,
					},
				};
				axios.get('/trader/ext/depth', queryParams).then((response) => {
					commit('setAskList', response.data.asks_list);
					commit('setBidList', response.data.bids_list);
					commit('setAskAmountDepth', response.data.asks_amount);
					commit('setBidAmountDepth', response.data.bids_amount);
					commit('setAskVolumeDepth', response.data.asks_vol);
					commit('setBidVolumeDepth', response.data.bids_vol);
					if (response.data.asks_list.length !== 0) {
						commit('setBestAsk', response.data.asks_list[0].price);
					}
					if (response.data.bids_list.length !== 0) {
						commit('setBestBid', response.data.bids_list[0].price);
					}
					commit('setOrderBookInit', true);
					console.log('Order book ' + this.state.trading.selectedCurrency + '_' + this.state.trading.selectedMarket + ' was getting from API');
					resolve(response.data);
				}).catch(error => {
					console.log(error);
					reject();
				});
			});
		},
		getHistoryDealListFromServer({ commit }) {
			return new Promise((resolve, reject) => {
				let queryParams = {
					params: {
						currency: this.state.trading.selectedCurrency,
						market: this.state.trading.selectedMarket,
					},
				};
				axios.get('/trader/ext/history/deals', queryParams).then((response) => {
					commit('setHistoryDealList', response.data.data);
					commit('setHistoryDealListInit', true);
					console.log('History deal list ' + this.state.trading.selectedCurrency + '_' + this.state.trading.selectedMarket + ' was getting from API');
					resolve(response.data);
				}).catch(error => {
					console.log(error);
					reject();
				});
			});
		},
		getGraphFromServer({ commit }, vm) {
			return new Promise((resolve, reject) => {
				let queryParams = {
					params: {
						currency: this.state.trading.selectedCurrency,
						market: this.state.trading.selectedMarket,
						range: this.state.trading.selectedPeriod,
					},
				};
				axios.get('/trader/ext/graph', queryParams).then((response) => {
					let ohlc = [];
					let volumes = [];

					for (let i = 0; i < response.data.count; i++) {
						ohlc.push({
							x: parseInt(response.data.data[i].x),
							open: BigNumber(response.data.data[i].open).toNumber(),
							high: BigNumber(response.data.data[i].high).toNumber(),
							low: BigNumber(response.data.data[i].low).toNumber(),
							close: BigNumber(response.data.data[i].close).toNumber(),
						});
						volumes.push({
							x: parseInt(response.data.data[i].x),
							y: BigNumber(response.data.data[i].volume).toNumber(),
						});
					}
					ohlc = ohlc.sort((a, b) => {
						return a.x - b.x;
					});
					volumes = volumes.sort((a, b) => {
						return a.x - b.x;
					});
					console.log('Last timestamp OHLC from API: ' + ohlc[ohlc.length - 1].x);
					console.log('Last timestamp VOLUME from API: ' + volumes[volumes.length - 1].x);
					commit('setGraphData', { candlesData: ohlc, volumeData: volumes, vm: vm });
					console.log('Graph data for ' + this.state.trading.selectedCurrency + '_' + this.state.trading.selectedMarket + ' for period ' + this.state.trading.selectedPeriod + ' was getting from API');
					resolve({ candlesData: ohlc, volumeData: volumes });
				}).catch(error => {
					console.log(error);
					reject();
				});
			});
		},
	},
};