<template>
  <v-dialog v-model="dialog" width="600" :persistent="step === 2">
    <template #activator="{ on, attrs }">
      <v-btn
          icon
          plain
          v-bind="attrs" v-on="on"
      >
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="common-dialog__title common-dialog__title--error">
        {{ $t('user.props.dialog.delete.title') }}
      </v-card-title>
      <v-card-text class="common-dialog__content pa-0">
        <div v-if="!twoFa">
          <div class="pa-2 red--text text-center">
            {{ this.$t('user.disabled_alert.two_fa') }}
          </div>
          <v-divider />
          <v-card-actions class="common-dialog__actions">
            <v-spacer />
            <v-btn small tile text plain @click="close">
              {{ $t('common.close') }}
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </div>
        <v-stepper v-model="step" v-else>
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">
              {{ $t('common.request') }}
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="step > 2" step="2">
              {{ $t('common.confirmation') }}
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <div class="mb-3">
                <span> {{ this.$t('user.props.dialog.delete.description') }} </span>
              </div>
              <v-divider />
              <v-card-actions class="common-dialog__actions">
                <v-spacer />
                <v-btn small tile text plain @click="close">
                  {{ $t('common.close') }}
                </v-btn>
                <v-spacer />
                <v-btn :loading="loading" color="error" small tile text plain @click="sendConfirmation">
                  {{ $t('common.delete') }}
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="2">
              <div>
                {{ this.$t('confirmation.confirm_with_2fa_description') }}
              </div>
              <v-form class="mb-2" v-model="valid_confirm">
                <v-text-field
                    v-model="emailCode"
                    :rules="[rules.required]"
                    :hint="$t('user.code_hint')"
                    :placeholder="$t('user.code')"
                    persistent-hint
                    validate-on-blur
                />
                <v-otp-input
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
                <div class="v-messages" :class="{ 'theme--dark': $vuetify.theme.dark }">
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
                    color="error"
                    tile
                    text
                    plain
                    small
                    @click="confirmDeleteKgsProps"
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
import formValidationRules from '@/mixins/common/formValidationRules';
import loadingMixin from '@/mixins/common/loadingMixin';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';
import validateInputMixin from '@/mixins/common/validateInputMixin.js';
import { mapActions } from 'vuex';
export default {
  name: 'DeleteKgsProps',
  props: {
    twoFa: {
      type: Boolean,
      required: true,
    },
    kgs_props: {
      type: Object,
      required: true
    },
  },
  mixins: [formValidationRules, loadingMixin, showNotificationMixin, dialogMethodsMixin, validateInputMixin],
  data() {
    return {
      step: 1,
      valid_confirm: false,
      emailCode: '',
      twoFaCode: '',
      form: {
        prop_id: this.kgs_props.id
      },
      errors: {

      }
    };
  },
  methods: {
    ...mapActions({
      formDeleteKgsPropsRequestStore: 'user/formDeleteKgsPropsRequest',
      formDeleteKgsPropsConfirmStore: 'user/formDeleteKgsPropsConfirm',
    }),
    async sendConfirmation() {
      try {
        this.startLoading();
        await this.formDeleteKgsPropsRequestStore(this.form);
        this.step++;
      } finally {
        this.stopLoading();
      }
    },
    handleCodeInput(value) {
      if (value.length === 6 && this.emailCode) this.confirmDeleteKgsProps();
    },
    async confirmDeleteKgsProps() {
      if (!this.valid_confirm) return;
      try {
        this.startLoading();
        const payload = {
          code_email: this.emailCode,
          totp: this.twoFa ? this.twoFaCode : null,
        };
        const success = await this.formDeleteKgsPropsConfirmStore(payload);
        if (success) {
          await this.$store.dispatch('user/getKgsPropsFromServer');
        }
        this.close();
      } finally {
        this.stopLoading();
      }
    },
    clearData() {
      this.emailCode = '';
      this.twoFaCode = '';
      this.step = 1;
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
::v-deep.v-otp-input .v-input
  flex: 0 1 8px
  &__control
    width: 30px
    .v-input__slot
      min-height: 24px
</style>