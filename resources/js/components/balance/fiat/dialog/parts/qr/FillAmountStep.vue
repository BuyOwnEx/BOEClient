<template>
  <div>
    <div class="mb-6">
      <BalanceFiatDialogAlert>
        {{ $t('balance.dialog.fiat_replenishment_alert') }}
      </BalanceFiatDialogAlert>

      <div class="balance-fiat-dialog-replenish__replenish-info pt-2 mb-3">
        {{ $t('balance.dialog.fiat_qr_amount_step_description') }}
      </div>

      <v-form v-model="formValid">
        <v-row>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <v-select
                v-model="bank_id"
                :items="available_banks"
                item-text="name"
                item-value="id"
                :label="$t('balance.select_bank')"
                :hint="$t('balance.select_bank_hint')"
                :rules="[rules.required]"
                autofocus
                persistent-hint
                hide-details="auto"
                required
                class="required"
            >
              <template #item="{item, on, attr}">
                <v-list-item v-bind="attr" v-on="on">
                  <v-list-item-icon>
                    <v-img
                        class="elevation-0 d-inline-flex"
                        style="vertical-align: middle"
                        :src="item.logo"
                        max-height="16"
                        max-width="16"
                    ></v-img>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="{item}">
                <v-img
                    class="elevation-0 d-inline-flex"
                    style="vertical-align: middle"
                    :src="item.logo"
                    max-height="16"
                    max-width="16"
                ></v-img>
                <span class="ml-1">{{ item.name }}</span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <v-text-field
                v-model="amount"
                :placeholder="$t('balance.amount')"
                :suffix="selectedPlatform.currency"
                :rules="amountRules"
                @keydown="validateNumber"
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
          :disabled="!amount || !bank_id || !formValid"
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
import loadingMixin from '@/mixins/common/loadingMixin.js';
import validateInputMixin from '@/mixins/common/validateInputMixin.js';
import formValidationRules from '@/mixins/common/formValidationRules';
export default {
  name: 'FillAmountStep',
  components: {
    BalanceFiatDialogAlert
  },
  mixins: [
    validateInputMixin,
    loadingMixin,
    formValidationRules
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
    fees: {
      type: Array,
      required: true,
    },
    bank_details: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      amount: '',
      bank_id: null,
      formValid: false,
      gateways: [],
      banks: [],
      amountRules: [
        v => !v || BigNumber(v).gte(this.selectedPlatform.minReplenish) || this.$t('balance.less_min'),
        v => !v || this.isCorrectPrecision(v) || this.$t('forms_validation.unsupported_precision'),
      ],
    };
  },
  mounted() {
    axios.get('/trader/ext/all_banks').then(response => {
      this.banks = response.data.data;
      this.bank_id = this.available_banks[0].id ?? null;
    });
  },
  computed: {
    available_banks() {
      return _.filter(this.banks, item => {
        let find_detail = _.findIndex(this.bank_details, (detail) => {
          return detail.bank_id === item.id && detail.gateway_id === this.selectedPlatform.gateway_id && detail.is_active === true
        });
        let find_fee = _.findIndex(this.fees, (fee) => {
          return fee.bank_id === item.id && fee.gateway_id === this.selectedPlatform.gateway_id && fee.currency === this.selectedPlatform.currency
        });
        return find_detail !== -1 && find_fee !== -1;
      });
    },
  },
  methods: {
    next() {
      this.$emit('filled', {amount: this.amount, bank_id: this.bank_id});
    },
    back() {
      this.$emit('back_pressed');
    },
    isCorrectPrecision(v) {
      return !new RegExp('\\d+\\.\\d{' + (this.currency_scale + 1) + ',}', 'i').test(v);
    },
  }
};
</script>

<style scoped>

</style>