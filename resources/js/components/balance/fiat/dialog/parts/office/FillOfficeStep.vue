<template>
  <div>
    <div class="mb-1">
      <div class="balance-fiat-dialog-replenish__replenish-info pt-0 mb-2">
        {{ $t('balance.dialog.fiat_office_step_description') }}
      </div>

      <v-form v-model="formValid">
        <v-row>
          <v-col cols="12" md="12" class="pt-0 pb-2">
            <v-select
                v-model="office_id"
                :items="available_offices"
                item-text="office_name"
                item-value="id"
                :label="$t('balance.select_office')"
                :hint="$t('balance.select_office_hint')"
                :rules="[rules.required]"
                autofocus
                persistent-hint
                hide-details="auto"
                required
                class="required"
                @change="getSlots"
            >
              <template #item="{item, on, attr}">
                <v-list-item v-bind="attr" v-on="on">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:selection="{item}">
                <span>{{ item.name }}</span>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row v-if="selected_office">
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <div class="d-flex justify-space-between">
              <div>
                <span>{{ $t('common.country') }}: </span>
              </div>
              <div>
                <item-with-logo
                    :cell_text="selected_office.country"
                    :logo="selected_office.country_logo"
                    :size="16"
                    :tile="true"
                ></item-with-logo>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <div class="d-flex justify-space-between">
              <div>
                <span>{{ $t('common.city') }}: </span>
              </div>
              <div>
                {{ selected_office.city }}
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <div class="d-flex justify-space-between">
              <div>
                <span>{{ $t('common.address') }}: </span>
              </div>
              <div>
                {{ selected_office.address }}
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <div class="d-flex justify-space-between">
              <div>
                <span>{{ $t('common.work_mode') }}: </span>
              </div>
              <div>
                {{ selected_office.work_from }} - {{ selected_office.work_till }}
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="12" class="pt-0 pb-0" v-if="selected_office.note">
            <div class="d-flex justify-space-between">
              <div>
                <span>{{ $t('common.note') }}: </span>
              </div>
              <div>
                {{ selected_office.note }}
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-divider class="mb-2 mt-2"></v-divider>
        </v-row>
        <v-row>
          <v-col cols="12" md="12" class="pt-0 pb-0">
            <div class="d-flex">
              <div class="mr-2">
                <v-date-picker
                    v-model="visit_date"
                    :first-day-of-week="1"
                    :min="minDate"
                    :max="maxDate"
                    :allowed-dates="allowed_dates"
                    color="primary"
                    no-title
                    @change="getSlots"
                ></v-date-picker>
              </div>
              <div class="d-flex">
                <v-btn-toggle
                    class="d-flex flex-wrap"
                    v-model="visit_period"
                    tile
                    color="success"
                    group
                >
                  <v-btn
                      v-for="slot in ordered_office_slots"
                      :key="slot.visit_from + '' +slot.visit_till"
                      :disabled="isSlotDisabled(slot)"
                      :value="[slot.visit_from, slot.visit_till]"
                      width="85"
                      class="mt-0"
                      small
                  >
                    <span :class="getSlotColor(slot)">{{ slot.visit_from }} - {{ slot.visit_till }}</span>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </div>

    <v-divider />

    <div class="common-dialog__actions d-flex pt-1">
      <v-spacer />
      <v-btn plain tile text small @click="back"> {{ $t('common.back') }} </v-btn>
      <v-spacer />
      <v-btn
          :loading="loading"
          :disabled="!office_id || !visit_date || !visit_period || !formValid"
          color="primary"
          tile
          text
          plain
          small
          @click="next"
      >
        {{ $t('common.next') }}
      </v-btn>
      <v-spacer />
    </div>
  </div>
</template>

<script>
import BalanceFiatDialogAlert from '@/components/balance/fiat/dialog/parts/BalanceFiatDialogAlert.vue';
import formValidationRules from '@/mixins/common/formValidationRules.js';
import loadingMixin from '@/mixins/common/loadingMixin.js';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';
import ItemWithLogo from "@/components/common/ItemWithLogo.vue";
export default {
  name: 'FillOfficeStep',
  components: {
    BalanceFiatDialogAlert,
    ItemWithLogo
  },
  mixins: [
    formValidationRules,
    loadingMixin,
    showNotificationMixin
  ],
  props: {
    selectedPlatform: {
      type: Object,
      required: true,
    },
    currency_scale: {
      type: [String, Number],
      required: true,
    },
    trader_status: {
      type: Number,
      required: true,
    },
    pay_templates: {
      type: Array,
      required: true,
    },
    available_offices: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      office_slots: [],
      office_id: this.available_offices.length > 0 ? this.available_offices[0].id : null,
      visit_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
      visit_period: null,
      formValid: false,
    };
  },
  computed: {
    minDate() {
      return this.$moment().format('YYYY-MM-DD')
    },
    current_date() {
      return this.$moment()
    },
    selected_date() {
      return this.$moment(this.visit_date)
    },
    is_current_date_selected() {
      return this.current_date.isSame(this.selected_date, 'day')
    },
    maxDate() {
      return this.$moment(this.minDate).add(7, 'days').format('YYYY-MM-DD')
    },
    ordered_office_slots() {
      return _.sortBy(this.office_slots, function(item) { return item.visit_from; })
    },
    selected_office() {
      let index = _.findIndex(this.available_offices, (item) => item.id === this.office_id);
      return index > -1 ? this.available_offices[index] : null;
    }
  },
  mounted() {
    this.getSlots();
  },
  methods: {
    allowed_dates(date) {
     return this.$moment(date).day() !== 0 && this.$moment(date).day() !== 6
    },
    isSlotDisabled(slot) {
      if (this.is_current_date_selected && slot.visit_from <= this.$moment().format('HH:mm'))
        return true;
      else return slot.status !== 'free';
    },
    getSlotColor(slot) {
      if(slot.status === 'busy')
        return 'red--text';
      else
      {
        if (this.is_current_date_selected && slot.visit_from <= this.$moment().format('HH:mm'))
          return '';
        else
        {
          if(slot.status === 'free')
            return 'green--text';
          else return 'red--text';
        }
      }
    },
    getSlots() {
      if(this.office_id && this.visit_date)
      {
        axios.get('/trader/ext/office_slots',{
          params: {
            office_id: this.office_id,
            visit_date: this.visit_date
          },
        }).then(response => {
          console.log(response.data);
          this.office_slots = response.data.data.periods;
        });
      }
    },
    next() {
      if(this.$moment().isAfter(this.$moment(this.visit_date + ' ' + this.visit_period[0])))
      {
        this.pushErrorNotification( this.$t('error.visit_time_expired'), null);
        this.getSlots();
      }
      else
      {
        this.$emit('office_filled', {
          office: this.selected_office,
          visit_date: this.visit_date,
          visit_period: this.visit_period
        });
      }
    },
    back() {
      this.$emit('back_pressed');
    },
  }
};
</script>

<style scoped>

</style>