<template>
	<div class="trading-form-buy">
		<div class="trading-form-buy__actions">
			<v-radio-group v-model="type" class="d-inline-flex" hide-details mandatory dense row>
				<v-radio label="Limit" value="limit" :ripple="false" />
				<v-radio label="Market" value="market" :ripple="false" />
			</v-radio-group>

			<div v-if="isMobile" class="trading-forms__best-wrapper">
				<TradingFormsBest :best-ask="bestAsk" />
				<TradingFormsBest :best-bid="bestBid" />
			</div>
		</div>

		<div class="trading-form-buy__content">
			<keep-alive v-if="type === 'limit'">
				<BidLimitForm :currency="currency" :market="market" />
			</keep-alive>

			<keep-alive v-if="type === 'market'">
				<BidMarketForm :currency="currency" :market="market" />
			</keep-alive>
		</div>
	</div>
</template>

<script>
import BidMarketForm from '@/components/trading/v2/forms/bid/BidMarketForm.vue';
import BidLimitForm from '@/components/trading/v2/forms/bid/BidLimitForm.vue';
import TradingFormsBest from '@/components/trading/v2/forms/common/TradingFormsBest.vue';

export default {
	name: 'TradingFormBuyWrapper',

	components: { BidLimitForm, BidMarketForm, TradingFormsBest },

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
		bestBid: {
			type: Number,
			required: false,
		},
		bestAsk: {
			type: Number,
			required: false,
		},
	},

	data() {
		return {
			type: 'limit',
		};
	},

	computed: {
		isMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
	},
};
</script>

<style scoped lang="sass">
.trading-form-buy
	display: flex
	flex-flow: column
	flex-grow: 1
	&__content
		display: flex
		flex-flow: column
		flex-grow: 1

.trading-form-buy .v-input--radio-group
	margin: 0
	padding-top: 4px
	padding-bottom: 16px
</style>
