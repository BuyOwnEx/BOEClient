<template>
	<v-card class="transfers fill-height">
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
			:caption="$t('reports.transfers_title')"
			dense
		>
			<template #top>
				<filters
					:all_sides="sides"
          :all_types="types"
					:all_currencies="currencies"
          :is_show="is_show_filters"
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
				/>
				<v-divider class="pb-2" />
			</template>
      <template #item.currency="{ item }">
        <item-with-logo
            :cell_text="item.currency"
            :logo="getLogo(item.currency)"
            :size="18"
        ></item-with-logo>
      </template>
      <template #item.type="{ item }">
        <span>{{ $t('transfers.types.'+item.type) }}</span>
      </template>
			<template #item.side="{ item }">
        <span :class="item.side === true ? 'success--text' : 'error--text'">
					{{ getSideName(item.side) }}
				</span>
			</template>
			<template #item.created_at="{ item }">
				<span>{{ getDate(item.created_at) }}</span>
			</template>
			<template #item.amount="{ item }">
				<span>{{ getNumber(item.amount) }}</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';
import thousands from '@/plugins/thousands.js';
import bignumber from '@/mixins/format/bignumber.js';
import filters from '@/components/filters/Transfers.vue';
import ItemWithLogo from '@/components/common/ItemWithLogo.vue';
export default {
	name: 'Transfers',
	components: {
		filters,
    ItemWithLogo
	},
  mixins: [bignumber],
	data() {
		return {
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
			sides: [
        { value: false, name: this.$t('common.withdrawal') },
        { value: true, name: this.$t('common.replenishment') },
			],
		};
	},
	computed: {
    ...mapState('app', ['product']),
    ...mapState('trading', ['all_currencies','allCurrencyListInit']),
    ...mapState('user', ['blockStatus']),
    is_show_filters() {
      return this.product.filters_all_expanded
    },
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
    isOTCEnabled() {
      return this.product.enabledOTC
    },
		headers() {
			return [
				{ text: 'ID', value: 'id' },
				{ text: this.$t('table_header.date'), value: 'created_at' },
        { text: this.$t('table_header.type'), value: 'type' },
				{ text: this.$t('table_header.side'), value: 'side' },
				{ text: this.$t('table_header.currency'), value: 'currency' },
				{ text: this.$t('table_header.amount'), value: 'amount' },
			];
		},
    currencies() {
      return this.allCurrencyListInit ? this.all_currencies : []
    },
    types() {
      if(this.isOTCEnabled && !this.isHideTrading)
      {
        return [
          { value: 'transfer', name: this.$t('transfers.types.transfer') },
          { value: 'otc_transfer', name: this.$t('transfers.types.otc_transfer') },
        ]
      }
      else if(this.isOTCEnabled && this.isHideTrading)
      {
        return [
          { value: 'otc_transfer', name: this.$t('transfers.types.otc_transfer') },
        ]
      }
      else
      {
        return [
          { value: 'transfer', name: this.$t('transfers.types.transfer') }
        ]
      }
    }
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
		getLogo(currency) {
			return this.currencies.find(item => item.currency === currency).logo;
		},
    getNumber(number) {
      return thousands(this.BigNumber(number), ' ')
    },
		getDate(date) {
			return date ? this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '-';
		},
		getSideName(side) {
			let index = _.findIndex(this.sides, item => item.value === side);
			return this.sides[index].name;
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
			const response = await axios.get('/trader/ext/all_transfers', {
				params: parameters,
			});
			return response.data;
		},
		menuItemExist(func) {
			return _.findIndex(this.actions, action => action.name === func) !== -1;
		},
		closeMenu(item) {
			item.menu = false;
		},
		getImage(img) {
			return '/' + img;
		},
	},
};
</script>
