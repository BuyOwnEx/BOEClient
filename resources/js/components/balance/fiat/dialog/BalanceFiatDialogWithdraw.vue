<template>
	<v-dialog v-model="dialog" width="800">
		<template #activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.withdraw') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title"> {{ $t('common.withdrawal_funds') }} {{ currency }} </v-card-title>

			<v-card-text class="common-dialog__content pb-1">
				<v-stepper v-model="step">
					<v-stepper-items>
						<v-stepper-content step="1">
							<SelectWithdrawMethod
								class="mb-6"
                :platforms="platforms"
                :gateways="withdrawGateways"
                :fees="fees"
								@select_platform="platformSelected"
							/>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn block plain tile text small @click="close">
									{{ $t('common.close') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
							<div class="mb-6">
								<BalanceFiatDialogAlert>
									{{ $t('balance.dialog.fiat_withdrawal_alert') }}
								</BalanceFiatDialogAlert>

								<div v-if="selectedSystem" class="balance-fiat-dialog-withdraw__withdraw-info">
									<div class="py-2">
										{{
											$t('balance.dialog.fiat_withdrawal_description', {
												payment: selectedSystem.name,
											})
										}}
									</div>

									<CommonAvailable
										:available="currencyObj.safe"
										:currency="currency"
										:available-text="$t('balance.current_balance')"
										@set="setCurrentBalance"
									/>

									<CommonAvailable
										:available="selectedSystem.minWithdraw"
										:currency="currency"
										:available-text="$t('balance.min_amount')"
										non-clickable
									/>

									<CommonAvailable
										:available="selectedSystem.maxWithdraw"
										:currency="currency"
										:available-text="$t('balance.max_amount')"
										:small-text="$t('balance.stepper.withdrawal_params.used_day_limit')"
										:small="currencyObj.daily"
										non-clickable
									/>

									<CommonAvailable
										:available="selectedSystem.withdrawFee"
										:currency="currency"
										:available-text="$t('balance.fee')"
										non-clickable
									/>

									<CommonAvailable
										:available="totalAmount"
										:currency="currency"
										:available-text="$t('balance.you_get')"
										non-clickable
									/>

									<CommonAvailable
										:available="availableForWithdraw"
										:currency="currency"
										:available-text="$t('balance.stepper.withdrawal_params.available_for_withdraw')"
										@set="setAvailableForWithdrawAmount"
									/>
								</div>

								<v-form v-model="valid">
									<v-text-field
										v-model="amount"
										:rules="amountRules"
										:placeholder="$t('balance.amount')"
										:suffix="currency"
										autofocus
										@keydown="validateNumber"
										@paste.prevent
									/>

									<v-select v-model="selectedMethodID" :placeholder="$t('balance.amount')" hide-details />

									<v-text-field v-model="phone" :placeholder="$t('balance.amount')" />
								</v-form>
							</div>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn plain tile text small @click="back">
									{{ $t('common.back') }}
								</v-btn>
								<v-spacer />
								<v-btn
									:loading="loading"
									:disabled="!amount.trim() || !valid"
									color="primary"
									tile
									text
									plain
									small
									@click="withdraw"
								>
									{{ $t('common.withdraw') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import BalanceFiatDialogSelectSystem from '@/components/balance/fiat/dialog/parts/BalanceFiatDialogSelectSystem.vue';
import SelectWithdrawMethod from '@/components/balance/fiat/dialog/parts/SelectWithdrawMethod.vue';
import BalanceFiatDialogAlert from '@/components/balance/fiat/dialog/parts/BalanceFiatDialogAlert.vue';
import CommonAvailable from '@/components/common/CommonAvailable.vue';

import loadingMixin from '@/mixins/common/loadingMixin';
import validateInputMixin from '@/mixins/common/validateInputMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';

export default {
	name: 'BalanceFiatDialogWithdraw',

	components: {
    SelectWithdrawMethod,
    BalanceFiatDialogSelectSystem,
    BalanceFiatDialogAlert,
    CommonAvailable
  },

	mixins: [
    loadingMixin,
    validateInputMixin,
    dialogMethodsMixin
  ],

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			selectedSystem: null,
			amount: '',
			selectedMethodID: 1,
			phone: '',
      gateways: [],
      fees: [],
			amountRules: [
				v => !v || BigNumber(v).gte(this.minWithdraw) || this.$t('balance.less_min'),
				v => !v || BigNumber(v).lte(this.maxWithdraw) || this.$t('balance.more_max'),
				v => !v || BigNumber(v).lte(this.currencyObj.safe) || this.$t('balance.more_available'),
				v => !v || BigNumber(v).lte(this.availableForWithdraw) || this.$t('balance.more_withdraw_available'),
			],
			valid: false,
			step: 1,
		};
	},
  mounted() {
    axios.get('/trader/ext/all_fiat_platforms').then(response => {
      this.gateways = response.data.data;
    });
    axios.get('/trader/ext/all_fiat_fees').then(response => {
      this.fees = response.data.data;
    });
  },
	computed: {
		totalAmount() {
			const total = Number(this.amount) - this.selectedSystem?.withdrawFee;
			if (!total || total < 0) return 0;
			return total;
		},
		availableForWithdraw() {
			return BigNumber.min(this.availableForUser, this.maxAvailable).toString();
		},
		minWithdraw() {
			return this.selectedSystem?.minWithdraw;
		},
		maxWithdraw() {
			return this.selectedSystem?.maxWithdraw;
		},
		currency() {
			return this.currencyObj.currency;
		},
		safe() {
			return BigNumber(this.currencyObj.safe);
		},
		fee() {
			return BigNumber(this.currencyObj.feeWithdraw);
		},
		daily() {
			return BigNumber(this.currencyObj.daily);
		},
		availableForUser() {
			return this.safe.minus(this.fee).gt(0) ? this.safe.minus(this.fee) : BigNumber(0);
		},
		maxAvailable() {
			return BigNumber(this.maxWithdraw).minus(this.daily);
		},
    platforms() {
      return this.currencyObj.platforms;
    },
    withdrawGateways() {
      return _.filter(this.gateways, item => {
        return (
            item.is_withdrawal === true
        );
      });
    }
  },

	methods: {
		withdraw() {
			try {
				this.startLoading();
				// TODO
			} finally {
				this.stopLoading();
			}
		},

		setCurrentBalance() {
			this.amount = this.currencyObj.safe.toString();
		},
		setAvailableForWithdrawAmount() {
			this.amount = this.availableForWithdraw;
		},

    platformSelected(platform) {
			this.selectedSystem = platform;
			this.step++;
		},
		back() {
			this.step--;
		},
		clearData() {
			this.amount = '';
			this.selectedSystem = null;
			this.selectedMethodID = 1;
			this.phone = '';
			this.step = 1;
		},
	},
};
</script>
