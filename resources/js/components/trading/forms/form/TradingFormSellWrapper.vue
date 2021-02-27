<template>
	<div class="trading-form-sell">
		<div class="trading-form-sell__actions">
			<v-radio-group v-model="type" hide-details mandatory row>
				<v-radio label="Limit" value="limit"></v-radio>
				<v-radio label="Market" value="market"></v-radio>
			</v-radio-group>
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
import AskMarketForm from '../ask/AskMarketForm';
import AskLimitForm from '../ask/AskLimitForm';

export default {
	name: 'TradingFormSellWrapper',
	components: { AskLimitForm, AskMarketForm },
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
