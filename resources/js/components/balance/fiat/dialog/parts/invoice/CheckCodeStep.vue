<template>
  <div>
    <v-card-text class="common-dialog__content pb-0 pt-0">
      <div>
        <span v-if="user2FA"> {{ this.$t('balance.stepper.confirmation.enabled_2fa_description', { email: this.userEmail }) }} </span>
        <span v-else> {{ this.$t('balance.stepper.confirmation.disabled_2fa_description', { email: this.userEmail }) }} </span>
      </div>
      <v-text-field
          v-model="emailCode"
          :hint="$t('user.code_hint')"
          :placeholder="$t('user.code')"
          persistent-hint
      />
      <v-text-field
          v-if="user2FA"
          v-model="twoFACode"
          :hint="$t('user.two_fa_code_hint')"
          :placeholder="$t('user.two_fa_code')"
          maxlength="6"
          persistent-hint
          @keydown="validate2FA"
      />

      <v-divider class="mt-6" />

      <div class="common-dialog__actions d-flex pt-1">
        <v-spacer />
        <v-btn
            :disabled="!emailCode || (user2FA && !twoFACode)"
            :loading="loading"
            color="primary"
            tile
            text
            plain
            small
            @click="finish"
        >
          {{ $t('common.finish') }}
        </v-btn>
        <v-spacer />
      </div>

    </v-card-text>
  </div>
</template>

<script>
import validateInputMixin from '@/mixins/common/validateInputMixin';
import loadingMixin from '@/mixins/common/loadingMixin.js';
import { mapActions } from 'vuex';

export default {
  name: 'CheckCodeStep',
  mixins: [loadingMixin,validateInputMixin],
  data() {
    return {
      emailCode: '',
      twoFACode: '',
    };
  },
  computed: {
    user2FA() {
      return this.$store.state.app.trader.g2fa;
    },
    userEmail() {
      const dividedEmail = this.$store.state.app.trader.email.split('@');
      const encryptedName = dividedEmail[0].slice(0, 2) + '***';
      const domain = dividedEmail[1];

      return `${encryptedName}@${domain}`;
    },
  },
  methods: {
    ...mapActions({
      getBalancesFromServerStore: 'user/getBalancesFromServer',
      confirmFiatWithdrawStore: 'balance/confirmFiatCryptoWithdraw',
    }),

    async finish() {
      try {
        this.startLoading();

        const payload = {
          code: this.emailCode,
          totp: this.user2FA ? this.twoFACode : null,
        };
        const isSuccess = await this.confirmFiatWithdrawStore(payload);

        if (isSuccess) {
          this.isSuccessWithdraw = true;
          await this.getBalancesFromServerStore();
          this.close();
        }
      } finally {
        this.stopLoading();
      }
    },
  },
};
</script>

<style scoped>

</style>