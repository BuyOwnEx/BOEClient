import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	methods: {
		formatPrice(price) {
			return BigNumber(price)
				.toFixed(2)
				.toString();
		},
	},
};
