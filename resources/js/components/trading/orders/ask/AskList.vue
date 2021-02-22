<template>
	<v-card class='ask-list pa-1'>
		<v-card-title class='ask-list__title pa-0'>
			SELL ORDERS
		</v-card-title>

		<v-card-text v-if='askList !== null' class='ask-list__content pa-1 pt-0'>
			<AskListTableWrapper
				:askData='askList'
				:currency='currency'
				:market='market'
			/>
		</v-card-text>
		<!--<ask-depth
														:amount="ask_amount_depth"
														:volume="ask_volume_depth"></ask-depth>-->
	</v-card>
</template>

<script>
import AskListTableWrapper from './table/AskListTableWrapper';

export default {
	name: 'AskList',

	components: {
		AskListTableWrapper,
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
	},
};
</script>

<style scoped lang='sass'></style>