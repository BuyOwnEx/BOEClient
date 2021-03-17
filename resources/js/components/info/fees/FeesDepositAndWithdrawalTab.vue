<template>
	<div class="fees-deposit-and-withdrawal-tab">
		<v-simple-table dense>
			<template v-slot:default>
				<thead>
					<tr>
						<th>
							Валюта
						</th>
						<th>
							Комиссия на ввод средств
						</th>
						<th>
							Комиссия на вывод средств
						</th>
						<th>
							Минимальное кол-во подтверждений при вводе
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
	name: 'FeesDepositAndWithdrawalTab',
};
</script>

<style scoped></style>
