<template>
  <v-dialog v-model="dialog" width="800" :persistent="step === 3">
    <template #activator="{ on, attrs }">
      <v-btn color="success" :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-bind="attrs" v-on="on" small tile>
        <v-icon left small>mdi-plus</v-icon>
        {{ $t('user.props.dialog.add.title') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="common-dialog__title common-dialog__title--success">
        {{ $t('user.props.dialog.add.title') }}
      </v-card-title>
      <v-card-text class="common-dialog__content pa-0">
        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">
              {{ $t('user.props.steps.beneficiary') }}
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="step > 2" step="2">
              {{ use_intermediary ? $t('user.props.steps.beneficiary_and_intermediary_bank') : $t('user.props.steps.beneficiary_bank') }}
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="step > 3" step="3">
              {{ $t('common.confirmation') }}
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <div class="dialog-alert mb-4">
                {{ $t('user.props.dialog.alert') }}
              </div>
              <v-form v-model="valid_beneficiary" ref="beneficiary_form">
                <v-row class="mb-2 mt-1">
                  <v-col cols="12" md="12" class="pt-0 pb-0">
                    <v-text-field
                        v-model="form.name"
                        counter="64"
                        :label="$t('user.props.dialog.add.name')"
                        :rules="[rules.required, rules.max64char, rules.propName]"
                        :hint="$t('user.props.dialog.add.name_hint')"
                        :error-messages="errors.name"
                        persistent-hint
                        clearable
                        required
                        outlined
                        autofocus
                        @input="errors.name = []"
                    >
                      <template #label>
                        {{ $t('user.props.dialog.add.name') }} <span class="red--text"><b>*</b></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" class="pt-0 pb-0 mt-2">
                    <v-select
                        v-model="form.currency"
                        :items="currencies"
                        :label="$t('user.props.dialog.add.currency')"
                        :hint="$t('user.props.dialog.add.currency_hint')"
                        :rules="[rules.required]"
                        @input="errors.currency = []"
                        item-text="currency"
                        item-value="currency"
                        hide-details="auto"
                        persistent-hint
                        clearable
                        required
                        dense
                    >
                      <template #label>
                        {{ $t('user.props.dialog.add.currency') }} <span class="red--text"><b>*</b></span>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12" class="pt-0 pb-0">
                    <fieldset class="pa-2 pt-0">
                      <legend class="pr-1 pl-1 mt-1">
                        {{ $t('user.props.legends.beneficiary') }}
                      </legend>
                      <v-text-field
                          class="mt-2"
                          v-model="form.beneficiary_acc_iban"
                          :rules="[rules.required, rules.beneficiary_acc_iban]"
                          @input="errors.beneficiary_acc_iban = []"
                          :hint="$t('user.props.dialog.add.beneficiary_acc_iban_hint')"
                          persistent-hint
                          clearable
                          required
                          dense
                      >
                        <template #label>
                          {{ $t('user.props.dialog.add.beneficiary_acc_iban') }} <span class="red--text"><b>*</b></span>
                        </template>
                      </v-text-field>
                      <v-text-field
                          class="mt-2"
                          v-model="form.beneficiary_name"
                          :rules="[rules.required, rules.beneficiary_name]"
                          @input="errors.beneficiary_name = []"
                          :label="$t('user.props.dialog.add.beneficiary_name')"
                          :hint="$t('user.props.dialog.add.beneficiary_name_hint')"
                          persistent-hint
                          clearable
                          required
                          dense
                      >
                        <template #label>
                          {{ $t('user.props.dialog.add.beneficiary_name') }} <span class="red--text"><b>*</b></span>
                        </template>
                      </v-text-field>
                      <v-text-field
                          class="mt-2"
                          v-model="form.beneficiary_address"
                          :rules="[rules.required, rules.beneficiary_address]"
                          @input="errors.beneficiary_name = []"
                          :label="$t('user.props.dialog.add.beneficiary_address')"
                          :hint="$t('user.props.dialog.add.beneficiary_address_hint')"
                          persistent-hint
                          clearable
                          required
                          dense
                      >
                        <template #label>
                          {{ $t('user.props.dialog.add.beneficiary_address') }} <span class="red--text"><b>*</b></span>
                        </template>
                      </v-text-field>
                    </fieldset>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12" class="pt-0 pb-0 mt-2" v-if="check_inn">
                    <v-text-field
                        v-model="form.inn"
                        :rules="taxNoRules"
                        v-mask="tax_id_mask"
                        :hint="getTaxIDHint"
                        persistent-hint
                        required
                        dense
                    >
                      <template #label>
                        {{ $t('fiat.inn') }} <span class="red--text"><b>*</b></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" class="pt-0 pb-0 mt-2" v-if="check_kpp">
                    <v-text-field
                        v-model="form.kpp"
                        :rules="[rules.required, rules.comp_kpp]"
                        v-mask="'#########'"
                        :hint="$t('user.props.dialog.add.kpp_hint')"
                        persistent-hint
                        required
                        dense
                    >
                      <template #label>
                        {{ $t('fiat.kpp') }} <span class="red--text"><b>*</b></span>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12" class="pt-0 pb-0 mt-2 mb-2">
                    <v-checkbox
                        v-model="use_intermediary"
                        :label="$t('user.props.dialog.add.use_intermediary')"
                        hide-details
                        dense
                        :ripple="false"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-form>
              <v-divider />
              <v-card-actions class="common-dialog__actions">
                <v-spacer />
                <v-btn small tile text plain @click="close">
                  {{ $t('common.close') }}
                </v-btn>
                <v-spacer />
                <v-btn :loading="loading" :disabled="!valid_beneficiary" color="primary" small tile text plain @click="step++">
                  {{ $t('common.continue') }}
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="2">
              <div class="dialog-alert mb-2">
                {{ $t('user.props.dialog.alert') }}
              </div>
              <v-form v-model="valid_beneficiary_bank" ref="beneficiary_bank_form">
                <v-row>
                  <v-col cols="12" md="12" class="pt-0 pb-0">
                    <fieldset class="pa-2 pt-0">
                      <legend class="pr-1 pl-1 mt-1">
                        {{ $t('user.props.legends.beneficiary_bank') }}
                      </legend>
                      <v-text-field
                          class="mt-2"
                          v-model="form.beneficiary_bank_swift"
                          :rules="[rules.required, rules.bank_swift]"
                          @input="errors.beneficiary_bank_swift = []"
                          :hint="$t('user.props.dialog.add.beneficiary_bank_hint')"
                          persistent-hint
                          clearable
                          required
                          dense
                      >
                        <template #label>
                          {{ $t('user.props.dialog.add.beneficiary_bank') }} <span class="red--text"><b>*</b></span>
                        </template>
                      </v-text-field>
                      <v-text-field
                          v-if="use_intermediary"
                          class="mt-2"
                          v-model="form.intermediary_bank_acc_iban"
                          :rules="[rules.required, rules.beneficiary_acc_iban]"
                          @input="errors.intermediary_bank_acc_iban = []"
                          :hint="$t('user.props.dialog.add.intermediary_acc_iban_hint')"
                          persistent-hint
                          clearable
                          required
                          dense
                      >
                        <template #label>
                          {{ $t('user.props.dialog.add.intermediary_acc_iban') }} <span class="red--text"><b>*</b></span>
                        </template>
                      </v-text-field>
                    </fieldset>
                  </v-col>
                </v-row>
                <v-row v-if="use_intermediary">
                  <v-col cols="12" md="12" class="pt-0 pb-0">
                    <fieldset class="pa-2 pt-0">
                      <legend class="pr-1 pl-1 mt-1">
                        {{ $t('user.props.legends.intermediary_bank') }}
                      </legend>
                      <v-text-field
                          class="mt-2"
                          v-model="form.intermediary_bank_swift"
                          :rules="use_intermediary ? [rules.required, rules.bank_swift]: []"
                          @input="errors.intermediary_bank_swift = []"
                          :hint="$t('user.props.dialog.add.intermediary_bank_hint')"
                          persistent-hint
                          clearable
                          required
                          dense
                      >
                        <template #label>
                          {{ $t('user.props.dialog.add.intermediary_bank') }} <span class="red--text"><b>*</b></span>
                        </template>
                      </v-text-field>
                    </fieldset>
                  </v-col>
                </v-row>
              </v-form>
              <v-divider />
              <v-card-actions class="common-dialog__actions">
                <v-spacer />
                <v-btn small tile text plain @click="close">
                  {{ $t('common.close') }}
                </v-btn>
                <v-spacer />
                <v-btn small tile text plain @click="back">
                  {{ $t('common.back') }}
                </v-btn>
                <v-spacer />
                <v-btn :loading="loading" :disabled="!valid_beneficiary || !valid_beneficiary_bank" color="primary" small tile text plain @click="sendConfirmation">
                  {{ $t('common.continue') }}
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="3">
              <div>
                <span v-if="twoFa"> {{ this.$t('confirmation.confirm_with_2fa_description') }} </span>
                <span v-else> {{ this.$t('confirmation.confirm_without_2fa_description') }} </span>
              </div>
              <v-form class="mb-2" v-model="valid_confirm" ref="confirm_form">
                <v-text-field
                    v-model="emailCode"
                    :rules="[rules.required]"
                    :hint="$t('user.code_hint')"
                    :placeholder="$t('user.code')"
                    persistent-hint
                    validate-on-blur
                />
                <v-otp-input
                    v-if="twoFa"
                    v-model="twoFaCode"
                    length="6"
                    type="number"
                    :hint="$t('user.two_fa_code_hint')"
                    :label="$t('user.two_fa_code_hint')"
                    :rules="[rules.required]"
                    @keydown="validate2FA"
                    @finish="handleCodeInput"
                    class="mt-2"
                ></v-otp-input>
                <div v-if="twoFa" class="v-messages" :class="{ 'theme--dark': $vuetify.theme.dark }">
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message">
                      {{$t('user.two_fa_code_hint')}}
                    </div>
                  </div>
                </div>
              </v-form>

              <v-divider />

              <div class="common-dialog__actions d-flex pt-1 pb-1">
                <v-spacer />
                <v-btn plain tile text small @click="back">
                  {{ $t('common.back') }}
                </v-btn>
                <v-spacer />
                <v-btn
                    :disabled="!emailCode || (!twoFaCode && twoFa)"
                    :loading="loading"
                    color="success"
                    tile
                    text
                    plain
                    small
                    @click="confirmAddSwiftProps"
                >
                  {{ $t('common.confirm') }}
                </v-btn>
                <v-spacer />
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import CommonCopyLabel from '@/components/common/CommonCopyLabel.vue';
import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';
import validateInputMixin from '@/mixins/common/validateInputMixin.js';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'Add',
  props: {
    twoFa: {
      type: Boolean,
      required: true,
    },
    trader_status: {
      type: Number,
      required: true,
    },
  },
  components: { CommonCopyLabel },
  mixins: [formValidationRules, loadingMixin, showNotificationMixin, dialogMethodsMixin, validateInputMixin],
  data() {
    return {
      step: 1,
      valid_beneficiary: false,
      valid_beneficiary_bank: false,
      valid_confirm: false,
      emailCode: '',
      twoFaCode: '',
      use_intermediary: false,
      form: {
        name: null,
        currency: null,
        beneficiary_name: null,
        beneficiary_address: null,
        beneficiary_acc_iban: null,
        beneficiary_bank_swift: null,
        intermediary_bank_swift: null,
        intermediary_bank_acc_iban: null,
        inn: null,
        kpp: null
      },
      errors: {
        name: [],
        currency: [],
        beneficiary_name: [],
        beneficiary_address: [],
        beneficiary_acc_iban: [],
        beneficiary_bank_swift: [],
        intermediary_bank_swift: [],
        intermediary_bank_acc_iban: [],
        inn: [],
        kpp: []
      }
    };
  },
  computed: {
    ...mapState('trading', ['all_currencies','allCurrencyListInit']),
    ...mapState('user', ['verifyResidentCountry','verifyType']),
    emptyName() {
      return !this.form.name?.trim();
    },
    is_legal() {
      return (this.trader_status & 4) === 4;
    },
    is_resident() {
      return (this.trader_status & 32) === 32;
    },
    currencies() {
      return this.allCurrencyListInit ? _.filter(this.all_currencies,item => item.type === 'fiat') : []
    },
    check_inn() {
      return (!(this.verifyType === 'sumsub' && !this.is_legal));
    },
    check_kpp() {
      return (this.verifyType === 'kontur' && this.is_legal && this.isRU);
    },
    isRU() {
      return this.verifyResidentCountry === 'RU';
    },
    isKG() {
      return this.verifyResidentCountry === 'KG';
    },
    taxNoRules() {
      if(this.isRU)
      {
        if(this.is_legal) return [this.rules.required, this.rules.comp_ip_inn];
        else return [this.rules.required, this.rules.ind_inn];
      }
      else if(this.isKG) return [this.rules.required, this.rules.comp_inn_kg];
      else return [this.rules.required, this.rules.min8char, this.rules.max40char];
    },
    tax_id_mask() {
      if(this.isRU)
        if(this.is_legal) return '##########';
        else return '############';
      else if(this.isKG) return '##############';
      else return null;
    },
    getTaxIDHint() {
      if(this.isRU)
      {
        if(this.is_legal) return this.$t('user.props.dialog.add.comp_inn_hint');
        else return this.$t('user.props.dialog.add.ind_inn_hint');
      }
      else if(this.isKG) return this.$t('user.props.dialog.add.inn_kg_hint');
      else return this.$t('user.props.dialog.add.inn_hint');
    }
  },
  methods: {
    ...mapActions({
      formAddSwiftPropsRequestStore: 'user/formAddSwiftPropsRequest',
      formAddSwiftPropsConfirmStore: 'user/formAddSwiftPropsConfirm',
    }),
    async sendConfirmation() {
      if (!this.valid_beneficiary && !this.valid_beneficiary_bank) return;
      try {
        this.startLoading();
        await this.formAddSwiftPropsRequestStore(this.form);
        this.step++;
      } finally {
        this.stopLoading();
      }
    },
    handleCodeInput(value) {
      if (value.length === 6 && this.emailCode) this.confirmAddSwiftProps();
    },
    async confirmAddSwiftProps() {
      if (!this.valid_confirm) return;

      try {
        this.startLoading();

        const payload = {
          code_email: this.emailCode,
          totp: this.twoFa ? this.twoFaCode : null,
        };
        const success = await this.formAddSwiftPropsConfirmStore(payload);
        if (success) {
          await this.$store.dispatch('user/getSwiftPropsFromServer');
        }

        this.close();
      } finally {
        this.clearData();
        this.stopLoading();
      }
    },
    clearData() {
      this.step = 1;
      this.$refs.beneficiary_form.reset();
      this.$refs.beneficiary_bank_form.reset();
      this.$refs.confirm_form.reset();
    },
    close() {
      this.dialog = false;
    },
    back() {
      this.step--;
    },
  },
};
</script>

<style lang="sass" scoped>
.dialog-alert
  color: white
  background-color: #ff7365d6
  padding: 8px 16px

::v-deep.v-otp-input .v-input
  flex: 0 1 8px
  &__control
    width: 30px
    .v-input__slot
      min-height: 24px
</style>