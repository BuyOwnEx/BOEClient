export default {
	methods: {
		findScale(market, currency, scaleType) {
			const marketsData = this.$store.state.tickers.markets;
			if (marketsData) {
				const marketItem = marketsData[market.toUpperCase()];
				const currencyItem = marketItem.find(
					item => item.currency === currency.toUpperCase()
				);

				return currencyItem[scaleType];
			}
		},
	},
};
