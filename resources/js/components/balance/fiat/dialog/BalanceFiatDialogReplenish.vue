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
				<v-stepper v-model="step" class="no-transition">
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
              {{ $t('common.confirmation') }}
            </v-stepper-step>
          </v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<SelectReplenishMethod
								class="mb-6"
                :is_verified="is_verified"
                :trader_status="trader_status"
                :block_status="block_status"
								:platforms="platforms"
                :gateways="replenishGateways"
                :fees="fees"
								type="replenish"
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
              <FillAmountStep
                  v-if="selected_gateway && selected_gateway.code === 'QR'"
                  :selectedPlatform="selectedPlatfrom"
                  :currency_scale="currencyObj.scale"
                  :fees="fees"
                  :bank_details="bank_details"
                  @filled="amount_filled"
                  @back_pressed="back"
              />
              <FillFieldsStep
                  v-if="selected_gateway && selected_gateway.code === 'INVOICE'"
                  :trader_status="trader_status"
                  :selectedPlatform="selectedPlatfrom"
                  :currency_scale="currencyObj.scale"
                  :fees="fees"
                  :bank_details="bank_details"
                  @filled="fields_filled"
                  @back_pressed="back"
              />
						</v-stepper-content>

            <v-stepper-content class="pa-0" step="3">
              <ShowQr
                  v-if="selected_gateway && selected_gateway.code === 'QR' && amount !== null && bank_id !== null"
                  :selectedPlatform="selectedPlatfrom"
                  :amount="amount"
                  :bank_details="bank_details"
                  :bank_id="bank_id"
                  @back_pressed="back"
                  @success_response="close"
              />
              <ConfirmationStep
                  v-if="selected_gateway && selected_gateway.code === 'INVOICE' && amount !== null && inn !== null && bic !== null && acc !== null"
                  :banks="banks"
                  :amount="amount"
                  :bank_id="bank_id"
                  :inn="inn"
                  :bic="bic"
                  :acc="acc"
                  :selected-platform="selectedPlatfrom"
                  :fees="fees"
                  @back_pressed="back"
                  @success_response="close"
              ></ConfirmationStep>
            </v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import SelectReplenishMethod from '@/components/balance/fiat/dialog/parts/SelectReplenishMethod.vue';
import FillAmountStep from '@/components/balance/fiat/dialog/parts/qr/FillAmountStep.vue';
import ShowQr from '@/components/balance/fiat/dialog/parts/qr/ShowQr.vue';
import FillFieldsStep from '@/components/balance/fiat/dialog/parts/invoice/FillFieldsStep.vue';
import ConfirmationStep from '@/components/balance/fiat/dialog/parts/invoice/ConfirmationStep.vue';

import loadingMixin from '@/mixins/common/loadingMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';
export default {
	name: 'BalanceFiatDialogReplenish',
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
    SelectReplenishMethod,
    FillAmountStep,
    ShowQr,
    FillFieldsStep,
    ConfirmationStep
  },

	mixins: [
    loadingMixin,
    dialogMethodsMixin
  ],

	data() {
		return {
      selectedPlatfrom: null,
      selectedGateway: null,
			amount: null,
      bank_id: null,
      inn: null,
      bic: null,
      acc: null,
      gateways: [],
      banks: [],
      fees: [],
      bank_details: [],
			step: 1,
		};
	},

	computed: {
		totalAmount() {
			const total = Number(this.amount) - this.selectedPlatfrom?.withdrawFee;
			return total || 0;
		},
		minWithdraw() {
			return this.selectedPlatfrom?.minWithdraw;
		},
		maxWithdraw() {
			return Math.min(this.selectedPlatfrom?.maxWithdraw, this.currencyObj.safe);
		},
		currency() {
			return this.currencyObj.currency;
		},
    platforms() {
      return this.currencyObj.platforms;
    },
    replenishGateways() {
      return _.filter(this.gateways, item => {
        return (
            item.is_replenish === true
        );
      });
    },
    selected_gateway() {
      return this.selectedGateway;
    }
	},

	methods: {
    fields_filled(data) {
      this.bank_id = data.bank_id;
      this.amount = data.amount;
      this.inn = data.inn;
      this.bic = data.bic;
      this.acc = data.acc;
      this.banks = data.banks;
      this.step++;
		},
    amount_filled(data) {
      this.amount = data.amount;
      this.bank_id = data.bank_id;
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
			this.selectedPlatfrom = null;
      this.selectedGateway = null;
			this.step = 1;
		},
	},
  mounted() {
    axios.get('/trader/ext/all_fiat_platforms').then(response => {
      this.gateways = response.data.data;
    });
    axios.get('/trader/ext/all_fiat_fees').then(response => {
      this.fees = response.data.data;
    });
    axios.get('/trader/ext/replenish_bank_details').then(response => {
      this.bank_details = response.data.data;
    });
  }
};
</script>