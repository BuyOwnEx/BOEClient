import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	methods: {
		formatWithCurrencyScale(value, currency) {
			const scale = this.findCurrencyScale(currency.toUpperCase());

			if (scale) {
				return BigNumber(value).toFixed(scale, 1);
			} else {
				return BigNumber(value).toFixed(2, 1);
			}
		},

		findCurrencyScale(currency) {
			const allCurrencies = this.$store.state.trading.all_currencies;
			const isCurrenciesInit = this.$store.state.trading.allCurrencyListInit;

			if (isCurrenciesInit) {
				const storeCurrencyItem = allCurrencies.find(
					currencyItem =>
						currencyItem.currency.toUpperCase() === currency.toUpperCase()
				);

				if (storeCurrencyItem) return storeCurrencyItem.scale;
			}
		},
	},
};
