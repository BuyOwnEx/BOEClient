<template>
	<div class="trading-form-buy">
		<div class="trading-form-buy__actions">
			<v-radio-group v-model="type" hide-details mandatory row>
				<v-radio label="Limit" value="limit"></v-radio>
				<v-radio label="Market" value="market"></v-radio>
			</v-radio-group>
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
import BidMarketForm from '../bid/BidMarketForm';
import BidLimitForm from '../bid/BidLimitForm';

export default {
	name: 'TradingFormBuyWrapper',
	components: { BidLimitForm, BidMarketForm },
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
			type: 'limit',
		};
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
