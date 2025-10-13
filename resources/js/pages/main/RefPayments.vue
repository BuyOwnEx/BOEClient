<template>
	<v-card class="ref-payments">
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
			:caption="$t('reports.ref_payments_title')"
			dense
		>
			<template #top>
				<filters
					:all_currencies="currencies"
          :is_show="is_show_filters"
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
				/>
				<v-divider class="pb-2" />
			</template>

			<template #item.currency="{ item }">
				<v-img
					v-if="getLogo(item.currency)"
					class="elevation-0 d-inline-flex vertical-middle"
					:src="getLogo(item.currency)"
					max-height="22"
					max-width="22"
				/>

				<v-avatar class="white--text subtitle-2" :color="item.color" size="22" v-else>
					{{ item.currency.charAt(0) }}
				</v-avatar>

				<span class="ml-1">{{ item.currency }}</span>
			</template>

			<template #item.created_at="{ item }">
				<span>{{ getDate(item.created_at) }}</span>
			</template>

			<template #item.amount="{ item }">
				<span>{{ BigNumber(item.amount) }}</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import randomColor from 'randomcolor';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import filters from '@/components/filters/RefPayments.vue';

export default {
	name: 'RefPayments',
	components: {
		filters,
	},
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
		};
	},

	computed: {
    ...mapState('trading', ['all_currencies','allCurrencyListInit']),
    ...mapState('app', ['product']),
    is_show_filters() {
      return this.product.filters_all_expanded
    },
		headers() {
			return [
				{ text: 'ID', value: 'id' },
				{ text: this.$t('table_header.date'), value: 'created_at' },
				{ text: this.$t('table_header.follower'), value: 'name' },
				{ text: this.$t('table_header.percent'), value: 'percent' },
				{ text: this.$t('table_header.currency'), value: 'currency' },
				{ text: this.$t('table_header.amount'), value: 'amount' },
			];
		},
    currencies() {
      return this.allCurrencyListInit ? this.all_currencies : []
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
		BigNumber(item) {
			return BigNumber(item).toString();
		},
		getLogo(currency) {
			return this.currencies.find(item => item.currency === currency).logo;
		},
		getDate(date) {
			return date ? this.$moment(date).format('YYYY-MM-DD HH:mm:ss') : '-';
		},
		getRandomColor() {
			return randomColor({
				luminosity: 'dark',
				format: 'rgba',
				alpha: 0.5,
			});
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
				let self = this;
				_.forEach(items, function(value) {
					_.assign(value, { color: self.getRandomColor() });
				});
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
						start: this.$moment()
							.startOf('month')
							.format('YYYY-MM-DD'),
						end: this.$moment().format('YYYY-MM-DD'),
					},
				};
				_.assign(parameters, dates);
			}
			const response = await axios.get('/trader/ext/all_ref_payments', {
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
