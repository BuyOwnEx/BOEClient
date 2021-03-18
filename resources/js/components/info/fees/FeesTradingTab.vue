<template>
	<div class="fees-trading-tab">
		<v-data-table
			:headers="headers"
			:items="pairs"
			:search="search"
			dense
		>
			<template #top>
				<v-toolbar flat dense>
					<div class="component-title">Торговая комиссия</div>

					<v-text-field
						class="fees-page__search"
						v-model="search"
						append-icon="mdi-magnify"
						label="Поиск"
						single-line
						hide-details
					/>
				</v-toolbar>
			</template>
		</v-data-table>
	</div>
</template>

<script>
export default {
	name: 'FeesTradingTab',

	data() {
		return {
			headers: [
				{
					text: 'Пара',
					align: 'center',
					sortable: true,
					filterable: true,
					value: 'pair',
				},
				{
					text: 'Комиссия по сделке, Maker',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'makerFee',
				},
				{
					text: 'Комиссия по сделке, Taker',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'takerFee',
				},
				{
					text: 'Минимальный размер ордера',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'minAmount',
				},
				{
					text: 'Минимальный объём ордера',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'minReverseAmount',
				},
			],
			search: '',
		};
	},

	computed: {
		markets() {
			return this.$store.state.tickers.markets;
		},
		pairs() {
			let result = [];
			_.forEach(this.markets, function(value, key) {
				_.forEach(value, function(item, key2) {
					result.push({
						id: item.id,
						currency: item.currency,
						market: item.market,
						pair: item.currency + '/' + item.market,
						makerFee: '0.2',
						takerFee: '0.2',
						minAmount: item.minAmount,
						minReverseAmount: item.minReverseAmount,
					});
				});
			});
			return result;
		},
	},
	created() {
		this.$store.dispatch('tickers/getMarketDataFromServer');
	},
};
</script>

<style scoped></style>
