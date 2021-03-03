export default {
	methods: {
		findScale(market, currency, scaleType) {
			const marketItem = this.$store.state.tickers.markets[
				market.toUpperCase()
			];
			const currencyItem = marketItem.find(
				item => item.currency === currency.toUpperCase()
			);

			return currencyItem[scaleType];
		},
	},
};
