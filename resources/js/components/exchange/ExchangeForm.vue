<template>
  <v-form v-model="valid" class="bordered" ref="exchange_form">
    <v-container>
      <v-row v-if="selected_is_suspended">
        <v-col cols="12" md="12" class="pt-1 pb-1">
          <suspended-alert></suspended-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12" class="pb-2">
          <v-select
              v-model="form.currency_out"
              :items="currency_out_list"
              item-text="currency_out"
              item-value="currency_out"
              :hint="$t('exchange.select_currency_out_hint')"
              :rules="[rules.required]"
              outlined
              prepend-icon="mdi-arrow-bottom-right-thick"
              hide-details
              required
              class="required"
              @change="setCurrencyIn"
          >
            <template #label>
              {{ $t('exchange.select_currency_out') }} <span class="red--text"><b>*</b></span>
            </template>
            <template #item="{item, on, attr}">
              <v-list-item v-bind="attr" v-on="on">
                <v-list-item-icon>
                  <v-img
                      class="elevation-0 d-inline-flex"
                      style="vertical-align: middle"
                      :src="'/'+item.currency_out_logo"
                      max-height="16"
                      max-width="16"
                  ></v-img>
                </v-list-item-icon>
                <v-list-item-content>
                  <div class="d-flex justify-space-between" style="width: 100%; font-size: 11px;">
                    <span class="align-self-center">{{ item.currency_out }}</span>
                    <span class="overline"> {{ $t('exchange.available') }}: {{ item.otc_main }}</span>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:selection="{item}">
              <div class="d-flex justify-space-between" style="width: 100%">
                <div>
                  <v-img
                      class="elevation-0 d-inline-flex vertical-middle"
                      :src="'/'+item.currency_out_logo"
                      max-height="16"
                      max-width="16"
                  ></v-img>
                  <span class="ml-1 vertical-middle">{{ item.currency_out }}</span>
                </div>
                <div class="align-self-center">
                  <span class="ml-2 overline"> {{ $t('exchange.available') }}: {{ item.otc_main }}</span>
                </div>
              </div>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="12" class="pt-2 pb-2">
          <v-select
              v-model="form.currency_in"
              :items="currency_in_list"
              item-text="currency_in"
              item-value="currency_in"
              :hint="$t('exchange.select_currency_in_hint')"
              :rules="[rules.required]"
              outlined
              prepend-icon="mdi-arrow-top-right-thick"
              hide-details
              required
              class="required"
              @change="setPair"
          >
            <template #label>
              {{ $t('exchange.select_currency_in') }} <span class="red--text"><b>*</b></span>
            </template>
            <template #item="{item, on, attr}">
              <v-list-item v-bind="attr" v-on="on">
                <v-list-item-icon>
                  <v-img
                      class="elevation-0 d-inline-flex"
                      style="vertical-align: middle"
                      :src="'/'+item.currency_in_logo"
                      max-height="16"
                      max-width="16"
                  ></v-img>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.currency_in"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-slot:selection="{item}">
              <v-img
                  class="elevation-0 d-inline-flex"
                  style="vertical-align: middle"
                  :src="'/'+item.currency_in_logo"
                  max-height="16"
                  max-width="16"
              ></v-img>
              <span class="ml-1">{{ item.currency_in }}</span>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="12" class="pt-2 pb-1">
          <v-text-field
              ref="exchange_amount"
              v-model="form.amount"
              :label="$t('exchange.amount')"
              :rules="[rules.required, rules.positive, localRules.lessAvailable]"
              :hint="$t('exchange.amount_hint')"
              :error-messages="errors.amount"
              :suffix="form.currency_out"
              persistent-hint
              required
              outlined
              @input="errors.amount = []"
              @keydown="validateNumber($event)"
          >
            <template #label>
              {{ $t('exchange.amount') }} <span class="red--text"><b>*</b></span>
            </template>
            <template v-slot:prepend>
              <v-img
                  v-if="selected_exchange_dir"
                  class="elevation-0 d-inline-flex"
                  style="vertical-align: middle"
                  :src="'/'+selected_exchange_currency_out_logo"
                  max-height="24"
                  max-width="24"
              ></v-img>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="12" class="pt-2 pb-0">
          <div class="d-flex justify-space-between">
            <v-text-field
                ref="exchange_rate"
                v-model="form.rate"
                :rules="is_calc_rate_available && !is_manual_rate ? [] : [rules.required, rules.positive]"
                :hint="rateHint"
                :error-messages="errors.rate"
                :suffix="is_reverse_depth ? form.currency_out : form.currency_in"
                :persistent-hint="!is_calc_rate_available || is_manual_rate"
                required
                outlined
                @input="errors.rate = []"
                :readonly="is_calc_rate_available && !is_manual_rate"
                :disabled="is_calc_rate_available && !is_manual_rate"
                @keydown="validateNumber($event)"
            >
              <template #label>
                {{ $t('exchange.rate',[is_reverse_depth ? form.currency_in : form.currency_out]) }} <span class="red--text"><b>*</b></span>
              </template>
              <template v-slot:prepend>
                <v-img
                    v-if="selected_exchange_dir"
                    class="elevation-0 d-inline-flex"
                    style="vertical-align: middle"
                    :src="rateLogo"
                    max-height="24"
                    max-width="24"
                ></v-img>
              </template>
            </v-text-field>
          </div>
        </v-col>
        <v-col cols="12" md="12" class="pt-1 pb-2" v-if="is_calc_rate_available">
          <v-checkbox
              v-model="is_manual_rate"
              :label="$t('exchange.set_rate')"
              :ripple="false"
              hide-details
              class="mt-0"
          >
          </v-checkbox>
        </v-col>
        <v-col cols="12" md="12" class="pt-2 pb-1">
          <div class="d-flex justify-space-between">
            <span class="overline align-self-center"> {{ $t('exchange.volume') }} </span>
            <span class="overline green--text text-no-wrap">
                      <item-with-logo
                          :cell_text="get_volume_text"
                          large_text
                          :logo="selected_exchange_currency_in_logo"
                          :size="24"
                          :tile="true"
                      ></item-with-logo>
                    </span>
          </div>
        </v-col>
        <v-col cols="12" md="12" class="pt-4 pb-1">
          <confirm-dialog
              :is-calc-rate="!is_manual_rate"
              :rate="form.rate"
              :amount="form.amount"
              :currency_in="form.currency_in"
              :currency_out="form.currency_out"
              :rate_per_one_currency="is_reverse_depth ? form.currency_in : form.currency_out"
              :rate_currency="is_reverse_depth ? form.currency_out : form.currency_in"
              :rate_currency_logo="is_reverse_depth ? selected_exchange_currency_out_logo : selected_exchange_currency_in_logo"
              :is_disabled="!valid || BigNumber(get_volume).eq(0) || selected_is_suspended"
              :currency_out_logo="selected_exchange_currency_out_logo"
              :currency_in_logo="selected_exchange_currency_in_logo"
              :volume="get_volume_text"
              @confirm="confirmExchange"
          >
            <v-btn
                block
                class="exchange_button"
                color="primary"
                :disabled="!valid || BigNumber(get_volume).eq(0) || selected_is_suspended"
            >
              {{ $t('exchange.exchange_action') }}
            </v-btn>
          </confirm-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import formValidationRules from '@/mixins/common/formValidationRules.js';
import showNotificationMixin from '@/mixins/common/showNotificationMixin.js';
import bignumber from '@/mixins/format/bignumber.js';

import ItemWithLogo from '@/components/common/ItemWithLogo.vue';
import ConfirmDialog from '@/components/exchange/ConfirmDialog.vue';
import SuspendedAlert from '@/components/exchange/SuspendedAlert.vue';
import thousands from '@/plugins/thousands.js';

export default {
  name: 'ExchangeForm',
  props: {
    exchange_dirs: {
      type: Array,
      required: true,
      default: () => []
    },
    init_currency_out: {
      type: String,
      required: true
    },
    init_currency_in: {
      type: String,
      required: true
    },
  },
  mixins: [formValidationRules, showNotificationMixin, bignumber],
  components: {
    ItemWithLogo,
    ConfirmDialog,
    SuspendedAlert
  },
  data() {
    return {
      form: {
        currency_out: this.init_currency_out.toUpperCase(),
        currency_in: this.init_currency_in.toUpperCase(),
        amount: 0,
        rate: 0,
        rate_type: null
      },
      errors: {
        amount: [],
        rate: []
      },
      localRules: {
        lessAvailable: v => !v || this.BigNumber(v).lte(this.available_balance) || this.$t('balance.more_available'),
      },
      is_manual_rate: false,
      valid: false,
    };
  },
  computed: {
    balances() {
      return this.$store.state.user.balances;
    },
    ask_list() {
      return this.$store.state.exchange.ask_list;
    },
    bid_list() {
      return this.$store.state.exchange.bid_list;
    },
    is_reverse_depth() {
      return this.$store.state.exchange.is_reverse_depth;
    },
    rateHint() {
      if(this.is_reverse_depth !== null)
        if(this.is_reverse_depth) return this.$t('exchange.rate_hint',[this.form.currency_in]);
        else return this.$t('exchange.rate_hint',[this.form.currency_out]);
      else return '';
    },
    rateLogo() {
      return this.is_reverse_depth ?  window.location.origin + '/'+this.selected_exchange_currency_out_logo : window.location.origin + '/'+this.selected_exchange_currency_in_logo
    },
    selected_exchange_dir() {
      return _.find(this.exchange_dirs, item => {return item.currency_out === this.form.currency_out && item.currency_in === this.form.currency_in} );
    },
    selected_is_suspended() {
      return this.selected_exchange_dir ? this.selected_exchange_dir.status === 'suspended' : false;
    },
    selected_exchange_currency_out_logo() {
      return this.selected_exchange_dir ? this.selected_exchange_dir.currency_out_logo : '';
    },
    selected_exchange_currency_in_logo() {
      return this.selected_exchange_dir ? this.selected_exchange_dir.currency_in_logo : '';
    },
    amountScale() {
      return this.selected_exchange_dir ? this.selected_exchange_dir.currency_out_scale : 2;
    },
    rateScale() {
      return this.selected_exchange_dir ? this.selected_exchange_dir.currency_in_scale : 2;
    },
    percentFee() {
      return this.selected_exchange_dir ? this.selected_exchange_dir.percent_fee : 0;
    },
    is_calc_rate_available() {
      return this.selected_exchange_dir ? this.selected_exchange_dir.calc_rate : false;
    },
    auto_rate() {
      if(this.is_calc_rate_available && !this.is_manual_rate)
      {
        if(!this.is_reverse_depth) {
          let real_rate = 0;
          let rest_amount = this.form.amount;
          let accumulated_volume = 0;
          if(this.bid_list)
          {
            for (let i = 0; i < this.bid_list.length; i++)
            {
              if(this.BigNumber(this.bid_list[i].volume).gte(rest_amount))
              {
                accumulated_volume = this.BigNumber(accumulated_volume).plus(this.BigNumber(rest_amount).times(this.bid_list[i].price)).toString();
                rest_amount = 0;
                break;
              }
              else
              {
                accumulated_volume = this.BigNumber(accumulated_volume).plus(this.BigNumber(this.bid_list[i].volume).multipliedBy(this.bid_list[i].price)).toString();
                rest_amount = this.BigNumber(rest_amount).minus(this.bid_list[i].volume).toString();
              }
            }
            if(!this.BigNumber(rest_amount).eq(0))
            {
              accumulated_volume = this.BigNumber(accumulated_volume).plus(this.BigNumber(rest_amount).times(this.bid_list[this.bid_list.length-1].price)).toString();
              rest_amount = 0;
            }
            if(this.BigNumber(accumulated_volume).gt(0))
            {
              real_rate = this.BigNumber(accumulated_volume).div(this.form.amount).toString();
              return this.BigNumber(this.BigNumber(100).minus(this.percentFee).toString()).multipliedBy(real_rate).div(100).dp(this.rateScale, 1).toString();
            }
            else
            {
              real_rate = this.bid_list[0].price;
              return this.BigNumber(this.BigNumber(100).minus(this.percentFee).toString()).multipliedBy(real_rate).div(100).dp(this.rateScale, 1).toString();
            }
          }
        }
        else
        {
          let real_rate = 0;
          let rest_volume = this.form.amount;
          let accumulated_amount = 0;
          if(this.ask_list)
          {
            for (let i = 0; i < this.ask_list.length; i++)
            {
              if(this.BigNumber(this.ask_list[i].volume).multipliedBy(this.ask_list[i].price).lt(rest_volume))
              {
                accumulated_amount = this.BigNumber(this.ask_list[i].volume).plus(accumulated_amount).toString();
                rest_volume = this.BigNumber(rest_volume).minus(this.BigNumber(this.ask_list[i].volume).multipliedBy(this.ask_list[i].price));
              }
              else
              {
                accumulated_amount = this.BigNumber(accumulated_amount).plus(this.BigNumber(rest_volume).div(this.ask_list[i].price)).toString();
                rest_volume = 0;
                break;
              }
            }
            if(!this.BigNumber(rest_volume).eq(0))
            {
              accumulated_amount = this.BigNumber(accumulated_amount).plus(this.BigNumber(rest_volume).div(this.ask_list[this.ask_list.length-1].price)).toString();
              rest_volume = 0;
            }
            if(this.BigNumber(accumulated_amount).gt(0))
            {
              real_rate = this.BigNumber(this.form.amount).div(accumulated_amount).toString();
              return this.BigNumber(this.BigNumber(100).plus(this.percentFee).toString()).multipliedBy(real_rate).div(100).dp(this.amountScale, 1).toString();
            }
            else
            {
              real_rate = this.ask_list[0].price;
              return this.BigNumber(this.BigNumber(100).plus(this.percentFee).toString()).multipliedBy(real_rate).div(100).dp(this.amountScale, 1).toString();
            }
          }
        }
      }
    },
    get_volume() {
      let x = this.form.amount === '' || this.form.amount === null ? 0 : this.form.amount
      let y = this.form.rate === '' || this.form.rate === null ? 0 : this.form.rate;
      if(!this.is_reverse_depth)
      {
        let vol = this.BigNumber(x).times(this.BigNumber(y));
        if(vol.eq(0))
          return vol.toFixed(2);
        else
          return this.BigNumber(x).times(this.BigNumber(y)).toFixed(this.rateScale,1)
      }
      else
      {
        if(this.BigNumber(y).eq(0) || this.BigNumber(x).eq(0))
          return this.BigNumber(0).toFixed(2);
        else
        {
          return this.BigNumber(x).div(this.BigNumber(y)).toFixed(this.rateScale,1)
        }
      }
    },
    get_volume_text() {
      return thousands(this.BigNumber(this.get_volume).toString(), ' ')
    },
    unique_currency_out_list() {
      return _.uniqBy(this.exchange_dirs, item => item.currency_out);
    },
    currency_out_list() {
      return this.unique_currency_out_list.map(obj => {
        let balance = _.get(this.balances, obj.currency_out.toUpperCase(), 0);
        return _.set(_.pick(obj, ['currency_out','currency_out_logo','state']), 'otc_main', balance.otc_main ? balance.otc_main : 0);
      });
    },
    available_balance() {
      let index = _.findIndex(this.currency_out_list, item => item.currency_out === this.form.currency_out);
      return index > -1 ? this.currency_out_list[index].otc_main : 0;
    },
    currency_in_list() {
      return _.filter(this.exchange_dirs, item => item.currency_out === this.form.currency_out).map(obj => {
        return _.pick(obj, ['currency_in','currency_in_logo','state']);
      });
    },
  },
  watch: {
    'form.amount'(newAmount, oldAmount) {
      if (this.isNumeric(newAmount) || newAmount === '') {
        let rl = new RegExp('\\d+\\.\\d{' + (this.amountScale + 1) + ',}', 'i');
        if (rl.test(newAmount) || newAmount.length > 20) {
          this.form.amount = oldAmount;
          this.$refs.exchange_amount.lazyValue = oldAmount;
        } else if (newAmount === '' || newAmount === 0) {
          this.form.amount = newAmount;
        } else {
          this.form.amount = newAmount;
        }
      } else {
        this.form.amount = 0;
      }
    },
    'form.rate'(newVal, oldVal) {
      if (this.isNumeric(newVal) || newVal === '') {
        let scale = this.is_reverse_depth ? (this.amountScale + 1) : (this.rateScale + 1);
        let rl = new RegExp('\\d+\\.\\d{' + scale + ',}', 'i');
        if (rl.test(newVal) || newVal.length > 20) {
          this.form.rate = oldVal;
          this.$refs.exchange_rate.lazyValue = oldVal;
        } else if (newVal === '' || newVal === 0) {
          this.form.rate = newVal;
        } else {
          this.form.rate = newVal;
        }
      } else {
        this.form.rate = 0;
      }
    },
    auto_rate(newVal, oldVal) {
      if(this.is_calc_rate_available && !this.is_manual_rate) this.form.rate = newVal;
    },
  },
  methods: {
    setCurrencyIn() {
      this.form.currency_in = this.currency_in_list[0].currency_in;
      this.$store.commit('exchange/setPair', {
        currency_out: this.form.currency_out,
        currency_in: this.form.currency_in,
      });
      this.$refs.exchange_form.validate();
    },
    setPair() {
      this.$store.commit('exchange/setPair', {
        currency_out: this.form.currency_out,
        currency_in: this.form.currency_in,
      });
    },
    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    validateNumber(evt) {
      evt = evt ? evt : window.event;
      let charCode = evt.which ? evt.which : evt.keyCode;
      if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          (charCode < 96 || charCode > 105) &&
          charCode !== 46 &&
          charCode !== 35 &&
          charCode !== 36 &&
          charCode !== 37 &&
          charCode !== 39 &&
          evt.key !== '.'
      ) {
        evt.preventDefault();
      }
      else {
        return true;
      }
    },
    confirmExchange() {
      if (!this.form.amount || !this.form.rate) {
        this.pushErrorNotification(_, 'incorrect');
        return;
      }
      this.form.rate = this.BigNumber(this.form.rate).toString();
      this.form.amount = this.BigNumber(this.form.amount).toString();
      this.form.rate_type = this.is_calc_rate_available && !this.is_manual_rate ? 'calc' : 'fixed';
      axios.post('/trader/ext/otc/exchange_request/add', this.form).then(response => {
        if (response.data.success === true) {
          console.log(response.data);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.exchange_button {
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
}
</style>