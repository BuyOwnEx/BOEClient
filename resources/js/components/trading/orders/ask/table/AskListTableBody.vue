<template>
	<tbody v-if='askData' class='ask-list-table-body'>
	<tr
		v-for='(item, idx) in askData'
		class='ask-list-table-body__row'
		:class="{ 'orders-active-row': isAboveThanHoverElement(idx) }"
		@mouseover='selectedItemHoverHandler(item)'
		@mouseout='clearSelectedItemIndex'
	>
		<td>
			<div class='ask-list-table-body__item--price'>
				<strong class='text-error'>
					{{ formatPrice(item.price) }}
				</strong>
			</div>
		</td>

		<td>
			<div class='ask-list-table-body__item--size'>
				{{ formatSize(item.actualSize) }}
			</div>
		</td>

		<td>
			<div class='ask-list-table-body__tooltip-wrapper'>
				<OrdersTooltip
					:idx='idx'
					:selected-idx='selectedItemIndex'
					:average-price='averagePrice'
					:sum-size='sumSize'
					:sum-volume='sumVolume'
					success-color
				/>

				<div class='ask-list-table-body__item--volume'>
					<span>{{ calculateVolume(item.price, item.actualSize) }}</span>
				</div>
			</div>
		</td>
	</tr>
	</tbody>
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import OrdersTooltip from '../../OrdersTooltip';

import formatPrice from '../../../../../mixins/trading/formatPrice';
import formatSize from '../../../../../mixins/trading/formatSize';
import ordersTooltipMethods from '../../../../../mixins/trading/ordersTooltipMethods';

export default {
	name: 'AskListTableBody',

	mixins: [formatPrice, formatSize, ordersTooltipMethods],

	components: { OrdersTooltip },

	props: {
		askData: {
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
	},
};
</script>

<style scoped lang='sass'>
.ask-list-table-body
	&__row
		position: relative
		cursor: default !important

		&:hover
			background: rgba(255, 220, 215, 0.35) !important

.orders-active-row
	background: rgba(255, 220, 215, 0.35)
</style>
