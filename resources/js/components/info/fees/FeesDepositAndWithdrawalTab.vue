<template>
	<div class="fees-deposit-and-withdrawal-tab">
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
							Комиссия при пополнении
						</th>
						<th>
							Комиссия при выводе
						</th>
						<th>
							Мин. кол-во подтверждений сети
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in crypto" :key="item.id">
						<td>{{ item.currency }}</td>
						<td>{{ item.name }}</td>
						<td>{{ item.feeReplenish }}</td>
						<td>{{ item.feeWithdraw }} {{ item.currency }}</td>
						<td>{{ item.confirmations }}</td>
					</tr>
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
export default {
	name: 'FeesDepositAndWithdrawalTab',
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
					feeReplenish: '-',
					feeWithdraw: value.feeWithdraw,
					confirmations: value.approve
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
