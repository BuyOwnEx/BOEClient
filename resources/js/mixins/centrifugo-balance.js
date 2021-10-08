import Centrifuge from 'centrifuge';

export default {
	name: 'CentrifugeTrading',

	data() {
		return {
			sub_state: null,
			centrifuge: null,
			connected: false,
		};
	},

	methods: {
		initWSConnection() {
			this.centrifuge = new Centrifuge(
				process.env.MIX_WS_SERVER,
				{
					debug: true,
					subscribeEndpoint: '/trader/ext/private',
					subscribeHeaders: {
						'X-CSRF-TOKEN': document
							.querySelector('meta[name="csrf-token"]')
							.getAttribute('content'),
					},
					refreshEndpoint: '/trader/ext/refresh',
					refreshHeaders: {
						'X-CSRF-TOKEN': document
							.querySelector('meta[name="csrf-token"]')
							.getAttribute('content'),
					},
					refreshAttempts: 3,
					onRefreshFailed: () => {
						window.location.href = '/';
					},
				}
			);
			if (this.$store.getters['app/isLogged']) {
				this.getInitTraderData();
				this.subscribePublic();
				this.$store.dispatch('user/getTraderTokenFromServer').then(resp => {
					this.centrifuge.setToken(resp.token);
					this.centrifuge.on('publish', this.privatePubHandler);
					this.centrifuge.on('connect', this.onConnectHandler);
					this.centrifuge.on('disconnect', this.onDisconnectHandler);
					this.connect();
				});
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
		},
		subscribePublic() {
			this.sub_state = this.centrifuge.subscribe('public:nodes');
			this.sub_state.on('subscribe', this.channelSubscribeHandler);
			this.sub_state.on('publish', this.statePubHandler);
			this.sub_state.on('error', this.channelErrorHandler);
			this.sub_state.on('unsubscribe', this.channelUnsubscribeHandler);
		},
		privatePubHandler(data) {
			console.log(data);
			switch (data.data.action) {
				case 'balance_was_updated':
					console.log(data.data.balance);
					this.$store.commit('user/updateBalance', data.data.balance);
					break;
				case 'address_was_formed':
					console.log(data.data.address);
					this.$store.commit('user/setAddress', data.data.address);
					break;
				case 'address_was_validated':
					this.$store.commit('user/setAddressValidation', data.data.validation);
					break;
			}
		},
		statePubHandler(data) {
			switch (data.data.action) {
				case 'state_was_changed':
					this.$store.commit('user/updateCurrencyState', data.data.data);
					break;
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
		this.$eventHub.$on('set-user', this.initWSConnection);
	},
	created() {
		//console.log('centrifugo balance created...');
		//this.$eventHub.$on('set-user', this.initWSConnection);
	},
	beforeDestroy() {
		this.$eventHub.$off('set-user', this.initWSConnection);
	},
	activated() {
		//this.$eventHub.$on('set-user', this.initWSConnection);
	},
	deactivated() {
		//this.$eventHub.$off('set-user', this.initWSConnection);
	},
};
