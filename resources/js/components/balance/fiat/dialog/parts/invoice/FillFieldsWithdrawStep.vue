<template>
  <div>
    <div class="mb-6">
      <BalanceFiatDialogAlert>
        {{ $t('balance.dialog.fiat_withdrawal_alert') }}
      </BalanceFiatDialogAlert>

      <div class="balance-fiat-dialog-withdraw__withdraw-info">
        <div class="py-2">
          <span>{{ $t('balance.dialog.fiat_withdrawal_invoice_fill_fields_step_description') }}</span>
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
            :available="getFee(pay_template_id)"
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

      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-row>
          <v-col cols="12" md="12" class="pt-0 pb-2" v-if="selectedPlatform.currency === 'KGS'">
            <v-select
                v-model="selected_prop_type"
                :items="available_pay_templates"
                :item-text="(item) => { return $t('fiat.prop_types.'+item.prop_type)}"
                item-value="prop_type"
                :label="$t('balance.select_sender_prop')"
                :hint="$t('balance.select_sender_prop_hint')"
                :rules="[rules.required]"
                autofocus
                persistent-hint
                hide-details="auto"
                required
                class="required"
            >
              <template #item="{item, on, attr}">
                <v-list-item v-bind="attr" v-on="on">
                  <v-list-item-content>
                    <v-list-item-title v-text="$t('fiat.prop_types.'+item.prop_type)"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="{item}">
                <span>{{ $t('fiat.prop_types.'+item.prop_type) }}</span>
              </template>
            </v-select>
          </v-col>

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
            <v-select
                v-model="prop_id"
                :items="available_props"
                item-text="name"
                item-value="id"
                :label="$t('balance.select_prop')"
                :hint="$t('balance.select_prop_hint')"
                :rules="[rules.required]"
                persistent-hint
                hide-details="auto"
                required
                class="required"
            >
            </v-select>
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
          :disabled="!pay_template_id || !amount || !prop_id || !formValid"
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
import { mapState } from 'vuex';
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
    pay_templates: {
      type: Array,
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
      selected_prop_type: null,
      amount: '',
      prop_id: null,
      formValid: false,
      amountRules:  [
        v => !!v || this.$t('forms_validation.required'),
        v => !v || BigNumber(v).gte(this.minWithdraw) || this.$t('balance.less_min'),
        v => !v || BigNumber(v).lte(this.maxWithdraw) || this.$t('balance.more_max'),
        v => !v || BigNumber(v).lte(this.currency_obj.safe) || this.$t('balance.more_available'),
        v => !v || BigNumber(v).lte(this.maxDailyAvailable) || this.$t('balance.more_withdraw_available')
      ],
    };
  },
  computed: {
    available_pay_templates() {
      return _.filter(this.pay_templates, item => {
        return (
            item.type	 === 'withdraw' &&
            item.is_active === true &&
            item.gateway_id  === this.selectedPlatform.gateway_id &&
            item.currency === this.selectedPlatform.currency
        );
      });
    },
    selected_pay_template() {
      if(this.selectedPlatform.currency === 'KGS' && this.available_pay_templates.length > 1)
      {
        return _.find(this.pay_templates, item => {
          return (
              item.type	 === 'withdraw' &&
              item.is_active === true &&
              item.gateway_id  === this.selectedPlatform.gateway_id &&
              item.currency === this.selectedPlatform.currency &&
              item.prop_type === this.selected_prop_type
          );
        });
      }
      else
      {
        return this.available_pay_templates[0];
      }
    },
    pay_template_id() {
      return this.selected_pay_template?.id
    },
    pay_template_prop_type() {
      return this.selected_pay_template?.prop_type
    },
    available_props() {
      if(this.pay_template_prop_type === 'ufebs')
      {
        let props = _.filter(this.rub_props, item => {
          return (
              item.state === 'RP_CONFIRMED'
          );
        });
        if(props.length > 0) this.prop_id = props[0].id
        else this.prop_id = null
        return props;
      }
      else if(this.pay_template_prop_type === 'kg_props')
      {
        let props = _.filter(this.kgs_props, item => {
          return (
              item.state === 'KP_CONFIRMED'
          );
        });
        if(props.length > 0) this.prop_id = props[0].id
        else this.prop_id = null
        return props;
      }
      else if(this.pay_template_prop_type === 'swift')
      {
        let props = _.filter(this.swift_props, item => {
          return (
              item.currency === this.selectedPlatform.currency &&
              item.state === 'SP_CONFIRMED'
          );
        });
        if(props.length > 0) this.prop_id = props[0].id
        else this.prop_id = null
        return props;
      }
      else {
        this.prop_id = null;
        return [];
      }
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
      this.$emit('filled', {
        pay_template_id: this.pay_template_id,
        amount: this.amount,
        prop_id: this.prop_id,
        prop_type: this.pay_template_prop_type
      });
    },
    back() {
      this.$emit('back_pressed');
    },
    getFee(pay_template_id) {
      if(pay_template_id)
      {
        let template = _.find(this.pay_templates, item => (item.id === pay_template_id));
        return this.getWithdrawFee(template);
      }
      else return '-';
    },
    getWithdrawFee(fee) {
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
        if(fee.fee_type === 'OR') return percent_part + '; ' + this.$t('common.min') + ' ' + fix_part;
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