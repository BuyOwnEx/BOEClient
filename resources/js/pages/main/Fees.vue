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
							{{ $t('fees.crypto_title') }}
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
								<template v-for="curr in available_crypto_currencies">
									<template v-for="platform in curr.platforms">
										<tr>
											<td nowrap="" class="text-left pl-2" style="width:80px">
												<CommonCurrency :code="curr.currency" :color="curr.color" :src="curr.logo" />
											</td>
											<td nowrap="" class="text-left pl-2">{{ curr.name }}</td>
											<td nowrap="">{{ getNumber(curr.maxVerifyWithdraw) }} {{ curr.currency }}</td>
											<td nowrap="">
                        <span v-if="advanced_limit_info"> - </span>
                        <span v-else>{{ getNumber(curr.maxWithdraw) }} {{ curr.currency }}</span>
                      </td>
											<td nowrap="">{{ platform.platform || platform.base_currency || $t('fiat.gateways.'+platform.gateway_code.toLowerCase()) || '-' }}</td>
											<td class="overline" nowrap="">{{ $t('fees.crypto_asset_types.'+platform.type.toLowerCase()) }}</td>
											<td>{{ getNumber(platform.minReplenish) }} {{ curr.currency }}</td>
											<td>{{ getNumber(platform.minWithdraw) }} {{ curr.currency }}</td>
											<td>{{ getNumber(platform.feeWithdraw) }} {{ curr.currency }}</td>
										</tr>
									</template>
								</template>
							</tbody>
						</v-simple-table>
					</div>
          <v-divider class="mt-2 mb-1" v-if="available_fiat_currencies.length > 0"></v-divider>
          <div class="status-page__fiat-table" v-if="available_fiat_currencies.length > 0">
            <div class="component-title py-1">
              {{ $t('fees.fiat_title') }}
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
                <th colspan="2" nowrap="">
                  {{ $t('table_header.daily_withdrawal_limit') }}
                </th>
                <th colspan="6">
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
                  {{ $t('table_header.gateway') }}
                </th>
                <th>
                  {{ $t('table_header.bank') }}
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
              </tr>
              </thead>

              <tbody>
              <template v-for="curr in available_fiat_currencies">
                <tr>
                  <td nowrap="" class="text-left pl-2" style="width:80px">
                    <CommonCurrency :code="curr.currency" :src="curr.logo" />
                  </td>
                  <td nowrap="" class="text-left pl-2">{{ $t('currencies.'+curr.currency.toLowerCase()) }}</td>
                  <td nowrap="">{{ getNumber(curr.maxVerifyWithdraw) }} {{ curr.currency }}</td>
                  <td nowrap="">
                    <span v-if="advanced_limit_info"> - </span>
                    <span v-else>{{ getNumber(curr.maxWithdraw) }} {{ curr.currency }}</span>
                  </td>
                  <td nowrap="">
                    <item-with-logo
                        :cell_text="$t('fiat.gateways.'+curr.gateway.toLowerCase()) || '-'"
                        :logo="curr.gateway_logo"
                        :size="18"
                    ></item-with-logo>
                  </td>
                  <td nowrap="">
                    <item-with-logo
                        :cell_text="curr.bank"
                        :logo="curr.bank_logo"
                        :size="18"
                    ></item-with-logo>
                  </td>
                  <td>{{ getNumber(curr.minReplenish) }} {{ curr.currency }}</td>
                  <td>{{ getNumber(curr.minWithdraw) }} {{ curr.currency }}</td>
                  <td>{{ curr.replenish_fee }} </td>
                  <td>{{ curr.withdraw_fee }} </td>
                </tr>
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
import thousands from '@/plugins/thousands.js';
import bignumber from '@/mixins/format/bignumber.js';
import CommonPageTitle from '@/components/common/CommonPageTitle.vue';
import FeesTradingTab from '@/components/info/fees/FeesTradingTab.vue';
import CommonCurrency from '@/components/common/CommonCurrency.vue';
import ItemWithLogo from "@/components/common/ItemWithLogo.vue";

export default {
	name: 'Fees',
	components: {
    ItemWithLogo,
		CommonCurrency,
		CommonPageTitle,
		FeesTradingTab,
	},
  mixins: [bignumber],
	data() {
		return {
			selectedTab: 0,
      advanced_limit_info: import.meta.env.VITE_ADVANCED_WITHDRAW_LIMITS === 'true',
      withdraw_pay_templates: [],
      replenish_pay_templates: []
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
    available_crypto_currencies() {
      return _.filter(this.currencies, item => { return item.status === 'active' && item.type === 'crypto' });
    },
    available_fiat_currencies() {
      const fiatCurrencies = _.filter(this.currencies, item => { return item.status === 'active' && item.type === 'fiat' });
      const currencyMap = fiatCurrencies.reduce((map, currency) => {
        map[currency.currency] = {
          logo: currency.logo,
          maxWithdraw: currency.maxWithdraw,
          maxVerifyWithdraw: currency.maxVerifyWithdraw
        };
        return map;
      }, {});
      const currencyPlatformMap = fiatCurrencies.reduce((map, currency) => {
        const platformMap = {};
        (currency.platforms || []).forEach(platform => {
          platformMap[platform.gateway_id] = {
            minReplenish: platform.minReplenish,
            minWithdraw: platform.minWithdraw,
            gatewayId: platform.gateway_id,
            gateway_logo: platform.gateway_logo
          };
        });
        map[currency.currency] = platformMap;
        return map;
      }, {});

      const replenishFeesArray = this.replenish_pay_templates;
      const withdrawFeesArray = this.withdraw_pay_templates;
      const allFees = [...replenishFeesArray, ...withdrawFeesArray];
      const groupedFees = _.groupBy(allFees, fee =>
          `${fee.currency}_${fee.gateway_name}_${fee.bank_name}`
      );

      const result = [];

      Object.entries(groupedFees).forEach(([key, fees]) => {
        const replenishFee = fees.find(f => f.type === 'replenish');
        const withdrawFee = fees.find(f => f.type === 'withdraw');
        const currencyData = currencyMap[fees[0].currency];
        const platformsForCurrency = currencyPlatformMap[fees[0].currency] || {};

        // Берём gateway_id из первой комиссии в группе
        const gatewayId = fees[0].gateway_id;
        // Находим лимиты для этой платформы
        const platformLimits = platformsForCurrency[gatewayId];

        // Базовый объект
        const entry = {
          currency: fees[0].currency,
          logo: currencyData?.logo,
          maxWithdraw: currencyData?.maxWithdraw,
          maxVerifyWithdraw: currencyData?.maxVerifyWithdraw,
          minReplenish: platformLimits ? platformLimits.minReplenish : '-',
          minWithdraw: platformLimits ? platformLimits.minWithdraw : '-',
          gateway_logo: platformLimits ? platformLimits.gateway_logo : null,
          gateway: fees[0].gateway_name,
          bank: fees[0].bank_name,
          bank_logo: fees[0].bank_logo
        };

        // Добавляем пополнение, только если есть данные
        if (replenishFee) {
          entry.replenish_fee = this.getFee(replenishFee.fee_type, replenishFee.fix_fee, replenishFee.bank_fix_fee, replenishFee.percent_fee, replenishFee.bank_percent_fee, fees[0].currency);
        } else entry.replenish_fee = 'N/A'

        // Добавляем вывод, только если есть данные
        if (withdrawFee) {
          entry.withdraw_fee = this.getFee(withdrawFee.fee_type, withdrawFee.fix_fee, withdrawFee.bank_fix_fee, withdrawFee.percent_fee, withdrawFee.bank_percent_fee, fees[0].currency);
        } else entry.withdraw_fee = 'N/A'

        result.push(entry);
      });
      return result;
      //return _.filter(this.currencies, item => { return item.status === 'active' && item.type === 'fiat' });
    },
  },
  methods: {
    getNumber(number) {
      return thousands(this.BigNumber(number), ' ')
    },
    getFee(fee_type, own_fix_fee, bank_fix_fee, own_percent_fee, bank_percent_fee, currency) {
      let fix_part = '';
      let percent_part = '';
      if(!this.BigNumber(bank_fix_fee).eq(0) || !this.BigNumber(own_fix_fee).eq(0))
      {
        fix_part = this.getNumber(this.BigNumber(bank_fix_fee).plus(own_fix_fee).toString()) + ' ' + currency;
      }
      if(!this.BigNumber(bank_percent_fee).eq(0) || !this.BigNumber(own_percent_fee).eq(0))
      {
        percent_part = this.BigNumber(bank_percent_fee).plus(own_percent_fee).toString() + '%';
      }
      if(fix_part !== '' && percent_part !== '')
      {
        if(fee_type === 'OR') return percent_part + '; ' + this.$t('common.min') + ' ' + fix_part;
        else return fix_part + ' + ' + percent_part;
      }
      else if(fix_part === '' && percent_part === '')
      {
        return '-';
      }
      else {
        if(fix_part !== '') return fix_part;
        if(percent_part !== '') return percent_part;
      }
    },
  },
  mounted() {
    axios.get('/trader/ext/withdraw_pay_templates').then(response => {
      this.withdraw_pay_templates = response.data.data;
    });
    axios.get('/trader/ext/replenish_pay_templates').then(response => {
      this.replenish_pay_templates = response.data.data;
    });
  },
};
</script>

<style lang="sass">
.v-data-table--dense > .v-data-table__wrapper > table > tbody > tr > th,
.v-data-table--dense > .v-data-table__wrapper > table > thead > tr > th,
.v-data-table--dense > .v-data-table__wrapper > table > tfoot > tr > th
	height: 24px
.fees-page
	&__search
		max-width: 15% !important
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
