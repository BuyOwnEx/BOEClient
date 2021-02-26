<template>
	<v-card class="trading-chart-wrapper">
		<TradingChartMarketInfo :currency="currency" :market="market" />
		<TradingChart
			class="trading-chart-wrapper__chart"
			:currency="currency"
			:market="market"
		/>
	</v-card>
</template>

<script>
import TradingChart from './TradingChart';
import TradingChartMarketInfo from './TradingChartMarketInfo';

export default {
	name: 'TradingChartWrapper',

	components: { TradingChart, TradingChartMarketInfo },

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

@media screen and (max-width: 1764px)
	.trading-chart-wrapper__chart
		margin-top: 20px
</style>
