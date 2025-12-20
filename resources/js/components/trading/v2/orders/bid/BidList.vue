<template>
	<div class="bid-list__content pa-0">
		<v-card-text class="bid-list__content pa-0 fill-height">
			<BidListTableWrapper
				:orders-data="bidList"
				:amount-depth="bidAmountDepth"
				:volume-depth="bidVolumeDepth"
				:best="bestBid"
				:currency="currency"
				:market="market"
			/>

			<OrdersTooltip v-if="bidList && bidList.length && activeTooltipType === 'bid'" type="bid" />
		</v-card-text>
	</div>
</template>

<script>
import BidListTableWrapper from '@/components/trading/v2/orders/bid/table/BidListTableWrapper.vue';

export default {
	name: 'BidList',

	components: {
		BidListTableWrapper,
		OrdersTooltip: () => import('@/components/trading/v2/orders/common/OrdersTooltip.vue'),
	},

	props: {
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
		bidList() {
			return this.$store.state.trading.bid_list;
		},
		bidAmountDepth() {
			return this.$store.state.trading.bid_amount_depth;
		},
		bidVolumeDepth() {
			return this.$store.state.trading.bid_volume_depth;
		},
		bestBid() {
			return this.$store.state.trading.best_bid;
		},
		activeTooltipType() {
			return this.$store.state.tooltip.activeTooltipType;
		},
	},
};
</script>

<style scoped lang="sass">
.bid-list
	&__header
		margin-left: 4px
	&__content
		position: relative
</style>
