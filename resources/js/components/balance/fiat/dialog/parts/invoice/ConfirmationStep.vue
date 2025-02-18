<template>
  <div>
    <v-card-text class="common-dialog__content pb-3 pt-0">
      <div class="balance-fiat-dialog-replenish__replenish-info pb-1">
        {{ $t('balance.dialog.fiat_invoice_confirm_step_description') }}
      </div>
      <div class="confirmation-item__info-wrapper">
        <div class="confirmation-item__info-key-wrapper">
          <div class="confirmation-item__header mr-auto">
            {{ $t('balance.select_bank') }}
          </div>
          <div class="confirmation-item__secret-key">
            <v-img
                class="elevation-0 d-inline-flex"
                style="vertical-align: middle"
                :src="getLogo(pay_template_id)"
                max-height="16"
                max-width="16"
            ></v-img>
            <span class="ml-1">{{ getName(pay_template_id) }}</span>
          </div>
        </div>
        <div class="confirmation-item__info-key-wrapper">
          <div class="confirmation-item__header mr-auto">
            {{ $t('common.amount') }}
          </div>
          <div class="confirmation-item__secret-key">{{ amount }} {{ selectedPlatform.currency }}</div>
        </div>

        <div class="confirmation-item__info-amount-wrapper mt-2">
          <div class="confirmation-item__header">
            {{ $t('fiat.deposited_with_fee') }} ({{ getFee(pay_template_id) }})
          </div>
          <div class="confirmation-item__amount-key green--text text--darken-2">{{ getAmountWithoutFee(amount, pay_template_id, selectedPlatform.currency) }}</div>
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
export default {
  name: 'ConfirmationStep',
  mixins: [
    loadingMixin
  ],
  props: {
    selectedPlatform: {
      type: Object,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    prop_id: {
      type: Number,
      required: true,
    },
    prop_type: {
      type: String,
      required: true,
    },
    pay_templates: {
      type: Array,
      required: true,
    },
    pay_template_id: {
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
  methods: {
    getLogo(pay_template_id) {
      return _.find(this.pay_templates, item => ( item.id === pay_template_id))?.bank_logo;
    },
    getName(pay_template_id) {
      return _.find(this.pay_templates, item => ( item.id === pay_template_id))?.bank_name;
    },
    getFee(pay_template_id) {
      let fee = _.find(this.pay_templates, item => (item.id === pay_template_id));
      return this.getReplenishFee(fee);
    },
    getReplenishFee(fee) {
      let fix_part = '';
      let percent_part = '';
      if(!BigNumber(fee.bank_fix_fee).eq(0) || !BigNumber(fee.fix_fee).eq(0))
      {
        fix_part = BigNumber(fee.bank_fix_fee).plus(fee.fix_fee).toString() + ' ' + fee.currency;
      }
      if(!BigNumber(fee.bank_percent_fee).eq(0) || !BigNumber(fee.percent_fee).eq(0))
      {
        percent_part = BigNumber(fee.bank_percent_fee).plus(fee.percent_fee).toString() + '%';
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
    getAmountWithoutFee(amount, pay_template_id, curr) {
      let fee = this.getAmountWithFee(amount, pay_template_id);
      return BigNumber(amount).minus(fee).toString() + " " + curr;
    },
    getAmountWithFee(amount, pay_template_id) {
      let fee = _.find(this.pay_templates, item => (item.id === pay_template_id));
      let fix_part = '';
      let percent_part = '';
      if(!BigNumber(fee.bank_fix_fee).eq(0) || !BigNumber(fee.fix_fee).eq(0))
      {
        fix_part = BigNumber(fee.bank_fix_fee).plus(fee.fix_fee);
      }
      if(!BigNumber(fee.bank_percent_fee).eq(0) || !BigNumber(fee.percent_fee).eq(0))
      {
        percent_part = BigNumber(fee.bank_percent_fee).plus(fee.percent_fee);
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
    finish() {
      axios.post('/trader/ext/notify_fiat_invoice_replenish', {
        amount: this.amount,
        pay_template_id: this.pay_template_id,
        prop_id: this.prop_id,
        prop_type: this.prop_type
      }).then(response => {
        if (response.data.success === true) {
          this.$emit('success_response');
        }
      });
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