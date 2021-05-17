<template>
	<v-card class="transactions">
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
			:caption="$t('reports.crypto_transactions_title')"
			dense
		>
			<template v-slot:top>
				<filters
					:all_types="types"
					:all_statuses="statuses"
					:all_currencies="currencies"
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
					@toggleFiltersShow="toggleFiltersShow"
				/>
				<v-divider class="pb-2" />
			</template>

			<template v-slot:item.currency="{ item }">
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

			<template v-slot:item.type="{ item }">
				<span :class="item.type === true ? 'success--text' : 'error--text'">
					{{ getTypeName(item.type) }}
				</span>
			</template>

			<template v-slot:item.status="{ item }">
				<span :class="getStatusColorClass(item.status)">
					{{ getStatusName(item.status) }}
				</span>
			</template>

			<template v-slot:item.created_at="{ item }">
				<span>{{ getDate(item.created_at) }}</span>
			</template>

			<template v-slot:item.amount="{ item }">
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

import filters from '../../components/filters/Transactions';
import getUserCurrencyPropertyMixin from '../../mixins/common/getUserCurrencyPropertyMixin';

export default {
	name: 'Transactions',

	components: {
		filters,
	},

	mixins: [getUserCurrencyPropertyMixin],

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
			statuses: [
				{ value: 'done', name: 'Executed' },
				{ value: 'wait', name: 'Pending' },
				{ value: 'accepted', name: 'Accepted' },
			],
			types: [
				{ value: false, name: 'Withdrawal' },
				{ value: true, name: 'Replenish' },
			],
			currencies: [],
		};
	},

	computed: {
		headers() {
			return [
				{ text: 'ID', value: 'id' },
				{ text: this.$t('table_header.date'), value: 'created_at' },
				{ text: this.$t('table_header.type'), value: 'type' },
				{ text: this.$t('table_header.currency'), value: 'currency' },
				{ text: this.$t('table_header.amount'), value: 'amount' },
				{ text: this.$t('table_header.address'), value: 'address' },
				{ text: this.$t('table_header.trx_hash'), value: 'txid' },
				{ text: this.$t('table_header.approves'), value: 'confirmations' },
				{ text: this.$t('table_header.status'), value: 'status' },
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
		getDate(date) {
			return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '-';
		},
		getTypeName(type) {
			let index = _.findIndex(this.types, item => item.value === type);
			return this.types[index]?.name;
		},
		getStatusName(status) {
			let index = _.findIndex(this.statuses, item => item.value === status);
			return this.statuses[index].name;
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
						start:
							moment()
								.startOf('month')
								.format('YYYY-MM-DD') +
							' ' +
							'00:00:00',
						end: moment().format('YYYY-MM-DD') + ' ' + '23:59:59',
					},
				};
				_.assign(parameters, dates);
			}
			const response = await axios.get('/trader/ext/all_transactions', {
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

		getStatusColorClass(status) {
			if (status === 'done') return 'success--text';
			else if (status === 'wait') return 'warning--text';
			else return '';
		},
	},

	mounted() {
		axios.get('/trader/ext/crypto_currencies').then(response => {
			this.currencies = response.data.data;
		});
	},
};
</script>
