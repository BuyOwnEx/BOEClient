import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	methods: {
		formatSize(size, scale) {
			return BigNumber(size)
				.toFixed(scale)
				.toString();
		},

	},
};
