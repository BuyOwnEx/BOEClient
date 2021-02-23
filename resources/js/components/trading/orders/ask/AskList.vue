<template>
	<v-card class='ask-list pa-1'>
		<v-card-title class='ask-list__title pa-0 px-1'>
			SELL ORDERS
		</v-card-title>

		<CommonProgressCircular v-if='!askList || isLoading' />
		<v-card-text v-else class='ask-list__content pa-0'>
			<AskListTableWrapper
				:askData='askList'
				:amount-depth='askAmountDepth'
				:volume-depth='askVolumeDepth'
				:best='bestAsk'
				:currency='currency'
				:market='market'
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import AskListTableWrapper from './table/AskListTableWrapper';
import CommonProgressCircular from '../../../common/CommonProgressCircular';

export default {
	name: 'AskList',

	components: {
		AskListTableWrapper,
		CommonProgressCircular,
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
