export default {
	data() {
		return {
			selectedItemIndex: -1,
			averagePrice: 0,
			sumSize: 0,
			sumVolume: 0,
		};
	},

	methods: {
		isAboveThanHoverElement(itemToCompareIndex) {
			const mainItemIndex = this.selectedItemIndex;
			return itemToCompareIndex <= mainItemIndex;
		},

		selectedItemHoverHandler(item) {
			this.setSelectedItemIndex(item);
			this.setDataForTooltip();
		},

		setSelectedItemIndex(item) {
			this.selectedItemIndex = this.bidData.findIndex(el => {
				return el.price === item.price;
			});
		},
		clearSelectedItemIndex() {
			this.selectedItemIndex = -1;
		},
		setDataForTooltip() {
			let averagePrice = 0;
			let sumSize = 0;
			let sumVolume = 0;
			const mainItemIndex = this.selectedItemIndex;
			const itemsBeforeMainIndex = this.bidData.filter(
				(item, index) => index <= mainItemIndex,
			);

			itemsBeforeMainIndex.forEach(item => {
				averagePrice += item.price;
				sumSize += item.actualSize;
				sumVolume += item.price * item.actualSize;
			});

			this.averagePrice = (averagePrice / itemsBeforeMainIndex.length).toFixed(
				2,
			);
			this.sumSize = sumSize.toFixed(4);
			this.sumVolume = sumVolume.toFixed(4);
		},
	},
};
