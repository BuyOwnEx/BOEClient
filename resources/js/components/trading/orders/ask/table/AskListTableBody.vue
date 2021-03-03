<template>
	<tbody v-if="ordersData" class="ask-list-table-body">
		<tr
			v-for="(item, itemIndex) in ordersData"
			class="ask-list-table-body__row"
			:class="{
				'orders-active-row': isAboveThanHoverElement(itemIndex, 'ask'),
			}"
			@mouseover="selectItemHover(item)"
			@mouseout="clearSelectedRowIndex"
			@click="emitPrice(item.price)"
		>
			<td>
				<div class="ask-list-table-body__tooltip-volume-wrapper text-left">
					<OrdersWall
						:item-index="itemIndex"
						:volume="calculateVolume(item)"
						:volume-depth="volumeDepth"
						type="ask"
					/>

					<div class="ask-list-table-body__item--volume">
						<span>{{ calculateVolume(item) }}</span>
					</div>
				</div>
			</td>

			<td>
				<div class="ask-list-table-body__item--size">
					{{ formatSize(item.actualSize, getAmountScale) }}
				</div>
			</td>

			<td>
				<div class="ask-list-table-body__item--price">
					<strong class="text-danger">
						{{ formatPrice(item.price, getPriceScale) }}
					</strong>
				</div>
			</td>
		</tr>
	</tbody>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import OrdersWall from '../../OrdersWall';

import formatPrice from '../../../../../mixins/trading/formatPrice';
import formatSize from '../../../../../mixins/trading/formatSize';
import getPriceScale from '../../../../../mixins/trading/getPriceScale';
import getAmountScale from '../../../../../mixins/trading/getAmountScale';
import calculateVolume from '../../../../../mixins/trading/calculateVolume';

export default {
	name: 'AskListTableBody',

	mixins: [formatPrice, formatSize, getPriceScale, getAmountScale, calculateVolume],

	components: { OrdersWall },

	props: {
		ordersData: {
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
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
	},

	computed: {
		...mapGetters('tooltip', ['isAboveThanHoverElement']),
	},

	methods: {
		...mapActions('tooltip', [
			'selectedItemHoverHandler',
			'clearSelectedRowIndex',
		]),

		emitPrice(itemPrice) {
			this.$eventHub.$emit('set-buy-price', { price: itemPrice });
		},

		calculatePercent(actualSize) {
			return BigNumber(actualSize)
				.times(100)
				.div(BigNumber(this.volumeDepth))
				.dp(2)
				.toString();
		},

		selectItemHover(item) {
			const payload = {
				item,
				type: 'ask',
				ordersData: this.ordersData,
				priceScale: this.getPriceScale,
				amountScale: this.getAmountScale,
			};
			this.selectedItemHoverHandler(payload);
		},
	},
};
</script>

<style scoped lang="sass">
.ask-list-table-body
	&__row
		cursor: default !important

		&:hover
			background: rgba(255, 220, 215, 0.35) !important

.orders-active-row
	background: rgba(255, 220, 215, 0.35)
</style>
