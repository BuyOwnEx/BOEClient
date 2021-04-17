<template>
	<div class="fees-deposit-and-withdrawal-tab">
		<v-data-table :headers="headers" :items="crypto" :search="search" dense>
			<template #top>
				<v-toolbar flat dense>
					<div class="component-title">{{ $t('fees.operations_fee') }}</div>

					<v-text-field
						v-model="search"
						class="fees-page__search"
						:label="$t('trading.search')"
						append-icon="mdi-magnify"
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
	name: 'FeesDepositAndWithdrawalTab',

	data() {
		return {
			currencies: [],
			headers: [
				{
					text: this.$t('table_header.code'),
					align: 'center',
					sortable: true,
					filterable: true,
					value: 'currency',
				},
				{
					text: this.$t('table_header.name'),
					align: 'center',
					sortable: true,
					filterable: true,
					value: 'name',
				},
				{
					text: this.$t('table_header.replenishment_fee'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'feeReplenish',
				},
				{
					text: this.$t('table_header.withdrawal_fee'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'feeWithdraw',
				},
				{
					text: this.$t('table_header.min_number_of_network_confirmation'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'confirmations',
				},
			],
			search: '',
		};
	},

	computed: {
		crypto() {
			let result = [];
			_.forEach(this.currencies, value => {
				result.push({
					id: value.id,
					currency: value.currency,
					name: value.name,
					feeReplenish: '-',
					feeWithdraw: value.feeWithdraw,
					confirmations: value.approve,
				});
			});
			return result;
		},
	},
	mounted() {
		axios.get('/trader/ext/crypto_currencies').then(response => {
			this.currencies = response.data.data;
		});
	},
};
</script>
