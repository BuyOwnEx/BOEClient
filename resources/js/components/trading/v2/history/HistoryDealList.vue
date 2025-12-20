<template>
	<v-card class="history-deal-list d-flex flex-column pa-1">
		<v-card-title class="history-deal-list__header component-title pa-0">
			{{ $t('trading.headers.history_deal_list') }}
		</v-card-title>

		<v-card-text class="d-flex fill-height history-deal-list__content pa-0">
			<HistoryDealListTableWrapper
				:currency="currency"
				:historyData="historyDealList"
				:market="market"
			/>
		</v-card-text>
	</v-card>
</template>

<script>
import HistoryDealListTableWrapper from '@/components/trading/v2/history/table/HistoryDealListTableWrapper.vue';

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
	},

	mounted() {
		this.isLoading = false;
	},
};
</script>

<style scoped lang="sass">
.history-deal-list
	&__header
		margin: 0 4px
	&__content
		position: relative
	::v-deep.v-data-table__wrapper
		overflow: hidden
</style>
