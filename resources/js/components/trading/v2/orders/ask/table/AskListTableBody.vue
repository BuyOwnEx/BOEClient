<template>
	<tbody v-if="ordersData" class="ask-list-table-body">
		<tr
			v-for="(item, itemIndex) in sortedOrdersData"
			class="ask-list-table-body__row"
			@mouseover="selectItemHover(item)"
			@mouseout="clearItemHover"
			@click="emitPrice(item.price)"
		>
			<td>
				<div class="ask-list-table-body__item--price">
					<strong class="error--text">
						{{ formatPrice(item.price, getPriceScale) }}
					</strong>
				</div>
			</td>
			<td>
				<div class="ask-list-table-body__item--size">
					{{ formatSize(item.actual_size, getAmountScale) }}
				</div>
			</td>
			<td>
				<div class="ask-list-table-body__tooltip-volume-wrapper">
					<OrdersWall
						:item-index="itemIndex"
						:volume="calculateVolume(item.price, item.actual_size)"
						type="ask"
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
import { mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import OrdersWall from '@/components/trading/v2/orders/common/OrdersWall.vue';
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
    sortedOrdersData() {
      return this.ordersData.slice().reverse();
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
    clearItemHover() {
      this.clearSelectedRowIndex();
      document.querySelectorAll('.ask-list-table-body__row').forEach(el => {
        el.classList.remove('orders-active-row');
      });
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
      const currentIndex = this.sortedOrdersData.findIndex(i => i === item);

      this.sortedOrdersData.forEach((_, index) => {
        const element = document.querySelectorAll('.ask-list-table-body__row')[index];
        if (index >= currentIndex) {
          element.classList.add('orders-active-row');
        }
      });
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

@media screen and (max-width: 1264px)
	.ask-list-table-body td
		width: 33.3% !important
</style>
