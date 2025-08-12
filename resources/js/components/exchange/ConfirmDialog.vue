<template>
  <ExtendedDialog
      confirm-color="success"
      header-color="success"
      :close-text="close_text"
      :confirm-text="confirm_text"
      @confirm="confirm"
      @closed="reset"
      :disabled="!isLogged || (isLogged && (!verifyStatus && !isNonKYCTradingAvailable))"
      :is_disabled="is_disabled"
      :is-closable="is_exchange_success"
  >
    <template #default>
      <slot></slot>
    </template>

    <template #title>
      {{ is_exchange_success ? $t('exchange.request_success') : $t('exchange.confirm') }}
    </template>

    <template #content>
      <div v-if="!isLogged" class="mt-2 mb-2">
        <span class="red--text"><b>{{ $t('trading.forms.must_login') }}</b></span>
      </div>
      <div v-else-if="isLogged && (!verifyStatus && !isNonKYCTradingAvailable)" class="mt-2 mb-2">
        <span class="red--text"><b>{{ $t('trading.forms.must_kyc') }}</b></span>
      </div>
      <div v-else>
        <span v-if="!is_exchange_success" class="py-2">{{ $t('exchange.confirm_text') }}</span>
        <div class="mt-2 d-flex justify-space-between">
          <span class="overline"> {{ $t('exchange.select_currency_out') }} </span>
          <span class="text-no-wrap">
            <item-with-logo
                :cell_text="amount_text"
                :logo="currency_out_logo"
                :size="16"
                :tile="true"
            ></item-with-logo>
          </span>
        </div>
        <div class="mt-1 d-flex justify-space-between">
          <span class="overline"> {{ $t('exchange.select_currency_in') }} </span>
          <span class="text-no-wrap">
            <item-with-logo
                :cell_text="volume + ' ' + currency_in"
                :logo="currency_in_logo"
                :size="16"
                :tile="true"
            ></item-with-logo>
          </span>
        </div>
        <div class="mt-1 mb-2 d-flex justify-space-between">
          <span class="overline"> {{ $t('exchange.rate',[rate_per_one_currency]) }} </span>
          <span class="text-no-wrap">
            <item-with-logo
                :cell_text="rate_text"
                :logo="rate_currency_logo"
                :size="16"
                :tile="true"
            ></item-with-logo>
          </span>
        </div>
        <div v-if="is_exchange_success" class="mt-1 mb-2 d-flex justify-space-between">
          <span class="overline"> {{ $t('exchange.req_id') }} </span>
          <span class="text-no-wrap green--text">
            #{{ req_id }}
          </span>
        </div>
        <span v-if="!is_exchange_success" class="py-2 error--text">{{ $t('exchange.confirm_text_finally') }}</span>
      </div>
    </template>
  </ExtendedDialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import bignumber from '@/mixins/format/bignumber.js';
import ExtendedDialog from '@/components/common/ExtendedDialog.vue';
import ItemWithLogo from '@/components/common/ItemWithLogo.vue';
import thousands from '@/plugins/thousands.js';
export default {
  name: 'ConfirmDialog',
  components: { ExtendedDialog, ItemWithLogo },
  mixins: [bignumber],
  props: {
    currency_out: {
      type: String,
      required: true,
    },
    currency_in: {
      type: String,
      required: true,
    },
    currency_out_logo: {
      type: String,
      required: true,
    },
    currency_in_logo: {
      type: String,
      required: true,
    },
    rate_per_one_currency: {
      type: String,
      required: true,
    },
    rate_currency: {
      type: String,
      required: true,
    },
    rate_currency_logo: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      required: true,
    },
    amount: {
      type: [Number, String],
      required: true,
    },
    rate: {
      type: [Number, String],
      required: true,
    },
    isCalcRate: {
      type: Boolean,
      required: true,
    },
    is_disabled: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      is_exchange_success: false,
      req_id: null
    };
  },
  computed: {
    ...mapGetters({
      isLogged: 'app/isLogged',
    }),
    ...mapState('user', ['verifyStatus']),
    isNonKYCTradingAvailable() {
      return import.meta.env.VITE_TRADING_WITHOUT_KYC === 'true';
    },
    amount_text() {
      return thousands(this.amount,' ') + ' ' + this.currency_out;
    },
    rate_text() {
      return thousands(this.rate,' ') + ' ' + this.rate_currency;
    },
    close_text() {
      return this.is_exchange_success ? this.$t('exchange.repeat_exchange') : this.$t('common.cancel');
    },
    confirm_text() {
      return this.is_exchange_success ? this.$t('exchange.navigate_exchange_list') : this.$t('common.confirm');
    },
  },
  methods: {
    reset() {
      this.is_exchange_success = false;
      this.req_id = null;
    },
    confirm() {
      if(this.is_exchange_success) {
        this.is_exchange_success = false;
        this.req_id = null;
        this.$router.push({ name: 'exchange_history'});
      }
      else
      {
        if (!this.amount || !this.rate) {
          this.pushErrorNotification(_, 'incorrect');
          return;
        }
        axios.post('/trader/ext/otc/exchange_request/add', {
          currency_out: this.currency_out,
          currency_in: this.currency_in,
          amount: this.BigNumber(this.amount).toString(),
          rate: this.BigNumber(this.rate).toString(),
          rate_type: this.isCalcRate ? 'calc' : 'fixed'
        }).then(response => {
          if (response.data.success === true) {
            console.log(response.data);
            this.is_exchange_success = true;
            this.req_id = response.data.req_id;
          }
        });
      }
    },
  },
};
</script>

<style scoped>

</style>