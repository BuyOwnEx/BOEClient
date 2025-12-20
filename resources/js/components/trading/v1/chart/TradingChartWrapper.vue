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
import TradingChart from '@/components/trading/v1/chart/TradingChart.vue';
import TradingChartMarketInfo from '@/components/trading/v1/chart/TradingChartMarketInfo.vue';

export default {
	name: 'TradingChartWrapper',
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
	components: { TradingChart, TradingChartMarketInfo },

    computed: {
        isMobile() {
          return this.$vuetify.breakpoint.smAndDown;
        },
    }
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
