import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	methods: {
		calculateVolume(price, size) {
			return BigNumber(price)
				.times(BigNumber(size))
				.toString();
		},
	},
};
