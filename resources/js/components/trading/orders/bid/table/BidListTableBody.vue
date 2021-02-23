<template>
	<tbody v-if='bidData' class='bid-list-table-body'>
	<tr
		v-for='(item, itemIndex) in bidData'
		class='bid-list-table-body__row'
		:class="{ 'orders-active-row': isAboveThanHoverElement(itemIndex) }"
		@mouseover='selectedItemHoverHandler(item)'
		@mouseout='clearSelectedItemIndex'
	>
		<td>
			<div class='bid-list-table-body__item--price'>
				<strong class='text-success'>
					{{ formatPrice(item.price) }}
				</strong>
			</div>
		</td>

		<td>
			<div class='bid-list-table-body__item--size'>
				{{ formatSize(item.actualSize) }}
			</div>
		</td>

		<td>
			<div class='bid-list-table-body__tooltip-volume-wrapper'>
				<OrdersTooltip
					:item-index='itemIndex'
					:row-index='selectedItemIndex'
					:average-price='averagePrice'
					:sum-size='sumSize'
					:sum-volume='sumVolume'
					type='bid'
				/>

				<OrdersWall
					:item-index='itemIndex'
					:volume='calculateVolume(item.price, item.actualSize)'
					:total-volume='1000'
					type='bid'
				/>

				<div class='bid-list-table-body__item--volume'>
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
import OrdersWall from '../../OrdersWall';

import formatPrice from '../../../../../mixins/trading/formatPrice';
import formatSize from '../../../../../mixins/trading/formatSize';
import ordersTooltipMethods from '../../../../../mixins/trading/ordersTooltipMethods';

export default {
	name: 'BidListTableBody',

	mixins: [formatPrice, formatSize, ordersTooltipMethods],

	components: { OrdersTooltip, OrdersWall },

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
.bid-list-table-body
	&__row
		cursor: default !important

		&:hover
			background: rgba(215, 255, 216, 0.35) !important

.orders-active-row
	background: rgba(215, 255, 216, 0.35)
</style>
