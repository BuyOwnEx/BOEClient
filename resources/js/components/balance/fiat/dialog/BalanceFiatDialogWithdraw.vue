<template>
	<v-dialog v-model="dialog" width="1200" :persistent="step === 4">
		<template #activator="{ on, attrs }">
			<v-list-item dense v-bind="attrs" v-on="on">
				<v-list-item-title>
					{{ $t('common.withdraw') }}
				</v-list-item-title>
			</v-list-item>
		</template>

		<v-card>
			<v-card-title class="common-dialog__title">
        {{ $t('common.withdrawal_funds') }} {{ currency }}
      </v-card-title>

			<v-card-text class="common-dialog__content pb-1">
				<v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">
              {{ $t('balance.select_payment_method') }}
            </v-stepper-step>

            <v-divider />

            <v-stepper-step :complete="step > 2" step="2">
              {{ $t('balance.fill_all_fields') }}
            </v-stepper-step>

            <v-divider />

            <v-stepper-step :complete="step > 3" step="3">
              {{ $t('balance.stepper.withdrawal_params.title') }}
            </v-stepper-step>

            <v-divider />

            <v-stepper-step :complete="step > 4" step="4">
              {{ $t('common.confirmation') }}
            </v-stepper-step>
          </v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<SelectWithdrawMethod
								class="mb-6"
                :is_verified="is_verified"
                :trader_status="trader_status"
                :block_status="block_status"
                :platforms="platforms"
                :bank_details="bank_details"
                :gateways="withdrawGateways"
                :fees="fees"
								@select_platform="platformSelected"
							/>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn block plain tile text small @click="close"> {{ $t('common.close') }} </v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
              <FillFieldsWithdrawStep
                  v-if="selected_gateway && selected_gateway.code === 'INVOICE'"
                  :trader_status="trader_status"
                  :selectedPlatform="selectedPlatfrom"
                  :bank_details="bank_details"
                  :currency_obj="currencyObj"
                  :fees="fees"
                  @filled="fields_filled"
                  @back_pressed="back"
              />
						</v-stepper-content>

            <v-stepper-content class="pa-0" step="3">
              <ConfirmationWithdrawStep
                  v-if="selected_gateway && selected_gateway.code === 'INVOICE' && amount !== null && inn !== null && bic !== null && acc !== null"
                  :amount="amount"
                  :inn="inn"
                  :bic="bic"
                  :acc="acc"
                  :fees="fees"
                  :selected-platform="selectedPlatfrom"
                  :bank_details="bank_details"
                  @back_pressed="back"
                  @success_response="success_confirmation"
              ></ConfirmationWithdrawStep>
            </v-stepper-content>

            <v-stepper-content class="pa-0" step="4">
              <CheckCodeStep

              ></CheckCodeStep>
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
import ConfirmationWithdrawStep from '@/components/balance/fiat/dialog/parts/invoice/ConfirmationWithdrawStep.vue';
import FillFieldsWithdrawStep from '@/components/balance/fiat/dialog/parts/invoice/FillFieldsWithdrawStep.vue';
import CheckCodeStep from '@/components/balance/fiat/dialog/parts/invoice/CheckCodeStep.vue';

import loadingMixin from '@/mixins/common/loadingMixin';
import validateInputMixin from '@/mixins/common/validateInputMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';

export default {
	name: 'BalanceFiatDialogWithdraw',
  props: {
    currencyObj: {
      type: Object,
      required: true,
    },
    is_verified: {
      type: Boolean,
      required: true,
    },
    block_status: {
      type: Number,
      required: true,
    },
    trader_status: {
      type: Number,
      required: true,
    },
  },
	components: {
    SelectWithdrawMethod,
    BalanceFiatDialogSelectSystem,
    BalanceFiatDialogAlert,
    CommonAvailable,
    ConfirmationWithdrawStep,
    FillFieldsWithdrawStep,
    CheckCodeStep
  },

	mixins: [
    loadingMixin,
    validateInputMixin,
    dialogMethodsMixin
  ],

	data() {
		return {
      selectedPlatfrom: null,
      selectedGateway: null,
			amount: '',
      inn: null,
      bic: null,
      acc: null,
      gateways: [],
      bank_details: [],
      fees: [],
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
    axios.get('/trader/ext/withdraw_bank_details').then(response => {
      this.bank_details = response.data.data;
    });
  },
	computed: {
		totalAmount() {
			const total = Number(this.amount) - this.selectedPlatfrom?.withdrawFee;
			if (!total || total < 0) return 0;
			return total;
		},
		availableForWithdraw() {
			return BigNumber.min(this.availableForUser, this.maxAvailable).toString();
		},
		minWithdraw() {
			return this.selectedPlatfrom?.minWithdraw;
		},
		maxWithdraw() {
			return this.selectedPlatfrom?.maxWithdraw;
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
    selected_gateway() {
      return this.selectedGateway;
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
    fields_filled(data) {
      this.amount = data.amount;
      this.inn = data.inn;
      this.bic = data.bic;
      this.acc = data.acc;
      this.step++;
    },
    success_confirmation() {
      this.step++;
    },
    platformSelected(data) {
      this.selectedPlatfrom = data.platform;
      this.selectedGateway = data.gateway;
      this.step++;
    },
    back() {
      this.step--;
    },
    clearData() {
      this.amount = '';
      this.inn = null;
      this.bic = null;
      this.acc = null;
      this.selectedPlatfrom = null;
      this.selectedGateway = null;
      this.step = 1;
    },

		setAvailableForWithdrawAmount() {
			this.amount = this.availableForWithdraw;
		},




	},
};
</script>