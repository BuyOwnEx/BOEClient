<template>
  <CommonDialog
      confirm-color="success"
      :confirm-text="$t('common.send_request')"
      header-color="success"
      @confirm="makeRequest"
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
      <v-row no-gutters>
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
          <span class="red--text">*</span> {{ $t('user.info.statement_request_conditions',[minStartDate]) }}
        </small>
      </div>
    </template>
  </CommonDialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';
export default {
  name: 'UserAccountDialogStatementRequest',
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
  },
};
</script>

<style scoped>

</style>