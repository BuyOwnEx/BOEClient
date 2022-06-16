<template>
	<v-dialog v-model="dialog" width="800" :persistent="step === 3">
		<template #activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.replenish') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title">
				{{ $t('common.replenishment_funds') }} {{ currency }}
			</v-card-title>

			<v-card-text class="common-dialog__content pb-1">
				<v-stepper v-model="step">
					<v-stepper-items>
						<v-stepper-content step="1">
							<BalanceFiatDialogSelectSystem
								class="mb-6"
								:platforms="platforms"
                :gateways="gateways"
								type="replenish"
								@select="selectPaymentSystem"
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
									{{ $t('balance.dialog.fiat_replenishment_alert') }}
								</BalanceFiatDialogAlert>

								<div
									v-if="selectedSystem"
									class="balance-fiat-dialog-replenish__replenish-info pt-2"
								>
									{{
										$t('balance.dialog.fiat_bank_details_replenishment_description')
									}}
								</div>

								<v-form v-model="amountFormValid">
									<v-text-field
										v-model="amount"
										:placeholder="$t('balance.amount')"
										:suffix="currency"
                    :rules="amountRules"
										autofocus
										@keydown="validateNumber"
										@paste.prevent
									/>
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
                  :disabled="!amount || !amountFormValid"
									color="primary"
									tile
									text
									plain
									small
									@click="replenish"
								>
									{{ $t('common.replenish') }}
								</v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>
            <v-stepper-content class="pa-0" step="3">
              <v-card-text v-if="selectedSystem" class="common-dialog__content">
                <div>
                  <div>
                    {{ $t('balance.min_replenish_amount') }}:
                    <b> {{ selectedSystem.minReplenish }} {{ selectedSystem.currency }} </b>
                  </div>

                  <div>
                    {{ $t('balance.replenish_fee') }}:
                    <b>0 {{ selectedSystem.currency }}</b>
                  </div>
                </div>

                <div class="text-center">
                  <QrCode v-if="this.bank_details !== null" :value="qr_replenish" :options="{ width: 200 }" />
                </div>

              </v-card-text>

              <v-divider />

              <div class="common-dialog__actions d-flex pt-1">
                <v-spacer />
                <v-btn plain tile text small @click="back">
                  {{ $t('common.back') }}
                </v-btn>
                <v-spacer />
                <v-btn
                    :loading="loading"
                    color="primary"
                    tile
                    text
                    plain
                    small
                    @click="finish"
                >
                  {{ $t('kyc.purchase') }}
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
import QrCode from '@chenfengyuan/vue-qrcode';
import BalanceFiatDialogSelectSystem from './parts/BalanceFiatDialogSelectSystem';
import BalanceFiatDialogAlert from './parts/BalanceFiatDialogAlert';

import loadingMixin from '../../../../mixins/common/loadingMixin';
import validateInputMixin from '../../../../mixins/common/validateInputMixin';
import dialogMethodsMixin from '../../../../mixins/common/dialogMethodsMixin';
import BigNumber from 'bignumber.js';

export default {
	name: 'BalanceFiatDialogReplenish',

	components: { BalanceFiatDialogSelectSystem, BalanceFiatDialogAlert, QrCode },

	mixins: [loadingMixin, validateInputMixin, dialogMethodsMixin],

	props: {
		currencyObj: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			selectedSystem: null,
      bank_details: null,
			amount: '',
      amountFormValid: false,
      gateways: [],
			step: 1,
      amountRules: [
        v => !v || BigNumber(v).gte(this.selectedSystem.minReplenish) || this.$t('balance.less_min'),
        v => !v || this.isCorrectPrecision(v) || this.$t('forms_validation.unsupported_precision'),
      ],
		};
	},

	computed: {

		totalAmount() {
			const total = Number(this.amount) - this.selectedSystem?.withdrawFee;
			return total || 0;
		},

		minWithdraw() {
			return this.selectedSystem?.minWithdraw;
		},
		maxWithdraw() {
			return Math.min(this.selectedSystem?.maxWithdraw, this.currencyObj.safe);
		},
		currency() {
			return this.currencyObj.currency;
		},
    platforms() {
      return this.currencyObj.platforms;
    },
    qr_replenish() {
      return this.bank_details ?
          'ST00012|Name='+this.bank_details.name+
          '|PersonalAcc='+this.bank_details.personal_acc+
          '|BankName='+this.bank_details.bank_name+
          '|BIC='+this.bank_details.bic+
          '|CorrespAcc='+this.bank_details.corr_acc+
          '|KPP='+this.bank_details.kpp+
          '|PayeeINN='+this.bank_details.payee_inn+
          '|Purpose='+this.bank_details.purpose+
          '|Sum='+BigNumber(this.amount).multipliedBy(100).toString()
          : '';
    },
	},

	methods: {
		replenish() {
			try {
				this.startLoading();
			} finally {
				this.stopLoading();
        this.step++;
			}
		},
    finish() {
      axios.post('/trader/ext/notify_fiat_replenish', {
        currency: this.selectedSystem.currency,
        amount: this.amount,
        gateway_id: this.selectedSystem.gateway_id
      }).then(response => {
        if (response.data.success === true) {
          this.close();
        }
      });
    },
    isCorrectPrecision(v) {
      return !new RegExp('\\d+\\.\\d{' + (this.currencyObj.scale + 1) + ',}', 'i').test(v);
    },
		selectPaymentSystem(system) {
			this.selectedSystem = system;
			this.step++;
		},

		back() {
			this.step--;
		},
		clearData() {
			this.amount = '';
			this.selectedSystem = null;
			this.step = 1;
		},
	},
  mounted() {
    axios.get('/trader/ext/all_fiat_platforms').then(response => {
      this.gateways = response.data.data;
    });
    axios.get('/trader/ext/replenish_bank_details').then(response => {
      this.bank_details = response.data.data;
    });
  }
};
</script>
