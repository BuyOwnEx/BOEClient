<template>
  <v-card>
    <v-data-table
        :calculate-widths="true"
        :headers="headers"
        :items="fiat_withdrawals"
        :items-per-page="itemsPerPage"
        :footer-props="footer_props"
        dense
    >
      <template #top>
        <v-toolbar flat dense>
          <div class="component-title">{{ $t('balance.headers.own_active_withdraw_list') }}</div>
        </v-toolbar>
      </template>

      <template #item.action="{ item }">
        <v-menu close-on-click offset-y v-model="item.menu" transition="slide-y-transition" bottom>
          <template #activator="{ on }">
            <v-btn color="#A6A6A6" v-on="on" text tile small>
              {{ $t('table_header.actions') }}
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <WithdrawFiatCancel
                :withdrawObj="item"
                @close-menu="closeMenu(item)"
                @cancel="filterWithdrawalList"
            />
          </v-list>
        </v-menu>
      </template>

      <template #item.date="{item}">
        {{ formatDate(item.date, 'dateOnly') + ' ' + formatDate(item.date, 'timeOnly') }}
      </template>

      <template #item.currency="{ item }">
        <v-img
            v-if="getCurrencyLogo(item.currency)"
            class="elevation-0 d-inline-flex vertical-middle"
            :src="getCurrencyLogo(item.currency)"
            max-height="22"
            max-width="22"
        />

        <v-avatar class="white--text subtitle-2" :color="getCurrencyColor(item.currency)" size="22" v-else>
          {{ item.currency.charAt(0) }}
        </v-avatar>

        <span class="ml-1">{{ item.currency }}</span>
      </template>

      <template #item.amount="{ item }">
        {{ BigNumber(item.amount).toString() }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatDate from '@/mixins/format/formatDate';
import getUserCurrencyPropertyMixin from '@/mixins/common/getUserCurrencyPropertyMixin';
export default {
  name: 'BalanceFiatWithdrawalList',
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  components: {
    WithdrawFiatCancel: () => import('@/components/balance/withdrawal/WithdrawFiatCancel.vue'),
  },
  mixins: [
    formatDate,
    getUserCurrencyPropertyMixin
  ],
  data() {
    return {
      fiat_withdrawals: this.list,
      itemsPerPage: 30,
      footer_props: {
        'items-per-page-options': [5, 10, 30, 100, 500],
        'items-per-page-all-text': '500',
      },
    };
  },

  computed: {
    headers() {
      return [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: this.$t('table_header.date'), value: 'date' },
        { text: this.$t('table_header.currency'), value: 'currency' },
        { text: this.$t('table_header.amount'), value: 'amount' },
        { text: this.$t('table_header.actions'), value: 'action', sortable: false, align: 'center' },
      ];
    },
  },

  watch: {
    list(val) {
      this.fiat_withdrawals = val;
    },
  },

  methods: {
    filterWithdrawalList(idToDelete) {
      this.fiat_withdrawals = this.fiat_withdrawals.filter(item => item.id !== idToDelete);
    },

    BigNumber(item) {
      return BigNumber(item);
    },
    closeMenu(item) {
      item.menu = false;
    },
  },
};
</script>

<style scoped>

</style>