<template>
  <div>
    <div class="mb-6">
      <BalanceFiatDialogAlert>
        {{ $t('balance.dialog.fiat_replenishment_alert') }}
      </BalanceFiatDialogAlert>

      <div class="balance-fiat-dialog-replenish__replenish-info pt-2 mb-2">
        {{ use_props ? $t('balance.dialog.fiat_invoice_fill_fields_step_with_prop_description') : $t('balance.dialog.fiat_invoice_fill_fields_step_description') }}
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
          :disabled="!pay_template_id ||!amount || !prop_id || !formValid"
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
import { mapState } from 'vuex';
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
    },
    pay_templates: {
      type: Array,
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
        decimalLimit: this.currency_scale,
        integerLimit: 23
      }),
      pay_template_id: null,
      amount: '',
      prop_id: null,
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
            item.type	 === 'replenish' &&
            item.is_active === true &&
            item.gateway_id  === this.selectedPlatform.gateway_id &&
            item.currency === this.selectedPlatform.currency
        );
      });
    },
    selected_prop_type() {
      let ind = _.findIndex(this.pay_templates, item => item.id === this.pay_template_id);
      return ind > -1 ? this.pay_templates[ind].prop_type : null;
    },
    available_props() {
      if(this.selected_prop_type === 'ufebs')
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
      else if(this.selected_prop_type === 'kg_props')
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
      else if(this.selected_prop_type === 'swift')
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
  },
  mounted() {

  },
  methods: {
    next() {
      this.$emit('filled', {
        pay_template_id: this.pay_template_id,
        amount: this.amount,
        prop_id: this.prop_id,
        prop_type: this.selected_prop_type
      });
    },
    back() {
      this.$emit('back_pressed');
    },
  }
};
</script>

<style scoped>

</style>