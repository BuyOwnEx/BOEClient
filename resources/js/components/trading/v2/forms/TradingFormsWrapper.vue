<template>
	<v-card class="trading-forms">
    <v-tabs v-model="selectedTab" class="small-tabs flex-grow-0" :key="$i18n.locale" grow>
      <v-tab :key="1">
        {{ $t('trading.order.direction.buy') }}
      </v-tab>
      <v-tab :key="2">
        {{ $t('trading.order.direction.sell') }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedTab" class="flex-grow-1 fill-height py-1 px-1" touchless>
      <v-tab-item :key="1" class="fill-height">
        <TradingFormBuyWrapper class="fill-height" :currency="currency" :market="market" :best-ask="best_ask" :best-bid="best_bid" />
      </v-tab-item>
      <v-tab-item :key="2" class="fill-height">
        <TradingFormSellWrapper class="fill-height" :currency="currency" :market="market" :best-ask="best_ask" :best-bid="best_bid" />
      </v-tab-item>
    </v-tabs-items>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';

import TradingFormBuyWrapper from '@/components/trading/v2/forms/form/TradingFormBuyWrapper.vue';
import TradingFormSellWrapper from '@/components/trading/v2/forms/form/TradingFormSellWrapper.vue';
import TradingFormsBest from '@/components/trading/v2/forms/common/TradingFormsBest.vue';
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

@media screen and (max-width: 959px)
	.trading-forms
		&__sell
			padding-top: 2rem
</style>
