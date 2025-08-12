<template>
  <v-card>
    <v-data-table
        :calculate-widths="true"
        :headers="headers"
        :items="showedBalances"
        :items-per-page="itemsPerPage"
        :footer-props="footer_props"
        dense
    >
      <template #top>
        <v-toolbar flat dense>
          <div class="component-title">{{ componentTitle }}</div>
          <v-spacer />
          <v-switch
              v-model="showOnlyNotNullBalances"
              class="small-label-table-switch mr-sm-3"
              :label="$t('balance.show_only_not_null_balances')"
              hide-details
              left
              dense
              inset
          />
        </v-toolbar>
      </template>

      <template #item.action="{ item }">
        <v-menu v-model="item.menu" transition="slide-y-transition" close-on-click close-on-content-click offset-y bottom>
          <template #activator="{ on }">
            <v-btn v-on="on" text tile small class="pa-0">
              {{ $t('table_header.actions') }}
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <BalanceFiatDialogReplenish
              v-if="item.type === 'fiat'"
              :currency-obj="item"
              :rub_props="rub_props"
              :kgs_props="kgs_props"
              :swift_props="swift_props"
              @close-menu="closeMenu(item)"
            />
            <BalanceFiatDialogWithdraw
              v-if="item.type === 'fiat'"
              :currency-obj="item"
              :rub_props="rub_props"
              :kgs_props="kgs_props"
              :swift_props="swift_props"
              @close-menu="closeMenu(item)"
            />
            <BalanceCryptoDialogReplenish v-if="item.type === 'crypto'" :currency-obj="item" @close-menu="closeMenu(item)" />
            <BalanceCryptoDialogWithdraw v-if="item.type === 'crypto'" :currency-obj="item" @close-menu="closeMenu(item)" />
            <BalanceDialogTransfer v-if="!isHideTrading" type="trade" wallet="crypto" :currency-obj="item" @close-menu="closeMenu(item)" />
            <BalanceDialogTransfer v-if="!isHideTrading" type="safe" wallet="crypto" :currency-obj="item" @close-menu="closeMenu(item)" />
            <BalanceDialogOTCTransfer v-if="isOTCEnabled" type="safe_otc" :currency-obj="item" @close-menu="closeMenu(item)" />
            <BalanceDialogOTCTransfer v-if="isOTCEnabled" type="otc_safe" :currency-obj="item" @close-menu="closeMenu(item)" />
          </v-list>
        </v-menu>
      </template>
      <template #item.currency="{ item }">
        <v-img
            v-if="item.logo"
            class="elevation-0 d-inline-flex vertical-middle"
            :src="item.logo"
            max-height="22"
            max-width="22"
        />
        <v-avatar v-else class="white--text subtitle-2" :color="item.color" size="22">
          {{ item.currency.charAt(0) }}
        </v-avatar>
        <span class="ml-1">{{ item.currency }}</span>
      </template>
      <template #item.type="{ item }">
        <v-badge v-if="item.type === 'token'" color="grey lighten-1" :content="item.platform">
          {{ item.type }}
        </v-badge>
        <span v-else>{{ item.type }}</span>
      </template>
      <template #item.safe="{ item }">
        {{ BigNumber(item.safe).toFixed(item.scale, 1).toString() }}
      </template>
      <template #item.trade="{ item }">
        {{ BigNumber(item.available).toFixed(item.scale, 1).toString() }}
      </template>
      <template #item.otc_main="{ item }">
        {{ BigNumber(item.otc_main).toFixed(item.scale, 1).toString() }}
      </template>
      <template #item.otc_blocked="{ item }">
        {{ BigNumber(item.otc_blocked).toFixed(item.scale, 1).toString() }}
      </template>
      <template #item.withdraw="{ item }">
        {{ BigNumber(item.withdraw).toFixed(item.scale, 1).toString() }}
      </template>
      <template #item.blocked="{ item }">
        {{ BigNumber(item.blocked).toFixed(item.scale, 1).toString() }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import balanceStateMethodsMixin from '@/mixins/balance/balanceStateMethodsMixin';
import BalanceFiatDialogWithdraw from '@/components/balance/fiat/dialog/BalanceFiatDialogWithdraw.vue';
import { mapState } from 'vuex';

export default {
  name: 'BalanceList',
  components: {
    BalanceFiatDialogWithdraw,
    BalanceFiatDialogReplenish: () => import('@/components/balance/fiat/dialog/BalanceFiatDialogReplenish.vue'),
    BalanceCryptoDialogReplenish: () => import('@/components/balance/crypto/dialog/BalanceCryptoDialogReplenish.vue'),
    BalanceCryptoDialogWithdraw: () => import('@/components/balance/crypto/dialog/BalanceCryptoDialogWithdraw.vue'),
    BalanceDialogTransfer: () => import('@/components/balance/common/BalanceDialogTransfer.vue'),
    BalanceDialogOTCTransfer: () => import('@/components/balance/common/BalanceDialogOTCTransfer.vue'),
    CommonTooltip: () => import('@/components/common/CommonTooltip.vue'),
  },

  mixins: [balanceStateMethodsMixin],

  data() {
    return {
      showOnlyNotNullBalances: false,
      componentTitle: this.$t('balance.headers.own_crypto_balance_list'),
      itemsPerPage: 30,
      footer_props: {
        'items-per-page-options': [30, 50, 100, 500],
        'items-per-page-all-text': '500',
      },
    };
  },
  computed: {
    ...mapState('app', ['product']),
    ...mapState('user', ['blockStatus']),
    headers() {
      return [
        { text: this.$t('table_header.currency'), align: 'start', sortable: true, value: 'currency' },
        { text: this.$t('table_header.name'), value: 'name' },
        { text: this.$t('table_header.safe'), value: 'safe' },
        { text: this.$t('table_header.trade'), value: 'trade', align: !this.isHideTrading ? ''  : ' d-none' },
        { text: this.$t('table_header.otc'), value: 'otc_main', align: this.isOTCEnabled ? ''  : ' d-none' },
        { text: this.$t('table_header.otc_blocked'), value: 'otc_blocked', align: this.isOTCEnabled ? ''  : ' d-none' },
        { text: this.$t('table_header.withdraw'), value: 'withdraw' },
        { text: this.$t('table_header.blocked'), value: 'blocked', align: !this.isHideTrading ? ''  : ' d-none' },
        { text: this.$t('table_header.actions'), value: 'action', sortable: false, align: 'end' },
      ];
    },
    isOTCEnabled() {
      return this.product.enabledOTC
    },
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
    balances() {
      return this.$store.state.user.balances;
    },
    rub_props() {
      return this.$store.state.user.rub_props === null ? [] : this.$store.state.user.rub_props;
    },
    kgs_props() {
      return this.$store.state.user.kgs_props === null ? [] : this.$store.state.user.kgs_props;
    },
    swift_props() {
      return this.$store.state.user.swift_props === null ? [] : this.$store.state.user.swift_props;
    },
    showedBalances() {
      if(this.showOnlyNotNullBalances)
      {
        if(this.isOTCEnabled)
        {
          return _.filter(this.balances, item => {
            return (
                (!BigNumber(item.safe).isZero() ||
                  !BigNumber(item.available).isZero() ||
                  !BigNumber(item.blocked).isZero() ||
                  !BigNumber(item.withdraw).isZero() ||
                  !BigNumber(item.otc_main).isZero() ||
                  !BigNumber(item.otc_blocked).isZero()) &&
                item.status === 'active'
            );
          });
        }
        else
        {
          return _.filter(this.balances, item => {
            return (
              (!BigNumber(item.safe).isZero() ||
                !BigNumber(item.available).isZero() ||
                !BigNumber(item.blocked).isZero() ||
                !BigNumber(item.withdraw).isZero()) &&
                item.status === 'active'
            );
          });
        }
      }
      else
      {
        return _.filter(this.balances, item => {
          return (
              item.status === 'active'
          );
        });
      }
    },
  },
  created() {
    this.$store.dispatch('user/getRubPropsFromServer');
    this.$store.dispatch('user/getKgsPropsFromServer');
    this.$store.dispatch('user/getSwiftPropsFromServer');
  },
  methods: {
    BigNumber(item) {
      return BigNumber(item);
    },
    closeMenu(item) {
      item.menu = false;
    },
  },
};
</script>
