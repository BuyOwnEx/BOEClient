<template>
  <div class="history-page d-flex flex-column flex-grow-1">
    <v-tabs v-model="selectedTab" :key="$i18n.locale" show-arrows class="flex-grow-0" >
      <v-tab v-for="item in available_items" :key="item.text" @click="setHash(item.hash)">
        {{ item.text }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="selectedTab" class="history-page__tabs-items flex-grow-1 fill-height">
      <v-tab-item v-for="item in available_items" :key="item.text" class="flex-grow-1">
        <Transactions v-if="item.hash === '#transactions'" class="flex-grow-1" />
        <FiatTransactions v-if="item.hash === '#fiat_transactions'" />
        <Transfers v-if="item.hash === '#transfers'" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import Transactions from '@/pages/main/Transactions.vue';
import FiatTransactions from '@/pages/main/FiatTransactions.vue';
import Transfers from '@/pages/main/Transfers.vue';
import { mapState } from 'vuex';
export default {
  name: 'History',
  components: {
    Transactions,
    FiatTransactions,
    Transfers
  },
  data() {
    return {
      selectedTab: 0,
    };
  },
  computed: {
    items() {
      return [
        {
          text: this.$t('menu.transactions'),
          link: '/history#transactions',
          hash: '#transactions',
          show: true
        },
        {
          text: this.$t('menu.fiat_transactions'),
          link: '/history#fiat_transactions',
          hash: '#fiat_transactions',
          show: true
        },
        {
          text: this.$t('menu.transfers'),
          link: '/history#transfers',
          hash: '#transfers',
          show: true
        }
      ];
    },
    available_items() {
      return _.filter(this.items, function(item) { return item.show === true; });
    },
  },
  async created() {
    const tabName = window.location.hash;
    if (tabName) {
      let index = _.findIndex(this.available_items, function(item) { return item.hash === tabName; });
      if(index > -1) {
        this.selectedTab = index;
      }
    }
  },
  methods: {
    setHash(tabIndex) {
      if (tabIndex === '#transactions') window.location.hash = '#transactions';
      else if (tabIndex === '#fiat_transactions') window.location.hash = '#fiat_transactions';
      else if (tabIndex === '#transfers') window.location.hash = '#transfers';
    },
  }
};
</script>

<style lang="sass" scoped>
.history-page
  max-width: 100%

  &__tabs-items
    padding-top: 5px
</style>