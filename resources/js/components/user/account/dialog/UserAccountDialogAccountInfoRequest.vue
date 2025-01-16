<template>
  <CommonDialog
      confirm-color="success"
      :confirm-text="$t('common.send_request')"
      header-color="success"
      @confirm="makeRequest"
      :disabled="!has_wallets || req_count > 0"
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
      <div class="mt-2 mb-2" v-if="!has_wallets || req_count > 0">
        <small class="text--secondary d-block" v-if="!has_wallets">
          <span class="red--text">{{ $t('user.info.no_wallets') }}</span>
        </small>
        <small class="text--secondary d-block" v-if="req_count > 0">
          <span class="red--text">{{ $t('user.info.info_limit') }}: <b>{{ req_count }}</b></span>
        </small>
        <small class="text--secondary d-block" v-if="req_count > 0">
          <span class="red--text">{{ $t('user.info.info_limit_info') }}: <b>{{ get_date_plus_month(last_date) }}</b></span>
        </small>
      </div>
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
  props: {
    last_date: {
      type: String,
      required: false,
      default: null
    },
    has_wallets: {
      type: Boolean,
      required: false,
      default: false
    },
    req_count: {
      type: Number,
      required: false,
      default: 0
    }
  },
  components: { CommonDialog },
  methods: {
    async makeRequest() {
      await axios.post('/trader/ext/account_info_request', {lang: this.$vuetify.lang.current});
    },
    get_date_plus_month(date) {
      return this.$moment(date).add(1, 'month').utc().format('YYYY-MM-DD HH:mm:ss')
    },
  },
};
</script>

<style scoped>

</style>