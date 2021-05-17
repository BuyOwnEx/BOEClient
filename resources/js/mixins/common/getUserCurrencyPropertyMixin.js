export default {
	computed: {
		userBalances() {
			return this.$store.state.user.balances;
		},
	},

	methods: {
		getCurrencyLogo(currency) {
			if (this.userBalances) return this.userBalances[currency]?.logo;
		},
		getCurrencyColor(currency) {
			if (this.userBalances) return this.userBalances[currency]?.color;
		},
		getCurrencyType(currency) {
			if (this.userBalances) return this.userBalances[currency]?.type;
		},
	},
};
