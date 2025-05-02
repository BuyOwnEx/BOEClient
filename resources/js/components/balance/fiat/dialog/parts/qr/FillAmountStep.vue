<template>
  <div>
    <div class="mb-6">
      <BalanceFiatDialogAlert>
        {{ $t('balance.dialog.fiat_replenishment_alert') }}
      </BalanceFiatDialogAlert>

      <div class="balance-fiat-dialog-replenish__replenish-info pt-2 mb-3">
        {{ use_props ? $t('balance.dialog.fiat_qr_amount_step_with_prop_description') : $t('balance.dialog.fiat_qr_amount_step_description') }}
      </div>

      <v-form v-model="formValid">
        <v-row>
          <v-col cols="12" md="12" class="pt-0 pb-2">
            <v-select
                v-model="pay_template_id"
                :items="available_pay_templates"
                :item-text="use_props ? 'prop_name' : 'bank_name'"
                item-value="id"
                :label="use_props ? $t('balance.select_recipient_prop') : $t('balance.select_bank')"
                :hint="use_props ? $t('balance.select_recipient_prop_hint') : $t('balance.select_bank_hint')"
                :rules="[rules.required]"
                autofocus
                persistent-hint
                hide-details="auto"
                required
                class="required"
            >
              <template #item="{item, on, attr}">
                <v-list-item v-bind="attr" v-on="on">
                  <v-list-item-icon v-if="!use_props">
                    <v-img
                        class="elevation-0 d-inline-flex"
                        style="vertical-align: middle"
                        :src="item.bank_logo"
                        max-height="16"
                        max-width="16"
                    ></v-img>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="use_props ? item.prop_name : item.bank_name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="{item}">
                <v-img
                    v-if="!use_props"
                    class="elevation-0 d-inline-flex"
                    style="vertical-align: middle"
                    :src="item.bank_logo"
                    max-height="16"
                    max-width="16"
                ></v-img>
                <span :class="use_props ? '' : 'ml-1'">{{ use_props ? item.prop_name : item.bank_name }}</span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <v-text-field
                v-model="amount"
                :label="$t('balance.amount')"
                :suffix="selectedPlatform.currency"
                v-mask="numberMask"
                :rules="[rules.required,amountRules]"
                @paste.prevent
            />
          </v-col>
        </v-row>
      </v-form>
    </div>

    <v-divider />

    <div class="common-dialog__actions d-flex pt-1">
      <v-spacer />
      <v-btn plain tile text small @click="back"> {{ $t('common.back') }} </v-btn>
      <v-spacer />
      <v-btn
          :loading="loading"
          :disabled="!amount || !pay_template_id || !formValid"
          color="primary"
          tile
          text
          plain
          small
          @click="next"
      >
        {{ $t('common.next') }}
      </v-btn>
      <v-spacer />
    </div>
  </div>
</template>

<script>
import BalanceFiatDialogAlert from '@/components/balance/fiat/dialog/parts/BalanceFiatDialogAlert.vue';
import BigNumber from 'bignumber.js';
import loadingMixin from '@/mixins/common/loadingMixin.js';
import validateInputMixin from '@/mixins/common/validateInputMixin.js';
import formValidationRules from '@/mixins/common/formValidationRules';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { mapState } from 'vuex';
export default {
  name: 'FillAmountStep',
  components: {
    BalanceFiatDialogAlert
  },
  mixins: [
    validateInputMixin,
    loadingMixin,
    formValidationRules
  ],
  props: {
    selectedPlatform: {
      type: Object,
      required: true,
    },
    currency_scale: {
      type: [String, Number],
      required: true,
    },
    pay_templates: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      numberMask: createNumberMask({
        prefix: '',
        includeThousandsSeparator: false,
        thousandsSeparatorSymbol: ' ',
        allowDecimal: true,
        decimalLimit: this.currency_scale,
        integerLimit: 23
      }),
      pay_template_id: null,
      amount: '',
      formValid: false,
      amountRules: v => !v || BigNumber(v).gte(this.selectedPlatform.minReplenish) || this.$t('balance.less_min'),
    };
  },
  computed: {
    ...mapState('app', ['product']),
    use_props() {
      return this.product.fiatReplenishUseProps
    },
    available_pay_templates() {
      return _.filter(this.pay_templates, item => {
        return (
            item.type	 === 'replenish' && item.is_active === true && item.gateway_id  === this.selectedPlatform.gateway_id && item.currency === this.selectedPlatform.currency
        );
      });
    },
  },
  methods: {
    next() {
      this.$emit('filled', {amount: this.amount, pay_template_id: this.pay_template_id});
    },
    back() {
      this.$emit('back_pressed');
    },
  }
};
</script>

<style scoped>

</style>