import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	methods: {
		formatWithCurrencyScale(value, currency) {
			console.log('init', value, currency);
			const scale = this.findCurrencyScale(currency.toUpperCase());
			console.log('scale', scale);
			if (scale) {
				return BigNumber(value).toFixed(scale, 1);
			} else {
				return BigNumber(value).toFixed(2, 1);
			}
		},

		findCurrencyScale(currency) {
			const allCurrencies = this.$store.state.trading.all_currencies;
			console.log(this.$store.state.trading);
			if (allCurrencies) {
				console.log('curr, all curr', currency, allCurrencies);

				const storeCurrencyItem = allCurrencies.find(currencyItem => {
					console.log(
						'find',
						currencyItem.currency.toUpperCase(),
						currency.toUpperCase()
					);
					return currencyItem.currency.toUpperCase() === currency.toUpperCase();
				});

				console.log('store item', storeCurrencyItem);
				if (storeCurrencyItem) return storeCurrencyItem.scale;
			}
		},
	},
};
