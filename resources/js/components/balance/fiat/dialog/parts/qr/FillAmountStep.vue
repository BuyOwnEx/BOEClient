<template>
  <div>
    <div class="mb-6">
      <BalanceFiatDialogAlert>
        {{ $t('balance.dialog.fiat_replenishment_alert') }}
      </BalanceFiatDialogAlert>

      <div class="balance-fiat-dialog-replenish__replenish-info pt-2">
        {{ $t('balance.dialog.fiat_bank_details_replenishment_description') }}
      </div>

      <v-form v-model="amountFormValid">
        <v-text-field
            v-model="amount"
            :placeholder="$t('balance.amount')"
            :suffix="selectedPlatform.currency"
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
      <v-btn plain tile text small @click="back"> {{ $t('common.back') }} </v-btn>
      <v-spacer />
      <v-btn
          :loading="loading"
          :disabled="!amount || !amountFormValid"
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
export default {
  name: 'FillAmountStep',
  components: {
    BalanceFiatDialogAlert
  },
  mixins: [
    validateInputMixin,
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
  },
  data() {
    return {
      amount: '',
      amountFormValid: false,
      gateways: [],
      fees: [],
      amountRules: [
        v => !v || BigNumber(v).gte(this.selectedPlatform.minReplenish) || this.$t('balance.less_min'),
        v => !v || this.isCorrectPrecision(v) || this.$t('forms_validation.unsupported_precision'),
      ],
    };
  },
  methods: {
    next() {
      this.$emit('filled', this.amount);
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