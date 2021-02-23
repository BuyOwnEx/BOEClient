import Centrifuge from 'centrifuge';

export default {
	name: 'CentrifugeTrading',
	data() {
		return {
			sub_order_book: null,
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
		selectedCurrency() {
			return this.$store.state.trading.selectedCurrency;
		},
		selectedMarket() {
			return this.$store.state.trading.selectedMarket;
		}
	},
	watch: {
		pair(val, oldVal) {
			if (oldVal[0] !== null && oldVal[1] !== null) {
				this.unsubscribePublic(oldVal[0], oldVal[1]);
				this.subscribePublic();
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
			if (this.$store.getters["app/isLogged"]) {
				this.subscribePublic();

				this.$store.dispatch('user/getTraderTokenFromServer').then(resp => {
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
					this.$eventHub.$emit('updateDepth', { asks_list: resp.asks_list });
				}
				if (resp.bids_list.length !== 0) {
					this.$eventHub.$emit('updateDepth', { bids_list: resp.bids_list });
				}
				this.sub_order_book = this.centrifuge.subscribe('public:order_book_' + this.selectedCurrency.toLowerCase() + '_' + this.selectedMarket.toLowerCase());
				this.sub_order_book.on('subscribe', this.channelSubscribeHandler);
				this.sub_order_book.on('publish', this.orderBookPubHandler);
				this.sub_order_book.on('error', this.channelErrorHandler);
				this.sub_order_book.on('unsubscribe', this.channelUnsubscribeHandler);
			});
		},
		unsubscribePublic(currency, market) {
			currency = currency.toLowerCase();
			market = market.toLowerCase();
			this.sub_order_book.unsubscribe();
			this.sub_order_book.removeAllListeners();
			this.$store.commit('trading/resetOrderBook');
		},
		privatePubHandler(data) {
			console.log(data);
			switch (data.data.action) {

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
		orderBookPubHandler(data) {
			if (data.data.side) {
				this.$store.commit('trading/setAskList', data.data.levels);
				this.$eventHub.$emit('updateDepth', { asks_list: data.data.levels });
			} else {
				this.$store.commit('trading/setBidList', data.data.levels);
				this.$eventHub.$emit('updateDepth', { bids_list: data.data.levels });
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