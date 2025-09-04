import Centrifuge from 'centrifuge';

export default {
	name: 'CentrifugeExchange',
	data() {
		return {
			sub_depth: null,
			centrifuge: null,
			connected: false,
			needWatch: true,
		};
	},
	computed: {
		pair: function() {
			return [this.selectedCurrencyOut, this.selectedCurrencyIn];
		},
	},
	watch: {
		pair(val, oldVal) {
			if (oldVal[0] !== null && oldVal[1] !== null && this.needWatch) {
				this.unsubscribePublic();
				this.subscribePublic();
			}
		},
	},
	methods: {
		initWSConnection() {
			this.centrifuge = new Centrifuge(import.meta.env.VITE_WS_SERVER, {
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
		disconnect() {
			this.centrifuge.disconnect();
		},
		getInitTraderData() {
			if (this.$store.state.user.balances === null) {
				this.$store.dispatch('user/getBalancesFromServer');
			}
		},
		subscribePublic() {
			this.$store.dispatch('exchange/getOrderBookFromExchange').then(() => {
				this.sub_depth = this.centrifuge.subscribe('public:otc_depth_' + this.selectedCurrencyOut.toLowerCase() + '_' + this.selectedCurrencyIn.toLowerCase());
				this.sub_depth.on('subscribe', this.channelSubscribeHandler);
				this.sub_depth.on('publish', this.updateDepthPubHandler);
				this.sub_depth.on('error', this.channelErrorHandler);
				this.sub_depth.on('unsubscribe', this.channelUnsubscribeHandler);
			});
		},
		unsubscribePublic() {
			if(this.sub_depth)
			{
				this.sub_depth.unsubscribe();
				this.sub_depth.removeAllListeners();
			}
		},
		unsubscribeAll() {
			if(this.sub_depth)
			{
				this.sub_depth.unsubscribe();
				this.sub_depth.removeAllListeners();
			}
		},
		privatePubHandler(data) {
			console.log(data);
			switch (data.data.action) {
				case 'balance_was_updated':
					console.log(data.data.balance);
					this.$store.commit('user/updateBalance', data.data.balance);
					break;
			}
		},
		updateDepthPubHandler(data) {
			this.$store.commit('exchange/setAskList', data.data.depth.asks);
			this.$store.commit('exchange/setBidList', data.data.depth.bids);
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
		this.initWSConnection();
	},
	beforeDestroy() {
		this.$eventHub.$off('set-user', this.initWSConnection);
	},
	beforeRouteLeave(to, from, next) {
		this.unsubscribeAll();
		this.needWatch = false;
		this.disconnect();
		next();
	},
};