<template>
	<tbody v-if='bidData' class='bid-list__content__table__body'>
	<tr
		v-for='(item, idx) in bidData'
		:class='{ active: isAboveThanHoverElement(idx) }'
		style='position: relative'
		@mouseover='selectedItemHoverHandler(item)'
		@mouseout='clearSelectedItemIndex'
	>
		<td>
			<div class='bid-list__content__table__body__item--price'>
				<strong class='text-success'>
					{{ formatPrice(item.price) }}
				</strong>
			</div>
		</td>

		<td>
			<div class='bid-list__content__table__body__item--amount'>
				{{ formatSize(item.actualSize) }}
			</div>
		</td>

		<td>
			<div class='bid-list__content__table__body__item--date'>
				<!--					v-if="idx === selectedItemIndex"-->
				<!--					style="position: absolute; top: 70px; left: 330px; right: -500px; width: 150px; height: 100px; background: green; padding: 16px 8px"-->
				<div
					style='position: absolute; top: 0; left: 0; right: 0; width: 150px; height: 100px; background: #06d6a0; padding: 16px 8px'
				>
					<div>index - {{ selectedItemIndex }}</div>
					<div>avgPrice - {{ averagePrice }}</div>
					<div>sumMarket - {{ sumMarket }}</div>
					<div>sumCurrency - {{ sumCurrency }}</div>
				</div>

				<span>{{ calculateVolume(item.price, item.actualSize) }}</span>
			</div>
		</td>
	</tr>
	</tbody>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatPrice from '../../../../../mixins/trading/formatPrice';
import formatSize from '../../../../../mixins/trading/formatSize';

export default {
	name: 'BidListTableBody',

	mixins: [formatPrice, formatSize],

	props: {
		bidData: {
			type: Array,
			required: true,
		},
		amountDepth: {
			type: Number,
			required: true,
		},
		volumeDepth: {
			type: Number,
			required: true,
		},
		best: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			selectedItemIndex: -1,
			averagePrice: 0,
			sumMarket: 0,
			sumCurrency: 0,
		};
	},

	methods: {
		calculateVolume(price, actualSize) {
			return BigNumber(price)
				.times(BigNumber(actualSize))
				.toString();
		},
		calculatePercent(actualSize) {
			return BigNumber(actualSize)
				.times(100)
				.div(BigNumber(this.volumeDepth))
				.dp(2)
				.toString();
		},

		isAboveThanHoverElement(itemToCompareIndex) {
			const mainItemIndex = this.selectedItemIndex;
			return itemToCompareIndex <= mainItemIndex;
		},

		selectedItemHoverHandler(item) {
			this.setSelectedItemIndex(item);
			this.setDataForMenu();
		},

		setSelectedItemIndex(item) {
			this.selectedItemIndex = this.bidData.findIndex(el => {
				return el.price === item.price;
			});
		},
		clearSelectedItemIndex() {
			this.selectedItemIndex = -1;
		},
		setDataForMenu() {
			let averagePrice = 0;
			let sumMarket = 0;
			let sumCurrency = 0;
			const mainItemIndex = this.selectedItemIndex;
			const itemsBeforeMainIndex = this.bidData.filter(
				(item, index) => index <= mainItemIndex,
			);

			itemsBeforeMainIndex.forEach(item => {
				averagePrice += item.price;
				// sumMarket +=
				// sumCurrency +=
			});

			this.averagePrice = averagePrice / itemsBeforeMainIndex.length;
			// TODO доделать позже
		},
	},
};
</script>

<style scoped lang='sass'>
.active
	background: var(--v-success-lighten1) !important
</style>
