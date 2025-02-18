<template>
  <div>
    <v-card-text class="common-dialog__content pb-3 pt-0">
      <div class="d-flex justify-space-between">
        <div class="balance-fiat-dialog-replenish__replenish-info pr-3 pl-1 d-flex flex-column justify-space-between">
          <div>{{ $t('balance.dialog.fiat_qr_confirm_step_description') }}</div>
          <div>
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
              <div class="confirmation-item__secret-key">{{ amount }} {{ details.currency }}</div>
            </div>

            <div class="confirmation-item__info-amount-wrapper mt-2">
              <div class="confirmation-item__header">
                {{ $t('fiat.deposited_with_fee') }} ({{ getFee(pay_template_id) }})
              </div>
              <div class="confirmation-item__amount-key green--text text--darken-2">{{ getAmountWithoutFee(amount, pay_template_id, details.currency) }}</div>
            </div>
          </div>
        </div>
        <div class="text-center pr-3 pl-3">
          <QrCode v-if="this.details !== null" :value="qr_replenish" :options="{ width: 200 }" />
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
        {{ $t('fiat.paid') }}
      </v-btn>
      <v-spacer />
    </div>
  </div>
</template>

<script>
import QrCode from '@chenfengyuan/vue-qrcode';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import loadingMixin from '@/mixins/common/loadingMixin.js';
import { mapState } from 'vuex';

export default {
  name: 'ShowQr',
  components: {
    QrCode
  },
  mixins: [
    loadingMixin
  ],
  props: {
    amount: {
      type: String,
      required: true,
    },
    qr_bank_details: {
      type: Object,
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
  },
  computed: {
    ...mapState('user', ['verifyEntity']),
    details() {
      let find_index = _.findIndex(this.pay_templates, (item) => {
        return item.id === this.pay_template_id
      });
      return this.pay_templates[find_index];
    },
    purpose_text() {
      if(this.qr_bank_details.ext_purpose)
        return this.qr_bank_details.ext_purpose
            .replace('%trader_id%', this.$user.id)
            .replace('%fio%', this.verifyEntity)
            .replace('%company_name%', this.verifyEntity)
            .replace('%email_verified_at%', new Date(this.$user.email_verified_at).toLocaleDateString())
      else
        return this.details.purpose
            .replace('%trader_id%', this.$user.id)
            .replace('%fio%', this.verifyEntity)
            .replace('%company_name%', this.verifyEntity)
            .replace('%email_verified_at%', new Date(this.$user.email_verified_at).toLocaleDateString())
    },
    qr_replenish() {
      return this.details ?
          'ST00012|Name='+this.details.org_name+
          '|PersonalAcc='+this.qr_bank_details.acc+
          '|BankName='+this.qr_bank_details.bank_name+
          '|BIC='+this.qr_bank_details.bic+
          '|CorrespAcc='+this.qr_bank_details.corr_acc+
          '|KPP='+this.details.kpp+
          '|PayeeINN='+this.details.inn+
          '|Purpose='+this.purpose_text+
          '|Sum='+BigNumber(this.amount).multipliedBy(100).toString()
          : '';
    },
  },
  mounted() {

  },
  methods: {
    next() {
      this.$emit('qr_paid');
    },
    back() {
      this.$emit('back_pressed');
    },
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
    finish() {
      axios.post('/trader/ext/notify_fiat_qr_replenish', {
        amount: this.amount,
        pay_template_id: this.pay_template_id
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
  &__header
    padding-top: 1px

  &__amount-key
    font-size: 1.1rem
    font-weight: bold
    margin-top: 3px

  &__info-key-wrapper
    display: flex
</style>