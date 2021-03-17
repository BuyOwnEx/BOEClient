<template>
	<v-card class="hdl pa-1">
		<v-card-title class="hdl__header component-title pa-0">
			{{ $t('trading.headers.history_deal_list') }}
		</v-card-title>

		<v-card-text class="hdl__content pa-0">
			<HistoryDealListTableWrapper
				:currency="currency"
				:historyData="historyDealList"
				:market="market"
				:key="firstDataElement"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import HistoryDealListTableWrapper from './table/HistoryDealListTableWrapper';

export default {
	name: 'HistoryDealList',

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

	components: { HistoryDealListTableWrapper },

	data() {
		return {
			isLoading: true,
		};
	},

	computed: {
		selectedMarket() {
			return this.$store.state.trading.selectedMarket === null
				? ''
				: this.$store.state.trading.selectedMarket.toUpperCase();
		},
		selectedCurrency() {
			return this.$store.state.trading.selectedCurrency === null
				? ''
				: this.$store.state.trading.selectedCurrency.toUpperCase();
		},
		historyDealList() {
			return this.$store.state.trading.history_deal_list;
		},
		firstDataElement() {
			if (this.historyDealList) return this.historyDealList[0].price;
		},
	},

	mounted() {
		this.isLoading = false;
	},
};
</script>

<style scoped lang="sass">
.hdl
	&__header
		margin-left: 8px
	&__content
		position: relative
</style>
