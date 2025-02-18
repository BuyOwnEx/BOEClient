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
			<v-card-title class="common-dialog__title common-dialog__title--success">
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
                v-if="platforms.length > 0"
								class="mb-6"
                :is_verified="is_verified"
                :trader_status="trader_status"
                :block_status="block_status"
								:platforms="platforms"
								type="replenish"
								@select_platform="platformSelected"
							/>
              <div class="d-flex align-center justify-center mb-3 red--text" style="height: 100px" v-else>
                <span>{{ $t('fiat.gateway.replenish.not_found') }}</span>
              </div>

							<v-divider />

							<div class="common-dialog__actions d-flex pt-1">
								<v-spacer />
								<v-btn block plain tile text small @click="close"> {{ $t('common.close') }} </v-btn>
								<v-spacer />
							</div>
						</v-stepper-content>

						<v-stepper-content step="2">
              <FillAmountStep
                  v-if="selected_platform && selected_platform.gateway_code === 'QR'"
                  :selectedPlatform="selectedPlatfrom"
                  :currency_scale="currencyObj.scale"
                  :pay_templates="pay_templates"
                  @filled="amount_filled"
                  @back_pressed="back"
              />
              <FillFieldsStep
                  v-if="selected_platform && selected_platform.gateway_code === 'INVOICE'"
                  :trader_status="trader_status"
                  :selectedPlatform="selectedPlatfrom"
                  :currency_scale="currencyObj.scale"
                  :pay_templates="pay_templates"
                  :rub_props="rub_props"
                  :swift_props="swift_props"
                  @filled="fields_filled"
                  @back_pressed="back"
              />
						</v-stepper-content>

            <v-stepper-content class="pa-0" step="3">
              <ShowQr
                  v-if="selected_platform && selected_platform.gateway_code === 'QR' && amount !== null && pay_template_id !== null && qr_bank_details !== null"
                  :amount="amount"
                  :pay_templates="pay_templates"
                  :pay_template_id="pay_template_id"
                  :qr_bank_details="qr_bank_details"
                  @back_pressed="back"
                  @success_response="close"
              />
              <ConfirmationStep
                  v-if="selected_platform && selected_platform.gateway_code === 'INVOICE' && amount !== null && prop_id !== null && pay_template_id !== null"
                  :amount="amount"
                  :pay_templates="pay_templates"
                  :pay_template_id="pay_template_id"
                  :prop_id="prop_id"
                  :prop_type="prop_type"
                  :rub_props="rub_props"
                  :swift_props="swift_props"
                  :selected-platform="selectedPlatfrom"
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
import BigNumber from 'bignumber.js';
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
    rub_props: {
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
			amount: null,
      pay_template_id: null,
      prop_id: null,
      prop_type: null,
      pay_templates: [],
      qr_bank_details: null,
			step: 1,
		};
	},
	computed: {
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
    selected_platform() {
      return this.selectedPlatfrom;
    }
	},

	methods: {
    fields_filled(data) {
      this.pay_template_id = data.pay_template_id;
      this.amount = data.amount;
      this.prop_id = data.prop_id;
      this.prop_type = data.prop_type;
      this.step++;
		},
    amount_filled(data) {
      this.amount = data.amount;
      this.pay_template_id = data.pay_template_id;
      let template = _.find(this.pay_templates, item => (item.id === data.pay_template_id))
      axios.get('/trader/ext/qr_bank_details',{
        params: {
          pay_template_id: data.pay_template_id,
          prop_id: template.prop_id
        },
      }).then(response => {
        this.qr_bank_details = response.data.props;
        this.step++;
      });
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
			this.selectedPlatfrom = null;
			this.step = 1;
		},
	},
  mounted() {
    axios.get('/trader/ext/replenish_pay_templates').then(response => {
      this.pay_templates = response.data.data;
    });
  }
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