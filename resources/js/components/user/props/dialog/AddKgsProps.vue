<template>
  <v-dialog v-model="dialog" width="600" :persistent="step === 2">
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
              {{ $t('user.props.steps.kgs_props') }}
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="step > 2" step="2">
              {{ $t('common.confirmation') }}
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <div class="dialog-alert mb-4">
                {{ $t('user.props.dialog.alert') }}
              </div>
              <v-form v-model="valid" ref="props_form">
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
                    <v-text-field
                        v-model="form.bic"
                        :rules="[rules.required, rules.bic_kg]"
                        v-mask="'######'"
                        :hint="$t('user.props.dialog.add.bic_kg_hint')"
                        persistent-hint
                        required
                        dense
                    >
                      <template #label>
                        {{ $t('fiat.bic') }} <span class="red--text"><b>*</b></span>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" class="pt-0 pb-0 mt-2">
                    <v-text-field
                        v-model="form.acc"
                        :rules="[rules.required, rules.acc_kg]"
                        v-mask="'################'"
                        :hint="$t('user.props.dialog.add.acc_kg_hint')"
                        persistent-hint
                        required
                        dense
                    >
                      <template #label>
                        {{ $t('fiat.acc') }} <span class="red--text"><b>*</b></span>
                      </template>
                    </v-text-field>
                  </v-col>
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
              </v-form>
              <v-divider />
              <v-card-actions class="common-dialog__actions">
                <v-spacer />
                <v-btn small tile text plain @click="close">
                  {{ $t('common.close') }}
                </v-btn>
                <v-spacer />
                <v-btn :loading="loading" :disabled="!valid" color="primary" small tile text plain @click="sendConfirmation">
                  {{ $t('common.continue') }}
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="2">
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
                    @click="confirmAddKgsProps"
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
  name: 'AddKgsProps',
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
      valid: false,
      valid_confirm: false,
      emailCode: '',
      twoFaCode: '',
      form: {
        name: null,
        bic: null,
        acc: null,
        inn: null,
        kpp: null
      },
      errors: {
        name: [],
        bic: [],
        acc: [],
        inn: [],
        kpp: []
      }
    };
  },
  computed: {
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
      formAddKgsPropsRequestStore: 'user/formAddKgsPropsRequest',
      formAddKgsPropsConfirmStore: 'user/formAddKgsPropsConfirm',
    }),
    async sendConfirmation() {
      if (!this.valid) return;
      try {
        this.startLoading();
        await this.formAddKgsPropsRequestStore(this.form);
        this.step++;
      } finally {
        this.stopLoading();
      }
    },
    handleCodeInput(value) {
      if (value.length === 6 && this.emailCode) this.confirmAddKgsProps();
    },
    async confirmAddKgsProps() {
      if (!this.valid_confirm) return;

      try {
        this.startLoading();

        const payload = {
          code_email: this.emailCode,
          totp: this.twoFa ? this.twoFaCode : null,
        };
        const success = await this.formAddKgsPropsConfirmStore(payload);
        if (success) {
          await this.$store.dispatch('user/getKgsPropsFromServer');
        }

        this.close();
      } finally {
        this.stopLoading();
      }
    },
    clearData() {
      this.step = 1;
      this.$refs.props_form.reset();
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