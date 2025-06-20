<template>
  <div>
    <div class="mb-1">
      <BalanceFiatDialogAlert>
        {{ $t('balance.dialog.office_withdrawal_alert') }}
        <ul>
          <li>{{ $t('balance.dialog.office_document_1') }}</li>
          <li>{{ $t('balance.dialog.office_document_2') }}</li>
          <li>{{ $t('balance.dialog.office_document_3') }}</li>
        </ul>
      </BalanceFiatDialogAlert>

      <div class="balance-fiat-dialog-replenish__replenish-info pt-2 mb-2">
        {{ $t('balance.dialog.fiat_office_confirmation_step_description') }}
      </div>

      <v-row>
        <v-col cols="12" md="12" class="pt-0 pb-2">
          <div class="d-flex justify-space-between">
            <div>
              <span>{{ $t('common.office') }}: </span>
            </div>
            <div>
              {{ office.name }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="12" class="pt-0 pb-2">
          <div class="d-flex justify-space-between">
            <div>
              <span>{{ $t('common.country') }}: </span>
            </div>
            <div>
              <item-with-logo
                  :cell_text="office.country"
                  :logo="office.country_logo"
                  :size="16"
                  :tile="true"
              ></item-with-logo>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="12" class="pt-0 pb-2">
          <div class="d-flex justify-space-between">
            <div>
              <span>{{ $t('common.city') }}: </span>
            </div>
            <div>
              {{ office.city }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="12" class="pt-0 pb-2">
          <div class="d-flex justify-space-between">
            <div>
              <span>{{ $t('common.address') }}: </span>
            </div>
            <div>
              {{ office.address }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="12" class="pt-0 pb-2">
          <div class="d-flex justify-space-between">
            <div>
              <span>{{ $t('common.work_mode') }}: </span>
            </div>
            <div>
              {{ office.work_from }} - {{ office.work_till }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="12" class="pt-0 pb-2" v-if="office.note">
          <div class="d-flex justify-space-between">
            <div>
              <span>{{ $t('common.note') }}: </span>
            </div>
            <div>
              {{ office.note }}
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-divider class="mb-2 mt-2"></v-divider>
      </v-row>
      <v-row>
        <v-col cols="12" md="12" class="pt-0 pb-2">
          <div class="d-flex justify-space-between">
            <div>
              <span>{{ $t('common.visit_date') }}: </span>
            </div>
            <div>
              {{ visit_date }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="12" class="pt-0 pb-2">
          <div class="d-flex justify-space-between">
            <div>
              <span>{{ $t('common.visit_period') }}: </span>
            </div>
            <div>
              {{ visit_from }} - {{ visit_till }}
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-divider />

    <div class="common-dialog__actions d-flex pt-1">
      <v-spacer />
      <v-btn plain tile text small @click="back"> {{ $t('common.back') }} </v-btn>
      <v-spacer />
      <v-btn
          :loading="loading"
          color="primary"
          tile
          text
          plain
          small
          @click="finish"
      >
        {{ $t('common.confirm') }}
      </v-btn>
      <v-spacer />
    </div>
  </div>
</template>

<script>
import BalanceFiatDialogAlert from '@/components/balance/fiat/dialog/parts/BalanceFiatDialogAlert.vue';
import ItemWithLogo from "@/components/common/ItemWithLogo.vue";
import loadingMixin from '@/mixins/common/loadingMixin.js';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';
export default {
  name: 'ConfirmationOfficeWithdrawStep',
  components: {
    BalanceFiatDialogAlert,
    ItemWithLogo
  },
  mixins: [
    loadingMixin,
    showNotificationMixin
  ],
  props: {
    selectedPlatform: {
      type: Object,
      required: true,
    },
    office: {
      type: Object,
      required: true,
    },
    visit_date: {
      type: String,
      required: true,
    },
    visit_from: {
      type: String,
      required: true,
    },
    visit_till: {
      type: String,
      required: true,
    },
  },
  methods: {
    back() {
      this.$emit('back_pressed');
    },
    finish() {
      if(this.$moment().isAfter(this.$moment(this.visit_date + ' ' + this.visit_from)))
      {
        this.pushErrorNotification( this.$t('error.visit_time_expired'), null);
      }
      else
      {
        axios.post('/trader/ext/notify_fiat_office_withdraw', {
          office_id: this.office.id,
          visit_date: this.visit_date,
          visit_from: this.visit_from,
          visit_till: this.visit_till
        }).then(response => {
          if (response.data.success === true) {
            this.$emit('success_response');
          }
        });
      }
    },
  }
};
</script>

<style scoped>

</style>