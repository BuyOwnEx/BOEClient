<template>
	<div class="status-page__tables-wrapper">
		<div v-if="userFiat" class="status-page__fiat-table">
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
							<td>{{ item.currency }}</td>
							<td>{{ item.name }}</td>
							<td
								class="text-capitalize"
								:class="getStatusColor(item.depositStatus)"
							>
								{{ item.depositStatus }}
							</td>
							<td
								class="text-capitalize"
								:class="getStatusColor(item.withdrawalStatus)"
							>
								{{ item.withdrawalStatus }}
							</td>
							<td
								class="text-capitalize"
								:class="getStatusColor(item.tradingStatus)"
							>
								{{ item.tradingStatus }}
							</td>
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
												<th colspan="2">
													Дневной лимит по выводу (Не прошедшие/Прошедшие
													верификацию)
												</th>
											</tr>
										</thead>
										<tbody v-if="item.payment">
											<tr v-for="payment in item.payment" :key="payment.name">
												<td>{{ payment.name }}</td>
												<td>{{ payment.minDeposit }} {{ item.currency }}</td>
												<td>{{ payment.minWithdraw }} {{ item.currency }}</td>
												<td>{{ payment.depositFee }} {{ item.currency }}</td>
												<td>{{ payment.withdrawFee }} {{ item.currency }}</td>
												<td>
													{{ payment.noVerifyDayLimit }} {{ item.currency }}
												</td>
												<td>
													{{ payment.verifyDayLimit }} {{ item.currency }}
												</td>
											</tr>
										</tbody>

										<tbody v-else>
											<tr>
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
							<th colspan="2">
								Дневной лимит по выводу (Не прошедшие/Прошедшие верификацию)
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in cryptoData" :key="item.currency">
							<td>{{ item.currency }}</td>
							<td>{{ item.name }}</td>
							<td class="text-capitalize">{{ item.type }}</td>
							<td
								class="text-capitalize"
								:class="getStatusColor(item.depositStatus)"
							>
								{{ item.depositStatus }}
							</td>
							<td
								class="text-capitalize"
								:class="getStatusColor(item.withdrawalStatus)"
							>
								{{ item.withdrawalStatus }}
							</td>
							<td
								class="text-capitalize"
								:class="getStatusColor(item.tradingStatus)"
							>
								{{ item.tradingStatus }}
							</td>
							<td>{{ item.minDeposit }} {{ item.currency }}</td>
							<td>{{ item.minWithdrawal }} {{ item.currency }}</td>
							<td>{{ item.depositFee }} {{ item.currency }}</td>
							<td>{{ item.withdrawalFee }} {{ item.currency }}</td>
							<td>{{ item.noVerifyDayLimit }} {{ item.currency }}</td>
							<td>{{ item.verifyDayLimit }} {{ item.currency }}</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'StatusTables',

	props: {
		fiatData: {
			type: Array,
			required: true,
		},
		cryptoData: {
			type: Array,
			required: true,
		},
		userFiat: {
			type: Boolean,
			required: true
		}
	},

	methods: {
		getStatusColor(status) {
			if (status === 'active') return 'status-page__active-back';
			else if (status === 'maintenance') return 'status-page__maintenance-back';
			else return 'status-page__offline-back';
		},
	},
};
</script>

<style scoped lang="sass">
.status-page
	&__active-back
		background: rgba(177, 255, 171, 0.45)
	&__offline-back
		background: rgba(255, 177, 171, 0.45)
	&__maintenance-back
		background: rgba(255, 235, 171, 0.45)
</style>
