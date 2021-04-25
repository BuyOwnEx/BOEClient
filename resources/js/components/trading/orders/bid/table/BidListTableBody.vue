<template>
	<tbody v-if="ordersData" class="bid-list-table-body">
		<tr
			v-for="(item, itemIndex) in sortedOrdersData"
			class="bid-list-table-body__row"
			:class="{
				'orders-active-row': isActiveRow(itemIndex, 'bid'),
			}"
			@mouseover="selectItemHover(item)"
			@mouseout="clearSelectedRowIndex"
			@click="emitPrice(item.price)"
		>
			<td>
				<div class="bid-list-table-body__item--price">
					<strong class="success--text">
						{{ formatPrice(item.price, getPriceScale) }}
					</strong>
				</div>
			</td>

			<td>
				<div class="bid-list-table-body__item--size">
					{{ formatSize(item.actualSize, getAmountScale) }}
				</div>
			</td>

			<td>
				<div class="bid-list-table-body__tooltip-volume-wrapper">
					<OrdersWall
						:item-index="itemIndex"
						:volume="calculateVolume(item.price, item.actualSize)"
						type="bid"
					/>

					<div
						class="bid-list-table-body__item--volume text-end"
					>
						<span>{{ calculateVolume(item.price, item.actualSize) }}</span>
					</div>
				</div>
			</td>
		</tr>
	</tbody>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import OrdersWall from '../../common/OrdersWall';

import formatPrice from '../../../../../mixins/trading/formatPrice';
import formatSize from '../../../../../mixins/trading/formatSize';
import getPriceScale from '../../../../../mixins/trading/getPriceScale';
import getAmountScale from '../../../../../mixins/trading/getAmountScale';
import calculateVolume from '../../../../../mixins/trading/calculateVolume';

export default {
	name: 'BidListTableBody',

	mixins: [
		formatPrice,
		formatSize,
		getPriceScale,
		getAmountScale,
		calculateVolume,
	],

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

	watch: {
		ordersData() {
			if (this.$store.state.tooltip.activeTooltipType === 'bid')
				this.updateTooltipData();
		},
	},

	computed: {
		...mapGetters({
			isAboveThanHoverElement: 'tooltip/isAboveThanHoverElement',
		}),

		sortedOrdersData() {
			if (this.$vuetify.breakpoint.smAndDown)
				return this.ordersData.slice().reverse();
			else return this.ordersData;
		},
	},

	methods: {
		...mapActions({
			selectedItemHoverHandler: 'tooltip/selectedItemHoverHandler',
			clearSelectedRowIndex: 'tooltip/clearSelectedRowIndex',
			updateData: 'tooltip/updateData',
		}),

		emitPrice(itemPrice) {
			this.$eventHub.$emit('set-sell-price', { price: itemPrice });
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
				type: 'bid',
				ordersData: this.ordersData,
				priceScale: this.getPriceScale,
				amountScale: this.getAmountScale,
			};
			this.selectedItemHoverHandler(payload);
		},

		updateTooltipData() {
			const payload = {
				ordersData: this.ordersData,
				priceScale: this.getPriceScale,
				amountScale: this.getAmountScale,
			};
			this.updateData(payload);
		},

		isActiveRow(itemIndex, type) {
			if (this.$vuetify.breakpoint.smAndDown) {
				const reversedIndex = this.ordersData.length - 1 - itemIndex;
				return this.isAboveThanHoverElement(reversedIndex, type);
			} else {
				return this.isAboveThanHoverElement(itemIndex, type);
			}
		},
	},
};
</script>

<style scoped lang="sass">
.bid-list-table-body
	&__row
		cursor: default !important

		&:hover
			background: rgba(215, 255, 216, 0.35) !important

.orders-active-row
	background: rgba(215, 255, 216, 0.35)

@media screen and (max-width: 959px)
	.bid-list-table-body td
		width: 33.3% !important
</style>
