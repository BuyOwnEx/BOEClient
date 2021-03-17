<template>
	<div class="status-page__tables-wrapper">
		<div class="status-page__fiat-table">
			<div class="component-title py-1">
				Состояние системы по фиатным валютам
			</div>
			<v-simple-table dense>
				<template #default>
					<thead>
						<tr>
							<th>
								Валюта
							</th>
							<th>
								Наименование
							</th>
							<th>
								Ввод средств
							</th>
							<th>
								Вывод средств
							</th>
							<th>
								Торги
							</th>
							<th>
								Доступные платежные системы
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in fiatData" :key="item.currency">
							<td :class="getDepositStatusColor(true)"></td>
							<td :class="getWithdrawalStatusColor(true)"></td>
							<td :class="getTradingStatusColor(true)"></td>
							<td>
								<v-simple-table dense>
									<template #default>
										<thead>
											<tr>
												<th>
													Наименование
												</th>
												<th>
													Мин. сумма пополнения
												</th>
												<th>
													Мин. сумма вывода
												</th>
												<th>
													Комиссия по пополнению
												</th>
												<th>
													Комиссия по выводу
												</th>
												<th
													class="status-page__table-in-table-header"
													colspan="2"
												>
													Макс. дневной лимит по выводу (Не прошедшие/Прошедшие
													KYC процедуру)
												</th>
											</tr>
										</thead>
										<tbody>
											<tr v-if="true"></tr>
											<tr v-else>
												<td class="text-center" colspan="6">No Data</td>
											</tr>
										</tbody>
									</template>
								</v-simple-table>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</div>

		<div class="status-page__crypto-table pt-2">
			<div class="component-title py-1">
				Состояние системы по криптовалютам
			</div>
			<v-simple-table dense>
				<template #default>
					<thead>
						<tr>
							<th>
								Валюта
							</th>
							<th>
								Наименование
							</th>
							<th>
								Тип
							</th>
							<th>
								Ввод средств
							</th>
							<th>
								Вывод средств
							</th>
							<th>
								Торги
							</th>
							<th>
								Мин. сумма пополнения
							</th>
							<th>
								Мин. сумма вывода
							</th>
							<th>
								Комиссия по пополнению
							</th>
							<th>
								Комиссия по выводу
							</th>
							<th>
								Макс. дневной лимит по выводу (Не прошедшие/Прошедшие KYC
								процедуру)
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in cryptoData" :key="item.currency"></tr>
					</tbody>
				</template>
			</v-simple-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'StatusTables',

	data() {
		return {};
	},

	methods: {
		getDepositStatusColor(status) {
			return 'status-page__online-back';
		},
		getWithdrawalStatusColor(status) {
			return 'status-page__offline-back';
		},
		getTradingStatusColor(status) {
			return 'status-page__maintenance-back';
		},
	},

	props: {
		fiatData: {
			type: Array,
			required: true,
		},
		cryptoData: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style scoped lang="sass">
.status-page
	&__online-back
		background: rgba(177, 255, 171, 0.45)
	&__offline-back
		background: rgba(255, 177, 171, 0.45)
	&__maintenance-back
		background: rgba(255, 235, 171, 0.45)
</style>
