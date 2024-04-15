<template>
  <div>
    <v-card-text class="common-dialog__content pb-3 pt-0">
      <div class="balance-fiat-dialog-replenish__replenish-info pb-3">
        {{ $t('balance.dialog.fiat_invoice_confirm_step_description') }}
      </div>
      <div class="confirmation-item__info-wrapper">
        <div class="confirmation-item__info-key-wrapper">
          <div class="confirmation-item__header mr-auto">
            {{ $t('common.amount') }}
          </div>
          <div class="confirmation-item__secret-key">{{ amount }} {{ selectedPlatform.currency }}</div>
        </div>

        <div class="confirmation-item__info-key-wrapper">
          <div class="confirmation-item__header mr-auto">
            {{ $t('fiat.inn') }}
          </div>
          <div class="confirmation-item__secret-key">{{ inn }}</div>
        </div>

        <div class="confirmation-item__info-key-wrapper">
          <div class="confirmation-item__header mr-auto">
            {{ $t('fiat.bic') }}
          </div>
          <div class="confirmation-item__secret-key">{{ bic }}</div>
        </div>

        <div class="confirmation-item__info-key-wrapper">
          <div class="confirmation-item__header mr-auto">
            {{ $t('fiat.acc') }}
          </div>
          <div class="confirmation-item__secret-key">{{ acc }}</div>
        </div>

        <div class="confirmation-item__info-amount-wrapper mt-2">
          <div class="confirmation-item__header">
            {{ $t('fiat.deposited_with_fee') }} ({{ getFee(selectedPlatform.gateway_id, selectedPlatform.currency) }})
          </div>
          <div class="confirmation-item__amount-key green--text text--darken-2">{{ getAmountWithoutFee(amount, selectedPlatform.gateway_id, selectedPlatform.currency) }}</div>
        </div>
      </div>
    </v-card-text>

    <v-divider />

    <div class="common-dialog__actions d-flex pt-1">
      <v-spacer />
      <v-btn plain tile text small @click="back"> {{ $t('common.back') }} </v-btn>
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
        {{ $t('common.confirm') }}
      </v-btn>
      <v-spacer />
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import loadingMixin from '@/mixins/common/loadingMixin.js';
import { mapActions } from 'vuex';
export default {
  name: 'ConfirmationWithdrawStep',
  mixins: [
    loadingMixin
  ],
  props: {
    selectedPlatform: {
      type: Object,
      required: true,
    },
    fees: {
      type: Array,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    inn: {
      type: String,
      required: true,
    },
    bic: {
      type: String,
      required: true,
    },
    acc: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      platform: this.selectedPlatform,
      d_amount: this.amount,
      d_inn: this.inn,
      d_bic: this.bic,
      d_acc: this.acc
    };
  },
  computed: {
    minReplenish() {
      return this.selectedPlatfrom?.minReplenish;
    },
    currency() {
      return this.selectedPlatfrom?.currency;
    },
  },
  mounted() {

  },
  methods: {
    ...mapActions({
      formFiatWithdrawRequestStore: 'balance/formFiatWithdrawRequest',
    }),
    getFee(gateway_id, currency) {
      let gateway_fee = _.find(this.fees, item => (item.gateway_id === gateway_id && item.currency === currency));
      return this.getReplenishFee(gateway_fee);
    },
    getReplenishFee(fee) {
      let fix_part = '';
      let percent_part = '';
      if(!BigNumber(fee.bank_replenish_fix_fee).eq(0) || !BigNumber(fee.replenish_fix_fee).eq(0))
      {
        fix_part = BigNumber(fee.bank_replenish_fix_fee).plus(fee.replenish_fix_fee).toString() + ' ' + fee.currency;
      }
      if(!BigNumber(fee.bank_replenish_percent_fee).eq(0) || !BigNumber(fee.replenish_percent_fee).eq(0))
      {
        percent_part = BigNumber(fee.bank_replenish_percent_fee).plus(fee.replenish_percent_fee).toString() + '%';
      }
      if(fix_part !== '' && percent_part !== '')
      {
        if(fee.type === 'OR') return percent_part + '; ' + this.$t('common.min') + ' ' + fix_part;
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
    getAmountWithoutFee(amount, gateway_id, curr) {
      let fee = this.getAmountWithFee(amount, gateway_id, curr);
      return BigNumber(amount).minus(fee).toString() + " " + curr;
    },
    getAmountWithFee(amount, gateway_id, curr) {
      let fee = _.find(this.fees, item => (item.gateway_id === gateway_id && item.currency === curr));
      let fix_part = '';
      let percent_part = '';
      if(!BigNumber(fee.bank_replenish_fix_fee).eq(0) || !BigNumber(fee.replenish_fix_fee).eq(0))
      {
        fix_part = BigNumber(fee.bank_replenish_fix_fee).plus(fee.replenish_fix_fee);
      }
      if(!BigNumber(fee.bank_replenish_percent_fee).eq(0) || !BigNumber(fee.replenish_percent_fee).eq(0))
      {
        percent_part = BigNumber(fee.bank_replenish_percent_fee).plus(fee.replenish_percent_fee);
      }
      if(fix_part !== '' && percent_part !== '')
      {
        if(fee.type === 'OR') return  BigNumber(amount).times(percent_part).div(100).dp(2,4).gt(fix_part) ? BigNumber(amount).times(percent_part).div(100).dp(2,4).toString() : fix_part.toString();
        else return BigNumber(BigNumber(amount).times(percent_part).div(100).dp(2,4)).plus(fix_part).toString();
      }
      else if(fix_part === '' && percent_part === '')
      {
        return '0';
      }
      else
      {
        if(fix_part !== '') return fix_part.toString();
        if(percent_part !== '') return BigNumber(amount).times(percent_part).div(100).dp(2,4).toString();
      }
    },
    back() {
      this.$emit('back_pressed');
    },
    async finish() {
      const payload = {
        currency: this.platform.currency,
        amount: this.d_amount,
        inn: this.d_inn,
        bic: this.d_bic,
        acc: this.d_acc,
        gateway_id: this.platform.gateway_id
      };
      const isSuccess = await this.formFiatWithdrawRequestStore(payload);

      if (isSuccess) {
        this.$emit('success_response');
      }
    },
  }
};
</script>

<style lang="sass" scoped>
.confirmation-item
  &__title
    flex-wrap: nowrap
    white-space: nowrap
    justify-content: space-between
  &__header
    padding-top: 1px
  &__name
    text-overflow: ellipsis
    overflow: hidden
  &__amount-key
    font-size: 1.1rem
    font-weight: bold
    margin-top: 3px

  &__info-wrapper
    display: flex
    flex-direction: column
    overflow: hidden
    width: 50%

  &__info-key-wrapper
    display: flex
</style>