<template>
  <div>
    <v-card-text class="common-dialog__content pb-3 pt-0">
      <div class="balance-fiat-dialog-replenish__replenish-info pb-3">
        {{ $t('balance.dialog.fiat_qr_confirm_step_description') }}
      </div>
      <div class="text-center">
        <QrCode v-if="this.details !== null" :value="qr_replenish" :options="{ width: 200 }" />
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
    bank_details: {
      type: Array,
      required: true,
    },
    bank_id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      platform: this.selectedPlatform
    };
  },
  computed: {
    minReplenish() {
      return this.selectedPlatfrom?.minReplenish;
    },
    currency() {
      return this.selectedPlatfrom?.currency;
    },
    details() {
      let find_detail = _.findIndex(this.bank_details, (detail) => {
        return detail.bank_id === this.bank_id && detail.gateway_id === this.selectedPlatform.gateway_id && detail.is_active === true
      });
      return this.bank_details[find_detail];
    },
    qr_replenish() {
      return this.details ?
          'ST00012|Name='+this.details.name+
          '|PersonalAcc='+this.details.personal_acc+
          '|BankName='+this.details.bank_name+
          '|BIC='+this.details.bic+
          '|CorrespAcc='+this.details.corr_acc+
          '|KPP='+this.details.kpp+
          '|PayeeINN='+this.details.inn+
          '|Purpose='+this.details.purpose.replace('%trader_id%', this.$user.id).replace('%email_verified_at%', new Date(this.$user.email_verified_at).toLocaleDateString())+
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
    finish() {
      axios.post('/trader/ext/notify_fiat_qr_replenish', {
        currency: this.platform.currency,
        amount: this.amount,
        gateway_id: this.platform.gateway_id,
        bank_id: this.bank_id
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