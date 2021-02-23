<template>
	<v-card class='bid-list pa-1'>
		<v-card-title class='bid-list__title pa-0'>
			BUY ORDERS
		</v-card-title>

		<CommonProgressCircular v-if='!bidList || isLoading' />
		<v-card-text v-else class='bid-list__content pa-0'>
			<BidListTableWrapper
				:bidData='bidList'
				:amount-depth='bidAmountDepth'
				:volume-depth='bidVolumeDepth'
				:best='bestBid'
				:currency='currency'
				:market='market'
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import BidListTableWrapper from './table/BidListTableWrapper';
import CommonProgressCircular from '../../../common/CommonProgressCircular';

export default {
	name: 'BidList',

	components: {
		BidListTableWrapper,
		CommonProgressCircular,
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