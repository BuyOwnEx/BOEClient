<template>
	<div class="status-page__tables-wrapper">
		<v-tabs v-model="selectedTab" class="small-tabs" :key="$i18n.locale" show-arrows>
			<v-tab :key="1">{{ $t('status.crypto_tab') }}</v-tab>
			<v-tab v-if="userFiat" :key="2">{{ $t('status.fiat_tab') }}</v-tab>
			<v-tab :key="3"> {{ $t('status.pairs_tab') }} </v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab" class="profile-page__tabs-items pt-1">
			<v-tab-item :key="1">
				<div class="status-page__crypto-table">
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
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in cryptoData" :key="item.id">
									<td>{{ item.currency }}</td>
									<td>{{ item.name }}</td>
									<td class="text-capitalize">{{ item.type }}</td>
									<td>
										<CommonTooltip>
											<v-icon :color="getStateIconColor(item.state, 'replenishment')">
												{{ getStateIconName(item.state, 'replenishment') }}
											</v-icon>

											<template #text>
												{{ getStateTextStatus(item.state, 'replenishment') }}
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
								</tr>
							</tbody>
						</template>
					</v-simple-table>
				</div>
			</v-tab-item>

			<v-tab-item :key="2">
				<div class="status-page__fiat-table">
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
										{{ $t('table_header.available_payment_systems') }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in fiatData" :key="item.id">
									<td>{{ item.currency }}</td>
									<td>{{ item.name }}</td>

									<td>
										<CommonTooltip>
											<v-icon :color="getStateIconColor(item.state, 'replenishment')">
												{{ getStateIconName(item.state, 'replenishment') }}
											</v-icon>

											<template #text>
												{{ getStateTextStatus(item.state, 'replenishment') }}
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
															{{ $t('table_header.daily_withdrawal_limit_connected') }}
														</th>
													</tr>
												</thead>
												<tbody v-if="item.payment">
													<tr v-for="payment in item.payment" :key="payment.id">
														<td>{{ payment.name }}</td>
														<td>{{ payment.minDeposit }} {{ item.currency }}</td>
														<td>{{ payment.minWithdraw }} {{ item.currency }}</td>
														<td>{{ payment.depositFee }} {{ item.currency }}</td>
														<td>{{ payment.withdrawFee }} {{ item.currency }}</td>
														<td>{{ payment.noVerifyDayLimit }} {{ item.currency }}</td>
														<td>{{ payment.verifyDayLimit }} {{ item.currency }}</td>
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
			</v-tab-item>

			<v-tab-item :key="3">
				<div class="status-page__pairs-table">
					<div class="component-title py-1">
						{{ $t('status.pairs_status') }}
					</div>
					<v-simple-table dense>
						<template #default>
							<thead>
								<tr>
									<th>
										{{ $t('table_header.currency') }}
									</th>
									<th>
										{{ $t('table_header.market') }}
									</th>
									<th>
										{{ $t('table_header.trade') }}
									</th>
									<th>
										{{ $t('table_header.amount_scale') }}
									</th>
									<th>
										{{ $t('table_header.rate_scale') }}
									</th>
									<th>
										{{ $t('table_header.min_amount') }}
									</th>
									<th>
										{{ $t('table_header.min_reverse_amount') }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in pairsData" :key="item.id">
									<td>{{ item.currency }}</td>
									<td>{{ item.market }}</td>
									<td>
										<v-icon :color="getStatusIcon(item.trade).color">
											{{ getStatusIcon(item.trade).name }}
										</v-icon>
									</td>
									<td>{{ item.amountScale }}</td>
									<td>{{ item.rateScale }}</td>
									<td>{{ item.minAmount }}</td>
									<td>{{ item.minReverseAmount }}</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
				</div>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
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
		pairsData: {
			type: Array,
			required: true,
		},
		userFiat: {
			type: Boolean,
			required: true,
		},
	},

	data() {
		return {
			selectedTab: 0,
		};
	},

	computed: {
		...mapGetters('balance', ['getIcons']),
	},

	methods: {
		getStatusColor(status) {
			if (status === 'active') return 'status-page__active-back';
			else if (status === 'maintenance') return 'status-page__maintenance-back';
			else return 'status-page__offline-back';
		},
		getStatusIcon(status) {
			return status ? this.getIcons['work'] : this.getIcons['notWork'];
		},
	},
};
</script>
