import Centrifuge from 'centrifuge';

export default {
	name: 'CentrifugeTrading',
	data() {
		return {
			centrifuge: null,
			connected: false,
		};
	},
	computed: {
		isAuth() {
			return this.$store.getters.isLogged;
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
		privatePubHandler(data) {
			console.log(data);
			switch (data.data.action) {
				case 'balance_was_updated':
					console.log(data.data.balance);
					this.$store.commit('user/updateBalance', data.data.balance);
					break;
			}
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