<template>
	<div class="status-page__tables-wrapper">
		<div v-if="userFiat" class="status-page__fiat-table">
			<div class="component-title py-1">
				{{ $t('status.fiat_status') }}
			</div>
			<v-simple-table dense>
				<template #default>
					<thead>
						<tr>
							<th>
								{{ $t('table_header.currency') }}
							</th>
							<th>
								{{ $t('table_header.name') }}
							</th>
							<th>
								{{ $t('common.replenishment_funds') }}
							</th>
							<th>
								{{ $t('common.withdrawal_funds') }}
							</th>
							<th>
								{{ $t('menu.trading') }}
							</th>
							<th>
								{{ $t('status.available_payment_systems') }}
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
													{{ $t('table_header.name') }}
												</th>
												<th>
													{{ $t('table_header.min_replenish_amount') }}
												</th>
												<th>
													{{ $t('table_header.min_withdrawal_amount') }}
												</th>
												<th>
													{{ $t('table_header.replenishment_fee') }}
												</th>
												<th>
													{{ $t('table_header.withdrawal_fee') }}
												</th>
												<th colspan="2">
													{{
														$t('table_header.daily_withdrawal_limit_connected')
													}}
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
												<td class="text-center" colspan="6">
													{{ $t('common.no_data') }}
												</td>
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
				{{ $t('status.crypto_status') }}
			</div>
			<v-simple-table dense>
				<template #default>
					<thead>
						<tr>
							<th>
								{{ $t('table_header.currency') }}
							</th>
							<th>
								{{ $t('table_header.name') }}
							</th>
							<th>
								{{ $t('table_header.type') }}
							</th>
							<th>
								{{ $t('common.replenishment_funds') }}
							</th>
							<th>
								{{ $t('common.withdrawal_funds') }}
							</th>
							<th>
								{{ $t('menu.trading') }}
							</th>
							<th>
								{{ $t('table_header.min_replenish_amount') }}
							</th>
							<th>
								{{ $t('table_header.min_withdrawal_amount') }}
							</th>
							<th>
								{{ $t('table_header.replenishment_fee') }}
							</th>
							<th>
								{{ $t('table_header.withdrawal_fee') }}
							</th>
							<th colspan="2">
								{{ $t('table_header.daily_withdrawal_limit_connected') }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in cryptoData" :key="item.currency">
							<td>{{ item.currency }}</td>
							<td>{{ item.name }}</td>
							<td class="text-capitalize">{{ item.type }}</td>
							<td>
								<CommonTooltip>
									<v-icon :color="getStateIconColor(item.state, 'withdrawal')">
										{{ getStateIconName(item.state, 'withdrawal') }}
									</v-icon>

									<template #text>
										{{ getStateTextStatus(item.state, 'withdrawal') }}
									</template>
								</CommonTooltip>
							</td>
							<td>
								<CommonTooltip>
									<v-icon :color="getStateIconColor(item.state, 'withdrawal')">
										{{ getStateIconName(item.state, 'withdrawal') }}
									</v-icon>

									<template #text>
										{{ getStateTextStatus(item.state, 'withdrawal') }}
									</template>
								</CommonTooltip>
							</td>
							<td
								class="text-capitalize"
								:class="getStatusColor(item.tradingStatus)"
							>
								{{ item.tradingStatus }}
							</td>
							<td>{{ item.minReplenish }} {{ item.currency }}</td>
							<td>{{ item.minWithdraw }} {{ item.currency }}</td>
							<td>{{ item.feeReplenish || 0 }} {{ item.currency }}</td>
							<td>{{ item.feeWithdraw }} {{ item.currency }}</td>
							<td>{{ item.maxWithdraw }} {{ item.currency }}</td>
							<td>{{ item.maxVerifyWithdraw }} {{ item.currency }}</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
		</div>
	</div>
</template>

<script>
import CommonTooltip from '../../common/CommonTooltip';
import balanceStateMethodsMixin from '../../../mixins/balance/balanceStateMethodsMixin';

export default {
	name: 'StatusTables',

	components: { CommonTooltip },

	mixins: [balanceStateMethodsMixin],

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
			required: true,
		},
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
