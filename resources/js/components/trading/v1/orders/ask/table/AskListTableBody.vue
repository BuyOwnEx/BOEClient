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
			<td v-if="isDesktop">
				<div class="ask-list-table-body__tooltip-volume-wrapper">
					<OrdersWall :item-index="itemIndex" :volume="calculateVolume(item.price, item.actual_size)" type="ask" />
					<div class="ask-list-table-body__item--volume text-start">
						<span>{{ calculateVolume(item.price, item.actual_size) }}</span>
					</div>
				</div>
			</td>
			<td v-if="isDesktop">
				<div class="ask-list-table-body__item--size">
					{{ formatSize(item.actual_size, getAmountScale) }}
				</div>
			</td>
			<td v-if="isDesktop">
				<div class="ask-list-table-body__item--price text-end">
					<strong class="error--text">
						{{ formatPrice(item.price, getPriceScale) }}
					</strong>
				</div>
			</td>

			<td v-if="isMobile">
				<div class="ask-list-table-body__item--price">
					<strong class="error--text">
						{{ formatPrice(item.price, getPriceScale) }}
					</strong>
				</div>
			</td>
			<td v-if="isMobile">
				<div class="ask-list-table-body__item--size">
					{{ formatSize(item.actual_size, getAmountScale) }}
				</div>
			</td>
			<td v-if="isMobile">
				<div class="ask-list-table-body__tooltip-volume-wrapper text-right">
					<OrdersWall
						:item-index="itemIndex"
						:volume="calculateVolume(item.price, item.actual_size)"
						type="ask"
						mobile
					/>
					<div class="ask-list-table-body__item--volume text-end">
						<span>{{ calculateVolume(item.price, item.actual_size) }}</span>
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

import OrdersWall from '@/components/trading/v1/orders/common/OrdersWall.vue';

import formatPrice from '@/mixins/trading/formatPrice';
import formatSize from '@/mixins/trading/formatSize';
import getPriceScale from '@/mixins/trading/getPriceScale';
import getAmountScale from '@/mixins/trading/getAmountScale';
import calculateVolume from '@/mixins/trading/calculateVolume';

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

	watch: {
		ordersData() {
			if (this.$store.state.tooltip.activeTooltipType === 'ask') this.updateTooltipData();
		},
	},

	computed: {
		...mapGetters({
			isAboveThanHoverElement: 'tooltip/isAboveThanHoverElement',
		}),
		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
		isDesktop() {
			return !this.isMobile;
		},
	},

	methods: {
		...mapActions({
			selectedItemHoverHandler: 'tooltip/selectedItemHoverHandler',
			clearSelectedRowIndex: 'tooltip/clearSelectedRowIndex',
			updateData: 'tooltip/updateData',
		}),

		emitPrice(itemPrice) {
			this.$eventHub.$emit('set-buy-price', { price: itemPrice });
		},

		calculatePercent(actual_size) {
			return BigNumber(actual_size)
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

		updateTooltipData() {
			const payload = {
				ordersData: this.ordersData,
				priceScale: this.getPriceScale,
				amountScale: this.getAmountScale,
			};
			this.updateData(payload);
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

@media screen and (max-width: 959px)
	.ask-list-table-body td
		width: 33.3% !important
</style>
