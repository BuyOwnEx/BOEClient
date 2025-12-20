<template>
	<div class="trading-forms__best">
		<span v-if="bestAsk"> {{ $t('trading.forms.best_ask') }}: {{ bestAsk }} </span>
		<span v-else-if="bestBid">{{ $t('trading.forms.best_bid') }}: {{ bestBid }}</span>
	</div>
</template>

<script>
export default {
	name: 'TradingFormsBest',

	props: {
		bestAsk: {
			type: Number,
			required: false,
			default: null,
		},
		bestBid: {
			type: Number,
			required: false,
			default: null,
		},
	},
};
</script>
