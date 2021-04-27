<template>
	<v-card class="ask-list pa-1">
		<v-card-title class="ask-list__header component-title pa-0">
			{{ $t('trading.headers.ask_orders') }}
		</v-card-title>

		<v-card-text class="ask-list__content pa-0">
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
	</v-card>
</template>

<script>
import AskListTableWrapper from './table/AskListTableWrapper';

export default {
	name: 'AskList',

	components: {
		AskListTableWrapper,
		OrdersTooltip: () => import(/* webpackPrefetch: true */ '../common/OrdersTooltip'),
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

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.ask-list
		height: 378px
@media screen and (min-width: 960px) and (max-width: 1382px)
	.ask-list
		height: 378px
@media screen and (max-width: 959px)
	.ask-list
		min-height: 392px
</style>
