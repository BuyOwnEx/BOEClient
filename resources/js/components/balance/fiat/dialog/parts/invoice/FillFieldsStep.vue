<template>
  <div>
    <div class="mb-6">
      <BalanceFiatDialogAlert>
        {{ $t('balance.dialog.fiat_replenishment_alert') }}
      </BalanceFiatDialogAlert>

      <div v-if="this.is_legal" class="balance-fiat-dialog-replenish__replenish-info pt-2">
        {{ $t('balance.dialog.fiat_invoice_comp_fill_fields_step_description') }}
      </div>
      <div v-else class="balance-fiat-dialog-replenish__replenish-info pt-2">
        {{ $t('balance.dialog.fiat_invoice_ind_fill_fields_step_description') }}
      </div>

      <v-form v-model="formValid">
        <v-row>
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
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <v-text-field
                v-model="inn"
                :label="$t('fiat.inn')"
                :rules="[rules.required, this.is_legal ? rules.comp_inn : rules.ind_inn]"
                v-mask="this.is_legal ? '##########' : '############'"
                persistent-hint
                @paste.prevent
            />
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <v-text-field
                v-model="bic"
                :label="$t('fiat.bic')"
                :rules="[rules.required, rules.bic]"
                v-mask="'#########'"
                persistent-hint
                @paste.prevent
            />
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <v-text-field
                v-model="acc"
                :label="$t('fiat.acc')"
                :rules="[rules.required, rules.acc]"
                v-mask="'####################'"
                persistent-hint
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
          :disabled="!amount || !inn || !bic || !acc || !formValid"
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
BigNumber.config({ EXPONENTIAL_AT: [-15, 20]});
import loadingMixin from '@/mixins/common/loadingMixin.js';
import formValidationRules from '@/mixins/common/formValidationRules.js';
import validateInputMixin from '@/mixins/common/validateInputMixin.js';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
export default {
  name: 'FillFieldsStep',
  components: {
    BalanceFiatDialogAlert
  },
  mixins: [
    validateInputMixin,
    formValidationRules,
    loadingMixin
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
    trader_status: {
      type: Number,
      required: true,
    }
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
      amount: '',
      inn: null,
      bic: null,
      acc: null,
      formValid: false,
      gateways: [],
      fees: [],
      amountRules: v => !v || BigNumber(v).gte(this.selectedPlatform.minReplenish) || this.$t('balance.less_min'),
    };
  },
  computed: {
    is_legal() {
      return (this.trader_status & 4) === 4;
    },
    is_individual() {
      return (this.trader_status & 2) === 2;
    },
  },
  methods: {
    next() {
      this.$emit('filled', {amount: this.amount, inn: this.inn, bic: this.bic, acc: this.acc});
    },
    back() {
      this.$emit('back_pressed');
    },
    isCorrectPrecision(v) {
      return !new RegExp('\\d+\\.\\d{' + (this.currency_scale + 1) + ',}', 'i').test(v);
    },
  }
};
</script>

<style scoped>

</style>