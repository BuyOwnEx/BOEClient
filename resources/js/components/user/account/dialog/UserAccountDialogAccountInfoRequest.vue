<template>
  <CommonDialog
      confirm-color="success"
      :confirm-text="$t('common.send_request')"
      header-color="success"
      @confirm="makeRequest"
  >
    <template #default>
      <v-btn class="mb-2">
        <v-icon left small color="primary">mdi-file-certificate</v-icon>
        {{ $t('common.form') }}
      </v-btn>
    </template>

    <template #title>
      {{ $t('user.info.account_info_request') }}
    </template>

    <template #content>
      {{ $t('user.info.account_info_request_description') }}
      <div class="mt-2">
        <small class="text--secondary">
          <span class="red--text">*</span> {{ $t('user.info.account_info_request_conditions') }}
        </small>
      </div>
    </template>
  </CommonDialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';
export default {
  name: 'UserAccountDialogAccountInfoRequest',
  components: { CommonDialog },
  methods: {
    async makeRequest() {
      await axios.post('/trader/ext/account_info_request', {lang: this.$vuetify.lang.current});
    },
  },
};
</script>

<style scoped>

</style>