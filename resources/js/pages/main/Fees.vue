<template>
	<v-card class="fees-page info-page status-page flex-grow-1">
		<CommonPageTitle>{{ $t('fees.title') }}</CommonPageTitle>
		<v-card-text>
			<v-tabs v-model="selectedTab" class="small-tabs" :key="$i18n.locale" show-arrows>
				<v-tab :key="1">
					{{ $t('status.currencies_tab') }}
				</v-tab>

				<v-tab :key="2" v-if="!isHideTrading">
					{{ $t('status.pairs_tab') }}
				</v-tab>
			</v-tabs>

			<v-tabs-items v-model="selectedTab" touchless>
				<v-tab-item :key="1">
					<div class="status-page__crypto-table">
						<div class="component-title py-1">
							{{ $t('fees.title') }}
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
									<th colspan="2" nowrap="">
										{{ $t('table_header.daily_withdrawal_limit') }}
									</th>
									<th colspan="5">
										{{ $t('table_header.platform') }}
									</th>
								</tr>
								<tr>
									<th>
                    <span v-if="advanced_limit_info">{{ $t('common.individual') }}</span>
                    <span v-else>KYC</span>
									</th>
									<th>
                    <span v-if="advanced_limit_info">{{ $t('common.legal') }}</span>
                    <span v-else>{{ $t('table_header.no_kyc') }}</span>
									</th>
									<th>
										{{ $t('table_header.network') }}
									</th>
									<th>
										{{ $t('table_header.type') }}
									</th>
									<th>
										{{ $t('table_header.min_replenish_amount') }}
									</th>
									<th>
										{{ $t('table_header.min_withdrawal_amount') }}
									</th>
									<th>
										{{ $t('table_header.withdrawal_fee') }}
									</th>
								</tr>
							</thead>

							<tbody>
								<template v-for="curr in currencies">
									<template v-for="platform in curr.platforms">
										<tr>
											<td nowrap="">
												<CommonCurrency :code="curr.currency" :color="curr.color" :src="curr.logo" />
											</td>
											<td nowrap="">{{ curr.name }}</td>
											<td class="overline" nowrap="">{{ curr.type }}</td>
											<td nowrap="">{{ curr.maxVerifyWithdraw }} {{ curr.currency }}</td>
											<td nowrap="">
                        <span v-if="advanced_limit_info"> - </span>
                        <span v-else>{{ curr.maxWithdraw }} {{ curr.currency }}</span>
                      </td>
											<td nowrap="">{{ platform.platform || platform.base_currency || '-' }}</td>
											<td class="overline" nowrap="">{{ platform.type || 'Fiat' }}</td>
											<td>{{ platform.minReplenish }} {{ curr.currency }}</td>
											<td>{{ platform.minWithdraw }} {{ curr.currency }}</td>
											<td>{{ platform.feeWithdraw }} {{ curr.currency }}</td>
										</tr>
									</template>
								</template>
							</tbody>
						</v-simple-table>
					</div>
				</v-tab-item>

				<v-tab-item :key="2" v-if="!isHideTrading">
					<FeesTradingTab />
				</v-tab-item>

			</v-tabs-items>
		</v-card-text>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';

import CommonPageTitle from '@/components/common/CommonPageTitle.vue';
import FeesTradingTab from '@/components/info/fees/FeesTradingTab.vue';
import CommonCurrency from '@/components/common/CommonCurrency.vue';

export default {
	name: 'Fees',
	components: {
		CommonCurrency,
		CommonPageTitle,
		FeesTradingTab,
	},

	data() {
		return {
			selectedTab: 0,
      advanced_limit_info: import.meta.env.VITE_ADVANCED_WITHDRAW_LIMITS === 'true'
		};
	},
  computed: {
    ...mapState('trading', ['all_currencies','allCurrencyListInit']),
    ...mapState('user', ['blockStatus']),
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
    currencies() {
      return this.allCurrencyListInit ? this.all_currencies : []
    },
  },
  mounted() {
    if(!this.allCurrencyListInit)
      this.$store.dispatch('trading/getAllCurrencyListFromServer');
  },
};
</script>

<style lang="sass">
.fees-page
	&__search
		max-width: 15%
		margin-left: auto

	@media screen and (max-width: 1300px)
		&__search
			max-width: 25%
	@media screen and (max-width: 959px)
		&__search
			max-width: 100%
			padding-left: 16px

.v-application--is-rtl
	.fees-page__search
		margin-right: auto
		margin-left: unset
</style>
