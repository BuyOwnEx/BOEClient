<template>
  <v-card class="exchange-history">
    <v-data-table
        class="pt-1 px-1 pt-sm-2 px-sm-2"
        :style="`width:100%`"
        :calculate-widths="true"
        :headers="headers"
        :items="items"
        :options.sync="options"
        :items-per-page.sync="itemsPerPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :server-items-length="totalItems"
        :footer-props="footer_props"
        :loading="loading"
        :caption="$t('reports.exchange_history_title')"
        dense
    >
      <template #top>
        <filters
            :all_statuses="statuses"
            @apply-table-filter="onFilterApply"
            @reset-table-filter="onFilterReset"
            @table-filter="onUseFilter"
            @toggleFiltersShow="toggleFiltersShow"
        />
        <v-divider class="pb-2" />
      </template>
      <template #item.created_at="{ item }">
        <span>{{ getDate(item.created_at) }}</span>
      </template>
      <template #item.pair="{ item }">
        <div class="d-flex">
          <item-with-logo
              :cell_text="item.currency_out"
              :logo="item.currency_out_logo"
              :size="18"
          ></item-with-logo>
          <v-icon class="mx-2">mdi-arrow-right-thin</v-icon>
          <item-with-logo
              :cell_text="item.currency_in"
              :logo="item.currency_in_logo"
              :size="18"
          ></item-with-logo>
        </div>
      </template>
      <template #item.amount="{ item }">
        <span>{{ BigNumber(item.amount) + ' ' + item.currency_out }}</span>
      </template>
      <template #item.volume="{ item }">
        <span>{{ item.is_reverse_depth ? BigNumber(item.amount).div(item.rate).toFixed(item.rate_scale,1) + ' ' + item.currency_in : BigNumber(item.amount).times(item.rate).toFixed(item.rate_scale,1) + ' ' + item.currency_in }}</span>
      </template>
      <template #item.rate_type="{ item }">
        {{ $t('exchange.rate_types.'+item.rate_type) }}
      </template>
      <template #item.rate="{ item }">
        <span>{{ item.is_reverse_depth ? BigNumber(item.rate).toString() + ' ' + item.currency_out : BigNumber(item.rate).toString() + ' ' + item.currency_in }}</span>
      </template>

      <template #item.status="{ item }">
        <CommonTooltip v-if="item.status === 'rejected' && item.reason" :value="item.reason">
          <span :class="getStatusClassColor(item.status)">
					  {{ getStatusName(item.status) }}
				  </span>
        </CommonTooltip>
        <span v-else :class="getStatusClassColor(item.status)">
					{{ getStatusName(item.status) }}
				</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import filters from '@/components/filters/ExchangeHistory.vue';
import CommonTooltip from '@/components/common/CommonTooltip.vue';
import bignumber from '@/mixins/format/bignumber.js';
import { mapState } from 'vuex';
import ItemWithLogo from '@/components/common/ItemWithLogo.vue';

export default {
  name: 'ExchangeHistory',
  components: {
    ItemWithLogo,
    CommonTooltip,
    filters,
  },
  mixins: [bignumber],
  data() {
    return {
      isFiltersShow: true,
      totalItems: 0,
      items: [],
      loading: true,
      options: {},
      itemsPerPage: 30,
      sortBy: 'id',
      sortDesc: true,
      footer_props: {
        'items-per-page-options': [30, 50, 100, 500],
        'items-per-page-all-text': '500',
      },
    };
  },
  computed: {
    ...mapState('app', ['product']),
    showing_fee_in_market() {
      return this.product.deals_show_fee_in_market
    },
    statuses() {
      return [
        { value: 'new', name: this.$t('exchange.statuses.new') },
        { value: 'accepted', name: this.$t('exchange.statuses.accepted') },
        { value: 'rejected', name: this.$t('exchange.statuses.rejected') },
      ];
    },
    headers() {
      return [
        { text: 'ID', value: 'id' },
        { text: this.$t('exchange.request_date'), value: 'created_at' },
        { text: this.$t('exchange.exchange_dir'), value: 'pair', sortable: false },
        { text: this.$t('exchange.amount_out'), value: 'amount'},
        { text: this.$t('exchange.amount_in'), value: 'volume', sortable: false},
        { text: this.$t('exchange.rate_type'), value: 'rate_type' },
        { text: this.$t('exchange.rate_header'), value: 'rate' },
        { text: this.$t('table_header.status'), value: 'status', align: 'end' }
      ];
    },
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi().then(data => {
          this.items = data.items;
          this.totalItems = data.total;
        });
      },
      deep: true,
    },
  },
  methods: {
    getStatusName(status) {
      let index = _.findIndex(this.statuses, item => item.value === status);
      return this.statuses[index]?.name;
    },
    getStatusClassColor(status) {
      if (status === 'accepted') return 'success--text';
      else if (status === 'new') return 'warning--text';
      else if (status === 'rejected') return 'error--text';
      else return '';
    },
    getDate(date) {
      return date ? this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '-';
    },
    onFilterApply(data) {
      this.options.filters = data;
      this.getDataFromApi().then(data => {
        this.items = data.items;
        this.totalItems = data.total;
      });
    },
    onUseFilter(data) {
      this.options.filters = data;
    },
    onFilterReset(data) {
      this.options.filters = data;
      this.getDataFromApi().then(data => {
        this.items = data.items;
        this.totalItems = data.total;
      });
    },
    onReload() {
      this.getDataFromApi().then(data => {
        this.items = data.items;
        this.totalItems = data.total;
      });
    },
    async getDataFromApi() {
      this.loading = true;
      return new Promise(async (resolve, reject) => {
        let result = await this.getItems(this.options);
        let items = result.data;
        const total = result.total;
        setTimeout(() => {
          this.loading = false;
          resolve({
            items,
            total,
          });
        }, 1000);
      });
    },
    async getItems(opts) {
      console.log(opts);
      let parameters = opts;
      if (opts.filters === undefined) {
        let dates = {
          filters: {
            start: this.$moment().startOf('month').format('YYYY-MM-DD') + ' ' + '00:00:00',
            end: this.$moment().format('YYYY-MM-DD') + ' ' + '23:59:59',
          },
        };
        _.assign(parameters, dates);
      }
      const response = await axios.get('/trader/ext/exchanges', {
        params: parameters,
      });
      return response.data;
    },

    toggleFiltersShow() {
      this.isFiltersShow = !this.isFiltersShow;
    },
  },
};
</script>

<style scoped>

</style>