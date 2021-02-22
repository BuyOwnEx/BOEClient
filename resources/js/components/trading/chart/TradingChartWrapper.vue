<template>
	<v-card>
		<TradingChartMarketInfo :currency='currency' :market='market' />
		<TradingChart :currency='currency' :market='market' />
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

<style scoped></style>
