<template>
	<div class="trading-form-sell">
		<div class="trading-form-sell__actions">
			<v-radio-group v-model="type" class="d-inline-flex" hide-details mandatory dense row>
				<v-radio label="Limit" value="limit" :ripple="false" />
				<v-radio label="Market" value="market" :ripple="false" />
			</v-radio-group>

			<div v-if="isMobile" class="trading-forms__best-wrapper">
				<TradingFormsBest :best-ask="bestAsk" />
				<TradingFormsBest :best-bid="bestBid" />
			</div>
		</div>

		<div class="trading-form-sell__content">
			<keep-alive v-if="type === 'limit'">
				<AskLimitForm :currency="currency" :market="market" />
			</keep-alive>

			<keep-alive v-if="type === 'market'">
				<AskMarketForm :currency="currency" :market="market" />
			</keep-alive>
		</div>
	</div>
</template>

<script>
import AskMarketForm from '@/components/trading/v2/forms/ask/AskMarketForm.vue';
import AskLimitForm from '@/components/trading/v2/forms/ask/AskLimitForm.vue';
import TradingFormsBest from '@/components/trading/v2/forms/common/TradingFormsBest.vue';

export default {
	name: 'TradingFormSellWrapper',
	components: { AskLimitForm, AskMarketForm, TradingFormsBest },
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
.trading-form-sell
	display: flex
	flex-flow: column
	flex-grow: 1
	&__content
		display: flex
		flex-flow: column
		flex-grow: 1

.trading-form-sell .v-input--radio-group
	margin: 0
	padding-top: 4px
	padding-bottom: 16px
</style>
