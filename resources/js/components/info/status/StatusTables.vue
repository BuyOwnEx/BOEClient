<template>
	<div class="status-page__tables-wrapper">
		<v-tabs v-model="selectedTab" class="small-tabs" :key="$i18n.locale" show-arrows>
			<v-tab :key="1">{{ $t('status.currencies_tab') }}</v-tab>
			<v-tab :key="2" v-if="!isHideTrading"> {{ $t('status.pairs_tab') }} </v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab" class="profile-page__tabs-items pt-1">
			<v-tab-item :key="1">
				<div class="status-page__crypto-table">
					<div class="component-title py-1">
						{{ $t('status.currency_status') }}
					</div>
					<v-simple-table dense>
						<thead class="primary">
							<tr>
								<th rowspan="2" nowrap="">
									{{ $t('table_header.currency') }}
								</th>
								<th rowspan="2" nowrap="">
									{{ $t('table_header.name') }}
								</th>
								<th rowspan="2" nowrap="">
									{{ $t('table_header.type') }}
								</th>
								<th colspan="4">
									{{ $t('table_header.platform') }}
								</th>
							</tr>
							<tr>
								<th>
									{{ $t('table_header.network') }}
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
							<template v-for="curr in available_currencies">
								<template v-for="platform in curr.platforms">
									<tr>
										<td nowrap="">
											<CommonCurrency :code="curr.currency" :color="curr.color" :src="curr.logo" />
										</td>
										<td nowrap="">{{ curr.name }}</td>
										<td class="overline" nowrap="">{{ curr.type }}</td>
										<td nowrap="">{{ platform.platform || platform.base_currency || $t('fiat.gateways.'+platform.gateway_code.toLowerCase()) || '-' }}</td>
										<td class="overline" nowrap="">{{ platform.type || 'Fiat' }}</td>
										<td>
											<CommonTooltip>
												<v-icon :color="getStateIconColor(platform.state, 'replenishment')">
													{{ getStateIconName(platform.state, 'replenishment') }}
												</v-icon>

												<template #text>
													{{ getStateTextStatus(platform.state, 'replenishment') }}
												</template>
											</CommonTooltip>
										</td>
										<td>
											<CommonTooltip>
												<v-icon :color="getStateIconColor(platform.state, 'withdrawal')">
													{{ getStateIconName(platform.state, 'withdrawal') }}
												</v-icon>

												<template #text>
													{{ getStateTextStatus(platform.state, 'withdrawal') }}
												</template>
											</CommonTooltip>
										</td>
									</tr>
								</template>
							</template>
						</tbody>
					</v-simple-table>
				</div>
			</v-tab-item>

			<v-tab-item :key="2" v-if="!isHideTrading">
				<div class="status-page__pairs-table">
					<div class="component-title py-1">
						{{ $t('status.pairs_status') }}
					</div>
					<v-simple-table dense>
						<template #default>
							<thead class="primary">
								<tr>
									<th>
										{{ $t('table_header.pair') }}
									</th>
									<th>
										{{ $t('table_header.trading') }}
									</th>
									<th>
										{{ $t('table_header.margin_trading') }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in available_pairs" :key="item.id">
									<td>{{ item.currency }}/{{ item.market }}</td>
									<td>
										<v-icon :color="getStatusIcon(item.trade).color">
											{{ getStatusIcon(item.trade).name }}
										</v-icon>
									</td>
									<td>
										<v-icon :color="getStatusIcon(item.margin).color">
											{{ getStatusIcon(item.margin).name }}
										</v-icon>
									</td>
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
import { mapGetters, mapState } from 'vuex';
import CommonTooltip from '@/components/common/CommonTooltip.vue';

import balanceStateMethodsMixin from '@/mixins/balance/balanceStateMethodsMixin';
import CommonCurrency from '@/components/common/CommonCurrency.vue';

export default {
	name: 'StatusTables',

	components: { CommonCurrency, CommonTooltip },
	mixins: [balanceStateMethodsMixin],
	props: {
		currencies: {
			type: Array,
			required: true,
		},
		pairsData: {
			type: Array,
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
    ...mapState('user', ['blockStatus']),
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
    available_currencies() {
      return _.filter(this.currencies, item => { return item.status === 'active' });
    },
    available_pairs() {
      return _.filter(this.pairsData, item => { return item.interface === true });
    },
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
