<template>
	<div class="fees-deposit-and-withdrawal-limits-tab">
		<v-simple-table dense>
			<template v-slot:default>
				<thead>
					<tr>
						<th>
							Валюта
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
							Лимит вывода для верифицированных пользователей (в день)
						</th>
					</tr>
				</thead>
				<tbody>
					<!--					<tr v-for="item in desserts" :key="item.name">-->
					<!--						<td>{{ item.name }}</td>-->
					<!--						<td>{{ item.calories }}</td>-->
					<!--					</tr>-->
				</tbody>
			</template>
		</v-simple-table>
	</div>
</template>

<script>
export default {
	name: 'FeesDepositAndWithdrawalLimitsTab',
};
</script>

<style scoped></style>
