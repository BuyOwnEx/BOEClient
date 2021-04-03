<template>
	<div class="fees-deposit-and-withdrawal-limits-tab">
		<v-data-table :headers="headers" :items="crypto" :search="search" dense>
			<template #top>
				<v-toolbar flat dense>
					<div class="component-title">Лимиты по вводу и выводу</div>

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
					text: 'Минимальная сумма пополнения',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'minReplenish',
				},
				{
					text: 'Минимальная сумма вывода',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'minWithdraw',
				},
				{
					text: 'Лимит вывода (в день)',
					align: 'center',
					sortable: true,
					filterable: false,
					value: 'maxWithdraw',
				},
				{
					text: 'Лимит вывода для прошедших верификацию (в день)',
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
