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
			<v-card-title class="common-dialog__title common-dialog__title--error">
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
              <span v-if="selected_platform && selected_platform.gateway_code === 'INVOICE'">{{ $t('balance.stepper.withdrawal_params.title') }}</span>
              <span v-else>{{ $t('common.confirmation') }}</span>
            </v-stepper-step>

            <v-divider />

            <v-stepper-step :complete="step > 4" step="4" v-if="selected_platform && selected_platform.gateway_code === 'INVOICE'">
              {{ $t('common.confirmation') }}
            </v-stepper-step>
          </v-stepper-header>

					<v-stepper-items>
						<v-stepper-content step="1">
							<SelectWithdrawMethod
                v-if="platforms.length > 0"
								class="mb-6"
                :platforms="platforms"
                :is_verified="is_verified"
                :trader_status="trader_status"
                :block_status="block_status"
								@select_platform="platformSelected"
							/>
              <div class="d-flex align-center justify-center mb-3 red--text" style="height: 100px" v-else>
                <span>{{ $t('fiat.gateway.withdraw.not_found') }}</span>
              </div>
							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn block plain tile text small @click="close"> {{ $t('common.close') }} </v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
              <FillFieldsWithdrawStep
                  v-if="selected_platform && selected_platform.gateway_code === 'INVOICE'"
                  :trader_status="trader_status"
                  :selectedPlatform="selectedPlatfrom"
                  :currency_obj="currencyObj"
                  :pay_templates="pay_templates"
                  :rub_props="rub_props"
                  :kgs_props="kgs_props"
                  :swift_props="swift_props"
                  @filled="fields_filled"
                  @back_pressed="back"
              />
              <FillOfficeWithdrawStep
                  v-if="selected_platform && selected_platform.gateway_code === 'OFFICE'"
                  :trader_status="trader_status"
                  :selectedPlatform="selectedPlatfrom"
                  :pay_templates="pay_templates"
                  :available_offices="available_offices"
                  @office_filled="office_fields_filled"
                  @back_pressed="back"
              />
						</v-stepper-content>

            <v-stepper-content class="pa-0" step="3">
              <ConfirmationWithdrawStep
                  v-if="selected_platform && selected_platform.gateway_code === 'INVOICE' && amount !== null && prop_id !== null && pay_template_id !== null && prop_type !== null"
                  :amount="amount"
                  :pay_templates="pay_templates"
                  :pay_template_id="pay_template_id"
                  :prop_id="prop_id"
                  :prop_type="prop_type"
                  :rub_props="rub_props"
                  :kgs_props="kgs_props"
                  :swift_props="swift_props"
                  :selected-platform="selectedPlatfrom"
                  @back_pressed="back"
                  @success_response="success_confirmation"
              ></ConfirmationWithdrawStep>
              <ConfirmationOfficeWithdrawStep
                  v-if="selected_platform && selected_platform.gateway_code === 'OFFICE' && office !== null && visit_date !== null && visit_from !== null && visit_till !== null"
                  :office="office"
                  :visit_date="visit_date"
                  :visit_from="visit_from"
                  :visit_till="visit_till"
                  :selected-platform="selectedPlatfrom"
                  @back_pressed="back"
                  @success_response="close"
              ></ConfirmationOfficeWithdrawStep>
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
import FillOfficeWithdrawStep from '@/components/balance/fiat/dialog/parts/office/FillOfficeWithdrawStep.vue';
import ConfirmationOfficeWithdrawStep
  from '@/components/balance/fiat/dialog/parts/office/ConfirmationOfficeWithdrawStep.vue';

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
    rub_props: {
      type: Array,
      required: true,
      default: () => []
    },
    kgs_props: {
      type: Array,
      required: true,
      default: () => []
    },
    swift_props: {
      type: Array,
      required: true,
      default: () => []
    }
  },
	components: {
    ConfirmationOfficeWithdrawStep,
    FillOfficeWithdrawStep,
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
      pay_templates: [],
      available_offices: [],
      amount: null,
      pay_template_id: null,
      prop_id: null,
      prop_type: null,
      office: null,
      visit_date: null,
      visit_from: null,
      visit_till: null,
			step: 1,
		};
	},
  mounted() {
    axios.get('/trader/ext/withdraw_pay_templates').then(response => {
      this.pay_templates = response.data.data;
    });
    axios.get('/trader/ext/offices').then(response => {
      this.available_offices = response.data.data;
    });
  },
	computed: {
    available_pay_templates() {
      return this.pay_templates;
    },
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
    selected_platform() {
      return this.selectedPlatfrom;
    },
  },

	methods: {
    fields_filled(data) {
      this.pay_template_id = data.pay_template_id;
      this.amount = data.amount;
      this.prop_id = data.prop_id;
      this.prop_type = data.prop_type;
      this.step++;
    },
    office_fields_filled(data) {
      this.office = data.office;
      this.visit_date = data.visit_date;
      this.visit_from = data.visit_period[0];
      this.visit_till = data.visit_period[1];
      this.step++;
    },
    success_confirmation() {
      this.step++;
    },
    platformSelected(data) {
      this.selectedPlatfrom = data.platform;
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
      this.step = 1;
    },

		setAvailableForWithdrawAmount() {
			this.amount = this.availableForWithdraw;
		},
	},
};
</script>

<style lang="sass">
.common-dialog
  &__title
    font-weight: 600 !important
    padding: 8px 24px 8px !important

    &--success
      background-color: var(--v-success-base)
    &--error
      background-color: var(--v-error-base)

  &__content
    padding-top: 8px !important

  &__actions
    .v-btn
      text-transform: uppercase !important
      letter-spacing: 1px !important

.theme--dark
  .common-dialog
    &__title
      &--success
        background-color: var(--v-success-darken1)
      &--error
        background-color: var(--v-error-darken1)
</style>