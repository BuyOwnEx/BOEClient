import Centrifuge from 'centrifuge';

export default {
	name: 'CentrifugeTrading',
	data() {
		return {
			sub_order_book: null,
			sub_history_deals: null,
			sub_graph: null,
			sub_tickers: null,
			sub_markets: null,
			centrifuge: null,
			connected: false,
		};
	},
	computed: {
		tickersFromStorage() {
			return this.$store.state.tickers.tickersList;
		},
		pair: function() {
			return [this.selectedCurrency, this.selectedMarket];
		},
		orderBookInitialized() {
			return this.$store.state.trading.orderBookInit;
		},
		historyDealInitialized() {
			return this.$store.state.trading.historyDealListInit;
		},
		period() {
			return this.$store.state.trading.selectedPeriod;
		},
		isAuth() {
			return this.$store.getters.isLogged;
		},
	},
	watch: {
		pair(val, oldVal) {
			if (oldVal[0] !== null && oldVal[1] !== null) {
				this.unsubscribePublic(oldVal[0], oldVal[1]);
				this.subscribePublic();
			}
		},
		period(val, oldVal) {
			if (oldVal !== null) {
				this.unsubscribeGraphPeriod();
				this.subscribeGraphPeriod();
			}
		},
	},
	methods: {
		initWSConnection() {
			this.centrifuge = new Centrifuge('ws://188.127.235.78:7000/connection/websocket', {
				debug: true,
				subscribeEndpoint: '/trader/ext/private',
				subscribeHeaders: {
					'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
				},
				refreshEndpoint: '/trader/ext/refresh',
				refreshHeaders: {
					'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
				},
				refreshAttempts: 3,
				onRefreshFailed: () => {
					window.location.href = '/';
				},
			});
			if (this.isAuth) {
				this.getInitTraderData();
				this.subscribePublic();
				this.$store.dispatch('user/getTraderTokenFromServer').then(resp => {
					console.log(resp);
					this.centrifuge.setToken(resp.token);
					this.centrifuge.on('publish', this.privatePubHandler);
					this.centrifuge.on('connect', this.onConnectHandler);
					this.centrifuge.on('disconnect', this.onDisconnectHandler);
					this.connect();
				});
			} else {
				this.centrifuge.on('connect', this.onConnectHandler);
				this.centrifuge.on('disconnect', this.onDisconnectHandler);
				this.subscribePublic();
				this.connect();
			}
		},
		onConnectHandler(context) {
			this.connected = true;
		},
		onDisconnectHandler(context) {
			this.connected = false;
		},
		connect() {
			this.centrifuge.connect();
		},
		getInitTraderData() {
			if (this.$store.state.user.balances === null) {
				this.$store.dispatch('user/getBalancesFromServer');
			}
			if (this.$store.state.user.orders === null) {
				this.$store.dispatch('user/getOrdersFromServer');
			}
			if (this.$store.state.user.deals === null) {
				this.$store.dispatch('user/getDealsFromServer');
			}
			if (this.$store.state.user.positions === null) {
				this.$store.dispatch('user/getPositionsFromServer');
			}
		},
		subscribePublic() {
			this.$store.dispatch('tickers/getMarketDataFromServer').then(resp => {
				this.sub_markets = this.centrifuge.subscribe('public:markets');
				this.sub_markets.on('subscribe', this.channelSubscribeHandler);
				this.sub_markets.on('publish', this.marketsPubHandler);
				this.sub_markets.on('error', this.channelErrorHandler);
				this.sub_markets.on('unsubscribe', this.channelUnsubscribeHandler);
			});
			this.$store.dispatch('tickers/getTickersListFromServer').then(resp => {
				this.sub_tickers = this.centrifuge.subscribe('public:tickers');
				this.sub_tickers.on('subscribe', this.channelSubscribeHandler);
				this.sub_tickers.on('publish', this.tickersPubHandler);
				this.sub_tickers.on('error', this.channelErrorHandler);
				this.sub_tickers.on('unsubscribe', this.channelUnsubscribeHandler);
			});
			this.$store.dispatch('trading/getOrderBookFromServer').then(resp => {
				if (resp.asks_list.length !== 0) {
					this.$eventHub.$emit('set-buy-price', { price: resp.asks_list[0].price });
				}
				if (resp.bids_list.length !== 0) {
					this.$eventHub.$emit('set-sell-price', { price: resp.bids_list[0].price });
				}
				this.sub_order_book = this.centrifuge.subscribe('public:order_book_' + this.selectedCurrency.toLowerCase() + '_' + this.selectedMarket.toLowerCase());
				this.sub_order_book.on('subscribe', this.channelSubscribeHandler);
				this.sub_order_book.on('publish', this.orderBookPubHandler);
				this.sub_order_book.on('error', this.channelErrorHandler);
				this.sub_order_book.on('unsubscribe', this.channelUnsubscribeHandler);
			});
			this.$store.dispatch('trading/getHistoryDealListFromServer').then(resp => {
				this.sub_history_deals = this.centrifuge.subscribe('public:history_deals_' + this.selectedCurrency.toLowerCase() + '_' + this.selectedMarket.toLowerCase());
				this.sub_history_deals.on('subscribe', this.channelSubscribeHandler);
				this.sub_history_deals.on('publish', this.historyDealPubHandler);
				this.sub_history_deals.on('error', this.channelErrorHandler);
				this.sub_history_deals.on('unsubscribe', this.channelUnsubscribeHandler);
			});
			this.$store.dispatch('trading/getGraphFromServer', { vm: this }).then(resp => {
				this.sub_graph = this.centrifuge.subscribe('public:graph_' + this.period + '_' + this.selectedCurrency.toLowerCase() + '_' + this.selectedMarket.toLowerCase());
				this.sub_graph.on('subscribe', this.channelSubscribeHandler);
				this.sub_graph.on('publish', this.graphPubHandler);
				this.sub_graph.on('error', this.channelErrorHandler);
				this.sub_graph.on('unsubscribe', this.channelUnsubscribeHandler);
			});
		},

		subscribeGraphPeriod() {
			this.$store.dispatch('trading/getGraphFromServer', { vm: this }).then(resp => {
				this.sub_graph = this.centrifuge.subscribe('public:graph_' + this.period + '_' + this.selectedCurrency.toLowerCase() + '_' + this.selectedMarket.toLowerCase());
				this.sub_graph.on('subscribe', this.channelSubscribeHandler);
				this.sub_graph.on('publish', this.graphPubHandler);
				this.sub_graph.on('error', this.channelErrorHandler);
				this.sub_graph.on('unsubscribe', this.channelUnsubscribeHandler);
			});
		},
		unsubscribePublic(currency, market) {
			currency = currency.toLowerCase();
			market = market.toLowerCase();
			this.sub_order_book.unsubscribe();
			this.sub_order_book.removeAllListeners();
			this.$store.commit('trading/resetOrderBook');

			this.sub_history_deals.unsubscribe();
			this.sub_history_deals.removeAllListeners();
			this.$store.commit('trading/resetHistoryDealList');

			this.sub_graph.unsubscribe();
			this.sub_graph.removeAllListeners();
			//this.$store.commit('trading/resetGraphList');

		},
		unsubscribeGraphPeriod() {
			this.sub_graph.unsubscribe();
			this.sub_graph.removeAllListeners();
			//this.$store.commit('trading/resetGraphList');
		},
		privatePubHandler(data) {
			console.log(data);
			switch (data.data.action) {
				case 'balance_was_updated':
					console.log(data.data.balance);
					this.$store.commit('user/updateBalance', data.data.balance);
					break;
				case 'margin_call':
					this.$store.commit('user/getMarginCall', data.data.position);
					break;
				case 'order_was_created':
					this.$store.commit('user/addOrder', data.data.order);
					break;
				case 'conditional_order_was_updated':
					this.$store.commit('user/updateConditionOrder', data.data.order);
					break;
				case 'match_order_was_updated':
					this.$store.commit('user/updateMatchOrder', data.data.order);
					break;
				case 'order_was_deleted':
					this.$store.commit('user/deleteOrder', data.data.order);
					break;
				case 'own_deal_was_completed':
					this.$store.commit('user/addDeal', data.data.deal);
					break;
				case 'position_was_created':
					this.$store.commit('user/addPosition', data.data.position);
					break;
				case 'position_was_closed':
					this.$store.commit('user/deletePosition', data.data.position);
					break;
				case 'position_was_updated':
					this.$store.commit('user/updatePosition', data.data.position);
					break;
				case 'match_position_was_updated':
					this.$store.commit('user/updateMatchPosition', data.data.position);
					break;
			}
		},
		marketsPubHandler(data) {
			console.log(data);
		},
		tickersPubHandler(data) {
			let ticker = _.find(this.tickersFromStorage, item => {
				return item.market.toLowerCase() === data.data.ticker.market.toLowerCase() && item.currency.toLowerCase() === data.data.ticker.currency.toLowerCase();
			});
			if (ticker === undefined) {
				return;
			}
			switch (data.data.action) {
				case 'update_ticker':
					ticker.bid = data.data.ticker.bid_price;
					ticker.ask = data.data.ticker.ask_price;
					this.$store.commit('tickers/updateSingleTicker', ticker);
					break;
				case 'day_change_ticker':
					ticker.previous_day = data.data.ticker.price;
					this.$store.commit('tickers/updateSingleTicker', ticker);
					break;
				case 'last_deal_ticker':
					ticker.latest = data.data.ticker.price;
					ticker.previous = data.data.ticker.prev_price;
					this.$store.commit('tickers/updateSingleTicker', ticker);
					break;
				case 'max_day_ticker':
					ticker.max = data.data.ticker.max;
					this.$store.commit('tickers/updateSingleTicker', ticker);
					break;
				case 'min_day_ticker':
					ticker.min = data.data.ticker.min;
					this.$store.commit('tickers/updateSingleTicker', ticker);
					break;
				case 'day_volume_ticker':
					ticker.volume = data.data.ticker.volume;
					this.$store.commit('tickers/updateSingleTicker', ticker);
					break;
			}
		},
		historyDealPubHandler(data) {
			this.$store.commit('trading/addDealToHistoryDealList', data.data);
		},
		orderBookPubHandler(data) {
			if (data.data.side) {
				this.$store.commit('trading/setAskList', data.data.levels);
			} else {
				this.$store.commit('trading/setBidList', data.data.levels);
			}
		},
		graphPubHandler(data) {
			if (data.data.action === 'addPoint') {
				this.$eventHub.$emit('addedPoint', { point: data.data.point });
			}
			if (data.data.action === 'updatePoint') {
				this.$eventHub.$emit('updatedPoint', { point: data.data.point });
			}
		},
		channelSubscribeHandler(context) {
			console.log(context);
		},
		channelUnsubscribeHandler(context) {
			console.log(context);
		},
		channelErrorHandler(err) {
			console.log(err);
		},
	},
	mounted() {

	},
	created() {
		this.$eventHub.$on('set-user', this.initWSConnection);
	},
	beforeDestroy() {
		this.$eventHub.$off('set-user', this.initWSConnection);
	},
	activated() {
		this.$eventHub.$on('set-user', this.initWSConnection);
	},
	deactivated() {
		this.$eventHub.$off('set-user', this.initWSConnection);
	},
};
