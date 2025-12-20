<template>
	<div class="ask-list__content pa-0">
		<v-card-text class="ask-list__content pa-0 fill-height">
			<AskListTableWrapper
				:orders-data="askList"
				:amount-depth="askAmountDepth"
				:volume-depth="askVolumeDepth"
				:best="bestAsk"
				:currency="currency"
				:market="market"
			/>

			<OrdersTooltip v-if="askList && askList.length && activeTooltipType === 'ask'" type="ask" />
		</v-card-text>
	</div>
</template>

<script>
import AskListTableWrapper from '@/components/trading/v2/orders/ask/table/AskListTableWrapper.vue';

export default {
	name: 'AskList',

	components: {
		AskListTableWrapper,
		OrdersTooltip: () => import('@/components/trading/v2/orders/common/OrdersTooltip.vue'),
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

	computed: {
		askList() {
			return this.$store.state.trading.ask_list;
		},
		askAmountDepth() {
			return this.$store.state.trading.ask_amount_depth;
		},
		askVolumeDepth() {
			return this.$store.state.trading.ask_volume_depth;
		},
		bestAsk() {
			return this.$store.state.trading.best_ask;
		},
		activeTooltipType() {
			return this.$store.state.tooltip.activeTooltipType;
		},
	},
};
</script>

<style scoped lang="sass">
.ask-list
	&__header
		margin-left: 4px
	&__content
		position: relative
</style>
