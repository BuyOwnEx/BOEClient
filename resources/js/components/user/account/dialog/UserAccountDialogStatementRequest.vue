<template>
  <CommonDialog
      confirm-color="success"
      :confirm-text="$t('common.send_request')"
      header-color="success"
      @confirm="makeRequest"
      :disabled="!has_accounts || req_count >= statement_req_limit"
  >
    <template #default>
      <v-btn class="mb-2">
        <v-icon left small color="primary">mdi-file-cabinet</v-icon>
        {{ $t('common.form') }}
      </v-btn>
    </template>

    <template #title>
      {{ $t('user.info.statement_request') }}
    </template>

    <template #content class="pb-1">
      {{ $t('user.info.statement_request_description') }}
      <div class="mt-2 mb-2" v-if="!has_accounts || req_count >= statement_req_limit">
        <small class="text--secondary d-block" v-if="!has_accounts">
          <span class="red--text">{{ $t('user.info.no_accounts') }}</span>
        </small>
        <small class="text--secondary d-block" v-if="req_count >= statement_req_limit">
          <span class="red--text">{{ $t('user.info.statement_limit') }}: <b>{{ req_count }}</b></span>
        </small>
        <small class="text--secondary d-block" v-if="req_count >= statement_req_limit">
          <span class="red--text">{{ $t('user.info.statement_limit_info') }}: <b>{{ get_next_available_date(first_date) }}</b></span>
        </small>
      </div>
      <v-row no-gutters v-else>
        <v-col class="px-1" cols="12" sm="12" md="6">
          <v-menu
              ref="menu_start_date"
              v-model="menu_start_date"
              :close-on-content-click="false"
              :return-value.sync="form.from"
              transition="scale-transition"
              min-width="290px"
              offset-y
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                  class="mt-2"
                  v-model="form.from"
                  :label="$t('reports.date_from')"
                  :hint="$t('reports.date_from_hint')"
                  hide-details="auto"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
              />
            </template>
            <v-date-picker
                v-model="form.from"
                :min="minStartDate"
                :max="maxStartDate"
                color="primary"
                no-title
                scrollable
                @change="startDateWasChanged"
            />
          </v-menu>
        </v-col>
        <v-col class="px-1" cols="12" sm="12" md="6">
          <v-menu
              ref="menu_end_date"
              v-model="menu_end_date"
              :close-on-content-click="false"
              :return-value.sync="form.to"
              transition="scale-transition"
              min-width="290px"
              offset-y
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                  class="mt-2"
                  v-model="form.to"
                  :label="$t('reports.date_till')"
                  :hint="$t('reports.date_till_hint')"
                  hide-details="auto"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
              />
            </template>
            <v-date-picker
                v-model="form.to"
                :min="minEndDate"
                :max="maxEndDate"
                color="primary"
                no-title
                scrollable
                @change="endDateWasChanged"
            />
          </v-menu>
        </v-col>
      </v-row>
      <div class="mt-2">
        <small class="text--secondary">
          <span class="red--text">*</span>
          {{ $t('user.info.statement_request_conditions',[minStartDate]) }}
          {{ $t('user.info.statement_request_limit_conditions',[ $tc('common.times', statement_req_limit, { statement_req_limit }) ]) }}
          {{ period }}
        </small>
      </div>
    </template>
  </CommonDialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';
export default {
  name: 'UserAccountDialogStatementRequest',
  props: {
    statement_req_period_name: {
      type: String,
      required: true,
    },
    statement_req_period: {
      type: Number,
      required: true,
    },
    statement_req_limit: {
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
    has_accounts: {
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
  data() {
    return {
      menu_start_date: false,
      menu_end_date: false,
      form: {
        from: this.$moment().utc().startOf('month').format('YYYY-MM-DD'),
        to: this.$moment().utc().format('YYYY-MM-DD'),
      },
      available_statement_days: import.meta.env.VITE_AVAILABLE_STATEMENT_DAYS || 365,
    };
  },
  computed: {
    minStartDate() {
      return this.$moment().utc().subtract(this.available_statement_days, 'days').format('YYYY-MM-DD')
    },
    maxStartDate() {
      return this.$moment().utc().format('YYYY-MM-DD')
    },
    minEndDate() {
      return this.$moment(this.form.from).format('YYYY-MM-DD');
    },
    maxEndDate() {
      if(this.$moment(this.form.from).isBefore(this.$moment().utc().subtract(1, 'month')))
        return this.$moment(this.minEndDate).add(1, 'month').utc().format('YYYY-MM-DD')
      else return this.$moment().utc().format('YYYY-MM-DD')
    },
    period() {
      if(this.statement_req_period_name === 'year') return this.$tc('common.year_period', this.statement_req_period, [this.statement_req_period]);
      else if(this.statement_req_period_name === 'month') return this.$tc('common.month_period', this.statement_req_period, [this.statement_req_period])
      else return this.$tc('common.day_period', this.statement_req_period, [this.statement_req_period])
    },
  },
  methods: {
    startDateWasChanged() {
      this.$refs.menu_start_date.save(this.form.from);
      if(this.$moment(this.form.from).isBefore(this.$moment().utc().subtract(1, 'month')))
        this.form.to = this.$moment(this.form.from).add(1, 'month').utc().format('YYYY-MM-DD');
      else
        this.form.to = this.$moment().utc().format('YYYY-MM-DD');
      this.$refs.menu_end_date.save(this.form.to)
    },
    endDateWasChanged() {
      this.$refs.menu_end_date.save(this.form.to)
    },
    async makeRequest() {
      await axios.post('/trader/ext/statement_request', {
        start: this.form.from,
        end: this.form.to,
        lang: this.$vuetify.lang.current
      });
    },
    get_next_available_date(date) {
      return this.$moment(date).add(this.statement_req_period, this.statement_req_period_name).utc().format('YYYY-MM-DD HH:mm:ss')
    },
  },
};
</script>

<style scoped>

</style>