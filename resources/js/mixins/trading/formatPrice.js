import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	methods: {
		formatPrice(price, scale) {
			return BigNumber(price)
				.toFixed(scale)
				.toString();
		},
	},
};
