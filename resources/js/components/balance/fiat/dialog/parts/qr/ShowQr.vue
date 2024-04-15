<template>
  <div>
    <v-card-text class="common-dialog__content pb-3 pt-0">
      <div class="balance-fiat-dialog-replenish__replenish-info pb-3">
        {{ $t('balance.dialog.fiat_qr_confirm_step_description') }}
      </div>
      <div class="text-center">
        <QrCode v-if="this.bank_details !== null" :value="qr_replenish" :options="{ width: 200 }" />
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

export default {
  name: 'ShowQr',
  components: {
    QrCode
  },
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
  },
  data() {
    return {
      bank_details: null,
      platform: this.selectedPlatform,
      d_amount: this.amount
    };
  },
  computed: {
    minReplenish() {
      return this.selectedPlatfrom?.minReplenish;
    },
    currency() {
      return this.selectedPlatfrom?.currency;
    },
    qr_replenish() {
      return this.bank_details ?
          'ST00012|Name='+this.bank_details.name+
          '|PersonalAcc='+this.bank_details.personal_acc+
          '|BankName='+this.bank_details.bank_name+
          '|BIC='+this.bank_details.bic+
          '|CorrespAcc='+this.bank_details.corr_acc+
          '|KPP='+this.bank_details.kpp+
          '|PayeeINN='+this.bank_details.payee_inn+
          '|Purpose='+this.bank_details.purpose.replace('%trader_id%', this.$user.id).replace('%email_verified_at%', new Date(this.$user.email_verified_at).toLocaleDateString())+
          '|Sum='+BigNumber(this.amount).multipliedBy(100).toString()
          : '';
    },
  },
  mounted() {
    axios.get('/trader/ext/replenish_bank_details').then(response => {
      this.bank_details = response.data.data;
    });
  },
  methods: {
    next() {
      this.$emit('qr_paid');
    },
    back() {
      this.$emit('back_pressed');
    },
    finish() {
      axios.post('/trader/ext/notify_fiat_qr_replenish', {
        currency: this.platform.currency,
        amount: this.d_amount,
        gateway_id: this.platform.gateway_id
      }).then(response => {
        if (response.data.success === true) {
          this.$emit('success_response');
        }
      });
    },
  }
};
</script>

<style scoped>

</style>