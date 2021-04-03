<template>
	<div class="fees-deposit-and-withdrawal-tab">
		<v-data-table
			:headers="headers"
			:items="crypto"
			:search="search"
			dense
		>
			<template #top>
				<v-toolbar flat dense>
					<div class="component-title">Комиссия на ввод и вывод</div>

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
	name: 'FeesDepositAndWithdrawalTab',

	data() {
		return {
			currencies: [],
			headers: [
				{
					text: 'Код',
					align: 'center',
					sortable: true,
					filterable: true,
					value: 'currency',
				},
				{
					text: 'Наименование',
					align: 'center',
					sortable: true,
					filterable: true,
					value: 'name',
				},
				{
					text: 'Комиссия при пополнении',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'feeReplenish',
				},
				{
					text: 'Комиссия при выводе',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'feeWithdraw',
				},
				{
					text: 'Мин. кол-во подтверждений сети',
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
			_.forEach(this.currencies, function(value, key) {
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
