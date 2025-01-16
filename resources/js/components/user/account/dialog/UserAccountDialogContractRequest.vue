<template>
  <CommonDialog
      confirm-color="success"
      :confirm-text="$t('common.send_request')"
      header-color="success"
      @confirm="makeRequest"
      :disabled="!is_verified || last_date !== null"
  >
    <template #default>
      <v-btn class="mb-2">
        <v-icon left small color="primary">mdi-file-sign</v-icon>
        {{ $t('common.form') }}
      </v-btn>
    </template>

    <template #title>
      {{ $t('user.info.contract_request') }}
    </template>

    <template #content>
      {{ $t('user.info.contract_request_description') }}
      <div class="mt-2 mb-2" v-if="!is_verified || last_date !== null">
        <small class="text--secondary d-block" v-if="!is_verified">
          <span class="red--text">{{ $t('user.info.not_verified') }}</span>
        </small>
        <small class="text--secondary d-block" v-if="last_date !== null">
          <span class="red--text">{{ $t('user.info.contract_already_requested') }}</span>
        </small>
      </div>
      <div class="mt-2">
        <small class="text--secondary">
          <span class="red--text">*</span> {{ $t('user.info.contract_request_conditions') }}
        </small>
      </div>
    </template>
  </CommonDialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';
export default {
  name: 'UserAccountDialogContractRequest',
  props: {
    last_date: {
      type: String,
      required: false,
      default: null
    },
    is_verified: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  components: { CommonDialog },
  methods: {
    async makeRequest() {
      await axios.post('/trader/ext/contract_request', {lang: this.$vuetify.lang.current});
    },
  },
};
</script>

<style scoped>

</style>