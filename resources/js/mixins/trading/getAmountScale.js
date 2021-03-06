export default {
	computed: {
		getAmountScale() {
			const marketsData = this.$store.state.tickers.markets;
			if (marketsData) {
				const marketItem = marketsData[this.market.toUpperCase()];
				const currencyItem = marketItem.find(
					item => item.currency === this.currency.toUpperCase()
				);

				return currencyItem.amountScale;
			}
		},
	},
};
