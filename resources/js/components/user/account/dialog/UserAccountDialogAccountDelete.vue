<template>
  <v-dialog v-model="dialog" width="600" :persistent="step === 2">
    <template #activator="{ on, attrs }">
      <v-btn color="error" class="mb-2" v-bind="attrs" v-on="on">
        <v-icon left small>mdi-account-remove</v-icon>
        {{ $t('common.delete') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="common-dialog__title common-dialog__title--error">
        {{ $t('user.info.account_delete_subtitle') }}
      </v-card-title>

      <v-card-text class="common-dialog__content pb-1 pt-0">
        <v-stepper v-model="step">
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
              <span class="red--text">{{ $t('common.attention') }}! {{ $t('user.info.account_delete_description') }}</span>

              <v-divider class="mt-4" />

              <div class="common-dialog__actions d-flex pt-1">
                <v-spacer />
                <v-btn plain tile text small @click="close">
                  {{ $t('common.cancel') }}
                </v-btn>
                <v-spacer />
                <v-btn
                    :loading="loading"
                    :disabled="loading"
                    color="error"
                    tile
                    text
                    plain
                    small
                    @click="sendEmailConfirmation"
                >
                  {{ $t('common.continue') }}
                </v-btn>
                <v-spacer />
              </div>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-form class="mb-2" v-model="isValidConfirmForm">
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

              <div class="common-dialog__actions d-flex pt-1">
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
                    @click="confirmAccountDelete"
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
import loadingMixin from '@/mixins/common/loadingMixin.js';
import showNotificationMixin from '@/mixins/common/showNotificationMixin.js';
import validateInputMixin from '@/mixins/common/validateInputMixin.js';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin.js';
import formValidationRules from '@/mixins/common/formValidationRules.js';
import { mapActions } from 'vuex';
export default {
  name: 'UserAccountDialogAccountDelete',
  props: {
    twoFa: {
      type: Boolean,
      required: true,
    },
  },
  mixins: [loadingMixin, showNotificationMixin, validateInputMixin, dialogMethodsMixin, formValidationRules],
  data() {
    return {
      emailCode: '',
      twoFaCode: '',
      isValidRequestForm: false,
      isValidConfirmForm: false,
      step: 1,
    };
  },
  mounted() {
    this.debouncedLogout = _.debounce(this.formLogout, 3000);
  },
  methods: {
    ...mapActions({
      formAccountDeleteRequestStore: 'user/formAccountDeleteRequest',
      formAccountDeleteConfirmStore: 'user/formAccountDeleteConfirm',
      formLogout: 'user/logout',
    }),
    async sendEmailConfirmation() {
      try {
        this.startLoading();
        await this.formAccountDeleteRequestStore();
        this.step++;
      } finally {
        this.stopLoading();
      }
    },
    async confirmAccountDelete() {
      if (!this.isValidConfirmForm) return;

      try {
        this.startLoading();

        const payload = {
          code_email: this.emailCode,
          totp: this.twoFa ? this.twoFaCode : null,
        };
        const success = await this.formAccountDeleteConfirmStore(payload);
        if (success) {
          this.pushSuccessNotification(this.$t('user.info.account_deleted'));
          this.debouncedLogout();
        }
        this.close();
      } finally {
        this.stopLoading();
      }
    },

    handleCodeInput(value) {
      if (value.length === 6 && this.emailCode) this.confirmAccountDelete();
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

<style scoped>

</style>