<template>
	<div class="fees-deposit-and-withdrawal-limits-tab">
		<v-data-table :headers="headers" :items="crypto" :search="search" dense>
			<template #top>
				<v-toolbar flat dense>
					<div class="component-title">{{ $t('fees.operations_limits') }}</div>

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

			<template #item.minReplenish="{item}">
				{{ item.minReplenish }} {{ item.currency }}
			</template>
			<template #item.minWithdraw="{item}">
				{{ item.minWithdraw }} {{ item.currency }}
			</template>
			<template #item.maxWithdraw="{item}">
				{{ item.maxWithdraw }} {{ item.currency }}
			</template>
			<template #item.maxVerifyWithdraw="{item}">
				{{ item.maxVerifyWithdraw }} {{ item.currency }}
			</template>
		</v-data-table>
	</div>
</template>

<script>
export default {
	name: 'FeesDepositAndWithdrawalLimitsTab',
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
					text: this.$t('table_header.min_replenish_amount'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'minReplenish',
				},
				{
					text: this.$t('table_header.min_withdrawal_amount'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'minWithdraw',
				},
				{
					text: this.$t('table_header.daily_withdrawal_limit'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'maxWithdraw',
				},
				{
					text: this.$t('table_header.daily_withdrawal_limit_verify'),
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'maxVerifyWithdraw',
				},
			],
			search: '',
		};
	},
	computed: {
		crypto() {
			let result = [];
			_.forEach(this.currencies, function(value, key) {
				result.push({
					id: value.id,
					currency: value.currency,
					name: value.name,
					minReplenish: value.minReplenish,
					minWithdraw: value.minWithdraw,
					maxWithdraw: value.maxWithdraw,
					maxVerifyWithdraw: value.maxVerifyWithdraw,
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
