import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	methods: {
		calculateVolume(item) {
			return BigNumber(item.price)
				.times(BigNumber(item.actualSize))
				.toString();
		},
	},
};
