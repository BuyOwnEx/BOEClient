export default {
	computed: {
		getPriceScale() {
			const marketItem = this.$store.state.tickers.markets[
				this.market.toUpperCase()
			];
			const currencyItem = marketItem.find(
				item => item.currency === this.currency.toUpperCase()
			);

			return currencyItem.rateScale;
		},
	},
};
