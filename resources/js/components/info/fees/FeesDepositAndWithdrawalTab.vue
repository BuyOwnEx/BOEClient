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

			<template #header.platforms="{ header }">
				<div class="text-center">
					{{ header.text }}
				</div>
			</template>

			<template #item.platforms="{ item }">
				<v-simple-table v-if="item.platforms && item.platforms.length" dense>
					<thead>
						<tr>
							<th>
								{{ $t('table_header.replenishment_fee') }}
							</th>
							<th>
								{{ $t('table_header.withdrawal_fee') }}
							</th>
							<th>
								{{ $t('table_header.min_number_of_network_confirmation') }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="platform in item.platforms" :key="platform.id">
							<td>
								{{ platform.feeReplenish || '–' }}
							</td>
							<td>
								{{ platform.feeWithdraw || '–' }}
							</td>
							<td>
								{{ platform.approve || '–' }}
							</td>
						</tr>
					</tbody>
				</v-simple-table>
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
			search: '',
		};
	},

	computed: {
		headers() {
			return [
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
					text: this.$t('table_header.platform'),
					sortable: false,
					filterable: false,
					value: 'platforms',
				},
			];
		},

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
					platforms: value.platforms,
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
