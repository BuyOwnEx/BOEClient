<template>
	<v-card class="trading-forms pa-1">
		<v-row no-gutters>
			<v-col class="trading-forms__buy" cols="12" md="6">
				<v-card-title class="trading-forms__header component-title pa-0">
					<span>
						{{ $t('trading.order.direction.buy') }}
						{{ currency }}
					</span>
					<span class="trading-forms__header-info" :key="best_ask">
						{{ $t('trading.forms.best_ask') }}: {{ best_ask }}
					</span>
				</v-card-title>

				<v-card-text class="trading-forms__content pa-0">
					<TradingFormBuyWrapper :currency="currency" :market="market" />
				</v-card-text>
			</v-col>

			<v-col class="trading-forms__sell" cols="12" md="6">
				<v-card-title class="trading-forms__header component-title pa-0">
					<span>
						{{ $t('trading.order.direction.sell') }}
						{{ currency }}
					</span>
					<span class="trading-forms__header-info" :key="best_bid">
						{{ $t('trading.forms.best_bid') }}: {{ best_bid }}
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
		margin-left: 4px
	&__header-info
		font-weight: normal
		font-size: 12px
		text-transform: none
		opacity: 0.6

	&__content
		display: flex
		flex-flow: column
		flex-grow: 1

.v-application--is-rtl
	.trading-forms
		&__buy
			padding-right: 0
			padding-left: 8px
		&__sell
			padding-left: 0
			padding-right: 8px

@media screen and (min-width: 960px)
	.trading-forms
		min-height: 528px

@media screen and (max-width: 959px)
	.trading-forms
		&__sell
			padding-top: 2rem
</style>
