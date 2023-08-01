<template>
	<v-card class="trading-chart-wrapper fill-height" >
		<TradingChartMarketInfo :currency="currency" :market="market" />
		<TradingChart
			class="trading-chart-wrapper__chart fill-height"
			:currency="currency"
			:market="market"
		/>
	</v-card>
</template>

<script>
import TradingChart from './TradingChart';
import TradingChartMarketInfo from './TradingChartMarketInfo';
import { mapGetters, mapState } from 'vuex';

export default {
	name: 'TradingChartWrapper',

	components: { TradingChart, TradingChartMarketInfo },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
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
};
</script>

<style scoped lang="sass">
.trading-chart-wrapper
	overflow: hidden
	display: flex
	flex-grow: 1
	flex-flow: column
	&__chart
		direction: ltr

@media screen and (max-width: 1764px)
	.trading-chart-wrapper__chart
		margin-top: 20px
@media screen and (max-width: 959px)
	.trading-chart-wrapper__chart
		overflow: auto !important
</style>
