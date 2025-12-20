<template>
  <CommonDialog
      confirm-color="error"
      :confirm-text="$t('common.close')"
      header-color="error"
      @confirm="close(ticket_id)"
  >
    <template #default>
      <v-btn icon plain x-small class="mx-1">
        <v-icon color="red">mdi-close</v-icon>
      </v-btn>
    </template>

    <template #title>
      {{ $t('support.close') }}
    </template>

    <template #content>
      {{ $t('support.close_confirm') }}
    </template>
  </CommonDialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';
import {mapActions} from "vuex";

export default {
  name: 'Close',
  props: ['ticket_id'],
  data() {
    return {
      finish: false,
      loading: false,
    };
  },
  components: { CommonDialog },
  methods: {
    ...mapActions({
      closeTicketStore: 'support/closeTicket',
    }),
    async close(ticket_id) {
      await this.closeTicketStore(ticket_id);
      this.$emit('reload');
    },
  },
};
</script>
