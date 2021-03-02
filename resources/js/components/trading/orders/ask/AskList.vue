<template>
	<v-card class="ask-list pa-1">
		<v-card-title class="ask-list__title pa-0">
			SELL ORDERS
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

			<OrdersTooltip
				v-if="askList && askList.length"
				type="ask"
				:key="askList[0].price"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import AskListTableWrapper from './table/AskListTableWrapper';
import OrdersTooltip from '../OrdersTooltip';

export default {
	name: 'AskList',

	components: {
		AskListTableWrapper,
		OrdersTooltip,
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

	data() {
		return {
			isLoading: true,
		};
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
	},

	mounted() {
		this.isLoading = false;
	},
};
</script>

<style scoped lang="sass">
.ask-list
	&__content
		position: relative

@media screen and (min-width: 1382px) and (max-width: 1768px)
	.ask-list
		height: 378px

@media screen and (min-width: 1264px) and (max-width: 1382px)
	.ask-list
		height: 378px

@media screen and (min-width: 960px) and (max-width: 1264px)
	.ask-list
		height: 378px

@media screen and (max-width: 960px)
	.ask-list
		height: 282px
</style>
