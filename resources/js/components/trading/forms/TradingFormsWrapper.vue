<template>
	<v-card class="trading-forms">
		<v-row v-if="isDesktop" class="pa-1" no-gutters>
			<v-col class="trading-forms__form trading-forms__form--buy" cols="12" md="6">
				<v-card-title class="trading-forms__header component-title pa-0">
					<span>
						{{ $t('trading.order.direction.buy') }}
						{{ currency }}
					</span>
					<TradingFormsBest :best-ask="best_ask" />
				</v-card-title>

				<v-card-text class="trading-forms__content pa-0">
					<TradingFormBuyWrapper :currency="currency" :market="market" />
				</v-card-text>
			</v-col>

			<v-col class="trading-forms__form trading-forms__form--sell" cols="12" md="6">
				<v-card-title class="trading-forms__header component-title pa-0">
					<span>
						{{ $t('trading.order.direction.sell') }}
						{{ currency }}
					</span>
					<TradingFormsBest :best-bid="best_bid" />
				</v-card-title>

				<v-card-text class="trading-forms__content pa-0">
					<TradingFormSellWrapper :currency="currency" :market="market" />
				</v-card-text>
			</v-col>
		</v-row>

		<!--	mobile version	-->
		<div v-else>
			<v-tabs v-model="selectedTab" class="small-tabs" :key="$i18n.locale" grow>
				<v-tab :key="1">
					{{ $t('trading.order.direction.buy') }}
				</v-tab>
				<v-tab :key="2">
					{{ $t('trading.order.direction.sell') }}
				</v-tab>
			</v-tabs>

			<v-tabs-items v-model="selectedTab" class="py-1 px-1" touchless>
				<v-tab-item :key="1">
					<TradingFormBuyWrapper :currency="currency" :market="market" :best-ask="best_ask" :best-bid="best_bid" />
				</v-tab-item>
				<v-tab-item :key="2">
					<TradingFormSellWrapper :currency="currency" :market="market" :best-ask="best_ask" :best-bid="best_bid" />
				</v-tab-item>
			</v-tabs-items>
		</div>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';

import TradingFormBuyWrapper from './form/TradingFormBuyWrapper';
import TradingFormSellWrapper from './form/TradingFormSellWrapper';
import TradingFormsBest from './common/TradingFormsBest';
export default {
	name: 'TradingForms',

	components: { TradingFormBuyWrapper, TradingFormSellWrapper, TradingFormsBest },

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
			selectedTab: 0,
		};
	},

	computed: {
		...mapState('trading', ['best_ask', 'best_bid']),
		isDesktop() {
			return this.$vuetify.breakpoint.mdAndUp;
		},
	},
};
</script>

<style scoped lang="sass">
.trading-forms
	display: flex
	flex-grow: 1
	flex-flow: column

	&__form
		display: flex
		flex-flow: column
		flex-grow: 1
		&--buy
			padding-right: 8px !important
		&--sell
			padding-left: 8px !important


	&__header
		display: flex
		justify-content: space-between
		margin-left: 4px

	::v-deep &__best
		font-weight: normal
		font-size: 12px
		text-transform: none
		opacity: 0.6
	::v-deep &__best-wrapper
		display: inline-flex
		gap: 12px
		float: right
		padding-top: 8px
		@media screen and (max-width: 599px)
			display: inline-block
			flex-flow: column
			padding-top: 0
	&__content
		display: flex
		flex-flow: column
		flex-grow: 1

.v-application--is-rtl
	.trading-forms
		&__form
			&--buy
				padding-right: 0
				padding-left: 8px !important
			&--sell
				padding-left: 0
				padding-right: 8px !important
		::v-deep &__best-wrapper
			float: left

@media screen and (min-width: 960px)
	.trading-forms
		min-height: 528px

@media screen and (max-width: 959px)
	.trading-forms
		&__sell
			padding-top: 2rem
</style>
