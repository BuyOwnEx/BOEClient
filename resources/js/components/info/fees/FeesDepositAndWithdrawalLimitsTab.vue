<template>
	<div class="fees-deposit-and-withdrawal-limits-tab">
		<v-simple-table dense>
			<template v-slot:default>
				<thead>
					<tr>
						<th>
							Код
						</th>
						<th>
							Наименование
						</th>
						<th>
							Минимальная сумма пополнения
						</th>
						<th>
							Минимальная сумма вывода
						</th>
						<th>
							Лимит вывода (в день)
						</th>
						<th>
							Лимит вывода для прошедших верификацию (в день)
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in crypto" :key="item.id">
						<td>{{ item.currency }}</td>
						<td>{{ item.name }}</td>
						<td>{{ item.minReplenish }} {{ item.currency }}</td>
						<td>{{ item.minWithdraw }} {{ item.currency }}</td>
						<td>{{ item.maxWithdraw }} {{ item.currency }}</td>
						<td>{{ item.maxVerifyWithdraw }} {{ item.currency }}</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
export default {
	name: 'FeesDepositAndWithdrawalLimitsTab',
	data() {
		return {
			currencies: [],
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
					maxVerifyWithdraw: value.maxVerifyWithdraw
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

<style scoped></style>
