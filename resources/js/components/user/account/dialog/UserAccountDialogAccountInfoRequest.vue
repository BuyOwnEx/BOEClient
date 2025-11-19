<template>
  <CommonDialog
      confirm-color="success"
      :confirm-text="$t('common.send_request')"
      header-color="success"
      @confirm="makeRequest"
      :disabled="!has_wallets || req_count >= info_req_limit"
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
      <div class="mt-2 mb-2" v-if="!has_wallets || req_count >= info_req_limit">
        <small class="text--secondary d-block" v-if="!has_wallets">
          <span class="red--text">{{ $t('user.info.no_wallets') }}</span>
        </small>
        <small class="text--secondary d-block" v-if="req_count >= info_req_limit">
          <span class="red--text">{{ $t('user.info.info_limit') }}: <b>{{ req_count }}</b></span>
        </small>
        <small class="text--secondary d-block" v-if="req_count >= info_req_limit">
          <span class="red--text">{{ $t('user.info.info_limit_info') }}: <b>{{ get_next_available_date(first_date) }}</b></span>
        </small>
      </div>
      <div class="mt-2">
        <small class="text--secondary">
          <span class="red--text">*</span>
          {{ $t('user.info.account_info_request_limit_conditions',[ $tc('common.times', info_req_limit, { info_req_limit }) ]) }}
          {{ period }}
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
    info_req_period_name: {
      type: String,
      required: true,
    },
    info_req_period: {
      type: Number,
      required: true,
    },
    info_req_limit: {
      type: Number,
      required: true,
    },
    last_date: {
      type: String,
      required: false,
      default: null
    },
    first_date: {
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
  computed: {
    period() {
      if(this.info_req_period_name === 'year') return this.$tc('common.year_period', this.info_req_period, [this.info_req_period]);
      else if(this.info_req_period_name === 'month') return this.$tc('common.month_period', this.info_req_period, [this.info_req_period])
      else return this.$tc('common.day_period', this.info_req_period, [this.info_req_period])
    },
  },
  methods: {
    async makeRequest() {
      await axios.post('/trader/ext/account_info_request', {lang: this.$vuetify.lang.current});
    },
    get_next_available_date(date) {
      return this.$moment(date).add(this.info_req_period, this.info_req_period_name).utc().format('YYYY-MM-DD HH:mm:ss')
    },
  },
};
</script>

<style scoped>

</style>