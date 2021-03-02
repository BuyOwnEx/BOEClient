<template>
	<v-card class="bid-list pa-1">
		<v-card-title class="bid-list__title pa-0">
			BUY ORDERS
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

			<OrdersTooltip
				v-if="bidList && bidList.length"
				type="bid"
				:key="bidList[0].price"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import BidListTableWrapper from './table/BidListTableWrapper';
import OrdersTooltip from '../OrdersTooltip';

export default {
	name: 'BidList',

	components: {
		BidListTableWrapper,
		OrdersTooltip,
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
	},

	mounted() {
		this.isLoading = false;
	},
};
</script>

<style scoped lang="sass">
.bid-list
	&__content
		position: relative

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.bid-list
		height: 378px

@media screen and (min-width: 1264px) and (max-width: 1382px)
	.bid-list
		height: 378px

@media screen and (min-width: 960px) and (max-width: 1264px)
	.bid-list
		height: 378px

@media screen and (max-width: 960px)
	.bid-list
		height: 282px
</style>
