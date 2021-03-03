<template>
	<v-card class="trading-forms pa-1">
		<v-row no-gutters>
			<v-col class="trading-forms__buy" cols="12" md="6">
				<v-card-title class="trading-forms__header pa-0">
					<span>
						{{ $t('trading.order.direction.buy') }}
						{{ currency }}
					</span>
					<span class="trading-forms__header-info" :key="best_ask">
						Lowest Ask: {{ best_ask }}
					</span>
				</v-card-title>

				<v-card-text class="trading-forms__content pa-0">
					<TradingFormBuyWrapper :currency="currency" :market="market" />
				</v-card-text>
			</v-col>

			<v-col class="trading-forms__sell" cols="12" md="6">
				<v-card-title class="trading-forms__header pa-0">
					<span>
						{{ $t('trading.order.direction.sell') }}
						{{ currency }}
					</span>
					<span class="trading-forms__header-info" :key="best_bid">
						Highest Bid: {{ best_bid }}
					</span>
				</v-card-title>

				<v-card-text class="trading-forms__content pa-0">
					<TradingFormSellWrapper :currency="currency" :market="market" />
				</v-card-text>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';

import TradingFormBuyWrapper from './form/TradingFormBuyWrapper';
import TradingFormSellWrapper from './form/TradingFormSellWrapper';

export default {
	name: 'TradingForms',

	components: { TradingFormBuyWrapper, TradingFormSellWrapper },

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
		...mapState('trading', ['best_ask', 'best_bid']),
		isSelectedLimitMode() {
			return this.activeTradingFormsDisplayMode === 'limit';
		},
		isSelectedMarketMode() {
			return this.activeTradingFormsDisplayMode === 'market';
		},
	},

	mounted() {},
};
</script>

<style scoped lang="sass">
.trading-forms
	display: flex
	flex-grow: 1
	flex-flow: column

	&__buy
		display: flex
		flex-flow: column
		flex-grow: 1
		padding-right: 8px
	&__sell
		display: flex
		flex-flow: column
		flex-grow: 1
		padding-left: 8px

	&__header
		display: flex
		justify-content: space-between
		word-break: normal
		font-weight: 700
		text-transform: uppercase
	&__header-info
		font-weight: normal
		font-size: 12px
		text-transform: none
		opacity: 0.6

	&__content
		display: flex
		flex-flow: column
		flex-grow: 1

@media screen and (min-width: 960px)
	.trading-forms
		min-height: 528px

@media screen and (max-width: 960px)
	.trading-forms
		&__sell
			padding-top: 2rem
</style>
