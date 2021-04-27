<template>
	<v-card class="bid-list pa-1" :class="{ 'bid-list--rotated': $vuetify.breakpoint.smAndDown }">
		<v-card-title class="bid-list__header component-title pa-0">
			{{ $t('trading.headers.bid_orders') }}
		</v-card-title>

		<v-card-text class="bid-list__content pa-0">
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
	</v-card>
</template>

<script>
import BidListTableWrapper from './table/BidListTableWrapper';

export default {
	name: 'BidList',

	components: {
		BidListTableWrapper,
		OrdersTooltip: () => import(/* webpackPrefetch: true */ '../common/OrdersTooltip'),
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

	data() {
		return {
			isLoading: true,
		};
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

	mounted() {
		this.isLoading = false;
	},
};
</script>

<style scoped lang="sass">
.bid-list
	&--rotated
		transform: rotate(180deg)
		.bid-list__header
			transform: rotate(180deg)
		::v-deep.bid-list-table-header
			transform: rotate(180deg)
			th
				box-shadow: none !important
		::v-deep.bid-list-table-body
			transform: rotate(180deg)
		::v-deep.orders-tooltip--bid
			transform: rotate(180deg)
		::v-deep.orders-wall--bid
			top: 0

	&__header
		margin-left: 4px
	&__content
		position: relative

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.bid-list
		height: 378px
@media screen and (min-width: 960px) and (max-width: 1382px)
	.bid-list
		height: 378px
@media screen and (max-width: 959px)
	.bid-list
		min-height: 392px
</style>
