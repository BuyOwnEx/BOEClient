<template>
  <div>
    <div class="mb-6">
      <BalanceFiatDialogAlert>
        {{ $t('balance.dialog.fiat_withdrawal_alert') }}
      </BalanceFiatDialogAlert>

      <div class="balance-fiat-dialog-withdraw__withdraw-info">
        <div v-if="this.is_legal" class="py-2">
          <span v-if="selectedPlatform.currency ==='USD'">
            {{ $t('balance.dialog.fiat_usd_withdrawal_invoice_comp_fill_fields_step_description') }}
          </span>
          <span v-else>
            {{ $t('balance.dialog.fiat_withdrawal_invoice_comp_fill_fields_step_description') }}
          </span>
        </div>
        <div v-else class="py-2">
          <span v-if="selectedPlatform.currency ==='USD'">
            {{ $t('balance.dialog.fiat_usd_withdrawal_invoice_ind_fill_fields_step_description') }}
          </span>
          <span v-else>
            {{ $t('balance.dialog.fiat_withdrawal_invoice_ind_fill_fields_step_description') }}
          </span>
        </div>

        <CommonAvailable
            :available="currency_obj.safe"
            :currency="selectedPlatform.currency"
            :available-text="$t('balance.current_balance')"
            non-clickable
        />

        <CommonAvailable
            :available="selectedPlatform.minWithdraw"
            :currency="selectedPlatform.currency"
            :available-text="$t('balance.min_amount')"
            non-clickable
        />

        <CommonAvailable
            :available="currency_obj.maxWithdraw"
            :currency="selectedPlatform.currency"
            :available-text="$t('balance.max_amount')"
            :small-text="$t('balance.stepper.withdrawal_params.used_day_limit')"
            :small="currency_obj.daily"
            non-clickable
        />

        <CommonAvailable
            :available="getFee(selectedPlatform.gateway_id, selectedPlatform.currency)"
            :currency="selectedPlatform.currency"
            :available-text="$t('balance.fee')"
            non-clickable
        />

        <CommonAvailable
            :available="availableForWithdraw"
            :currency="selectedPlatform.currency"
            :available-text="$t('balance.stepper.withdrawal_params.available_for_withdraw')"
            non-clickable
        />
      </div>

      <v-form ref="form" v-model="formValid" lazy-validation v-if="selectedPlatform.currency !== 'USD'">
        <v-row>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <v-text-field
                v-model="amount"
                :label="$t('balance.amount')"
                :suffix="selectedPlatform.currency"
                v-mask="numberMask"
                :rules="amountRules"
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
      <v-form ref="form" v-model="formValid" lazy-validation v-else>
        <v-row>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <v-text-field
                v-model="amount"
                :label="$t('balance.amount')"
                :suffix="selectedPlatform.currency"
                v-mask="numberMask"
                :rules="amountRules"
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
          <v-col cols="12" md="12" class="pt-0 pb-0" style="display: none">
            <v-text-field
                v-model="bic"
                :label="$t('fiat.bic')"
                :rules="[rules.required, rules.bic]"
                v-mask="'#########'"
                persistent-hint
                @paste.prevent
            />
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0" style="display: none">
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
import CommonAvailable from '@/components/common/CommonAvailable.vue';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20]});
import loadingMixin from '@/mixins/common/loadingMixin.js';
import formValidationRules from '@/mixins/common/formValidationRules.js';
import validateInputMixin from '@/mixins/common/validateInputMixin.js';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
export default {
  name: 'FillFieldsWithdrawStep',
  components: {
    BalanceFiatDialogAlert,
    CommonAvailable
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
    currency_obj: {
      type: Object,
      required: true,
    },
    trader_status: {
      type: Number,
      required: true,
    },
    fees: {
      type: Array,
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
        decimalLimit: this.currency_obj.scale,
        integerLimit: 23
      }),
      selected_platform: this.selectedPlatform,
      amount: '',
      inn: null,
      bic: this.selectedPlatform.currency === 'USD' ? '000000000' : null,
      acc: this.selectedPlatform.currency === 'USD' ? '00000000000000000000' : null,
      formValid: false,
      gateways: [],
      amountRules:  [
        v => !!v || this.$t('forms_validation.required'),
        v => !v || BigNumber(v).gte(this.minWithdraw) || this.$t('balance.less_min'),
        v => !v || BigNumber(v).lte(this.maxWithdraw) || this.$t('balance.more_max'),
        v => !v || BigNumber(v).lte(this.currency_obj.safe) || this.$t('balance.more_available'),
        v => !v || BigNumber(v).lte(this.maxDailyAvailable) || this.$t('balance.more_withdraw_available')
      ]
    };
  },
  computed: {
    is_legal() {
      return (this.trader_status & 4) === 4;
    },
    is_individual() {
      return (this.trader_status & 2) === 2;
    },

    totalAmount() {
      const total = Number(this.amount) - this.selected_platform?.withdrawFee;
      if (!total || total < 0) return 0;
      return total;
    },
    safe() {
      return BigNumber(this.currency_obj.safe);
    },
    daily() {
      return BigNumber(this.currency_obj.daily);
    },
    minWithdraw() {
      return this.selected_platform?.minWithdraw;
    },
    maxWithdraw() {
      return this.currency_obj?.maxWithdraw;
    },
    maxDailyAvailable() {
      return BigNumber(this.maxWithdraw).minus(this.daily).toString();
    },
    availableForWithdraw() {
      return BigNumber.min(this.safe, this.maxDailyAvailable).toString();
    },
  },
  methods: {
    next() {
      this.$emit('filled', {amount: this.amount, inn: this.inn, bic: this.bic, acc: this.acc});
    },
    back() {
      this.$emit('back_pressed');
    },
    getFee(gateway_id, currency) {
      let gateway_fee = _.find(this.fees, item => (item.gateway_id === gateway_id && item.currency === currency));
      return this.getWithdrawFee(gateway_fee);
    },
    getWithdrawFee(fee) {
      let fix_part = '';
      let percent_part = '';
      if(!BigNumber(fee.bank_withdraw_fix_fee).eq(0) || !BigNumber(fee.withdraw_fix_fee).eq(0))
      {
        fix_part = BigNumber(fee.bank_withdraw_fix_fee).plus(fee.withdraw_fix_fee).toString() + ' ' + fee.currency;
      }
      if(!BigNumber(fee.bank_withdraw_percent_fee).eq(0) || !BigNumber(fee.withdraw_percent_fee).eq(0))
      {
        percent_part = BigNumber(fee.bank_withdraw_percent_fee).plus(fee.withdraw_percent_fee).toString() + '%';
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
  }
};
</script>

<style scoped>

</style>