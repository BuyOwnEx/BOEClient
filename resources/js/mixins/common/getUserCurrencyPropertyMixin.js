export default {
	methods: {
		getCurrencyLogo(currency) {
			return this.$store.state.user?.balances[currency]?.logo;
		},
		getCurrencyColor(currency) {
			return this.$store.state.user?.balances[currency]?.color;
		},
		getCurrencyType(currency) {
			return this.$store.state.user?.balances[currency]?.type;
		},
	},
};
