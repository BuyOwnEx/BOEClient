<template>
	<div class="last_price_line text-center">
		<div
			class="last_price"
			:class="{
				'text-success': lastChangeIsPositive,
				'text-danger': lastChangeIsNegative,
			}"
		>
			<span
				class="mdi"
				:class="{
					'mdi-arrow-down': lastChangeIsNegative,
					'mdi-arrow-up': lastChangeIsPositive,
				}"
			/>
			{{ lastPrice }} {{ market.toUpperCase() }}
		</div>
	</div>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	name: 'AskBidLastPrice',

	props: {
		market: {
			type: String,
			required: true,
		},
	},

	computed: {
		ticker() {
			return this.$store.getters['trading/activeTicker'];
		},
		lastPrice() {
			return this.ticker ? BigNumber(this.ticker.latest).toString() : 0;
		},
		$_lastChange() {
			return this.ticker
				? BigNumber(this.ticker.latest).minus(BigNumber(this.ticker.previous))
				: null;
		},
		lastChangeIsPositive() {
			return this.ticker ? this.$_lastChange.isPositive() : false;
		},
		lastChangeIsNegative() {
			return this.ticker ? this.$_lastChange.isNegative() : false;
		},
	},

	mounted() {
		this.$nextTick(() => {
			this.$emit('mounted');
		});
	},
};
</script>
