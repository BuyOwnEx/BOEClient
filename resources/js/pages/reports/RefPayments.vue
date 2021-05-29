<template>
	<v-card class="ref-payments">
		<v-data-table
			class="pa-1 pa-sm-2"
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
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
					@toggleFiltersShow="toggleFiltersShow"
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
import BigNumber from 'bignumber.js';
import moment from 'moment';
import randomColor from 'randomcolor';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import filters from '../../components/filters/RefPayments';

export default {
	name: 'RefPayments',

	components: {
		filters,
	},

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
			currencies: [],
		};
	},

	computed: {
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
			return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '-';
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
						start: moment()
							.startOf('month')
							.format('YYYY-MM-DD'),
						end: moment().format('YYYY-MM-DD'),
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

		toggleFiltersShow() {
			this.isFiltersShow = !this.isFiltersShow;
		},
	},

	mounted() {
		axios.get('/trader/ext/all_currencies').then(response => {
			this.currencies = response.data.data;
		});
	},
};
</script>
