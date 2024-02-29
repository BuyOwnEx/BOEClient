<template>
	<v-card class="fiat-transactions">
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
			:caption="$t('reports.fiat_transactions_title')"
			dense
		>
			<template #top>
				<filters
					:all_types="types"
					:all_payment_types="gateways"
					:all_currencies="currencies"
					:all_statuses="statuses"
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

				<v-avatar v-else class="white--text subtitle-2" :color="item.color" size="22">
					{{ item.currency.charAt(0) }}
				</v-avatar>

				<span class="ml-1">{{ item.currency }}</span>
			</template>

			<template #item.type="{ item }">
				<span :class="item.type === true ? 'success--text' : 'error--text'">
					{{ getTypeName(item.type) }}
				</span>
			</template>

			<template #item.status="{ item }">
				<span :class="getStatusColorClass(item.status)">
					{{ getStatusName(item.status) }}
				</span>
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
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
import filters from '@/components/filters/FiatTransactions.vue';
import randomColor from 'randomcolor';

export default {
	name: 'FiatTransactions',

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
			statuses: [
				{ value: 'done', name: 'Executed' },
				{ value: 'wait', name: 'Pending' },
				{ value: 'new', name: 'Waiting' },
				{ value: 'accepted', name: 'Accepted' },
				{ value: 'fail', name: 'Failed' },
			],
			types: [
				{ value: false, name: 'Withdrawal' },
				{ value: true, name: 'Replenish' },
			],
			gateways: [
          { id: 1, name: this.$t('gateways.bank_details') }
      ],
		};
	},

	computed: {
    ...mapState('trading', ['all_currencies','allCurrencyListInit']),
		headers() {
			return [
				{ text: 'ID', value: 'id' },
				{ text: this.$t('table_header.date'), value: 'created_at' },
				{ text: this.$t('table_header.type'), value: 'type' },
				{ text: this.$t('table_header.gateway'), value: 'payment_type' },
				{ text: this.$t('table_header.currency'), value: 'currency' },
				{ text: this.$t('table_header.amount'), value: 'amount' },
				{ text: this.$t('table_header.operation_id'), value: 'txid' },
				{ text: this.$t('table_header.status'), value: 'status' },
			];
		},
    currencies() {
      return this.allCurrencyListInit ? _.filter(this.all_currencies,item => item.type === 'fiat') : []
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
		getTypeName(type) {
			let index = _.findIndex(this.types, item => item.value === type);
			return this.types[index]?.name;
		},
		getStatusName(status) {
			let index = _.findIndex(this.statuses, item => item.value === status);
			return this.statuses[index]?.name;
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
                this.$moment()
								.startOf('month')
								.format('YYYY-MM-DD') +
							' ' +
							'00:00:00',
						end: this.$moment().format('YYYY-MM-DD') + ' ' + '23:59:59',
					},
				};
				_.assign(parameters, dates);
			}
			const response = await axios.get('/trader/ext/all_fiat_transactions', {
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

		getStatusColorClass(status) {
			if (status === 'done') return 'success--text';
			else if (status === 'wait' || status === 'new') return 'warning--text';
			else if (status === 'fail') return 'error--text';
			else return '';
		},

		toggleFiltersShow() {
			this.isFiltersShow = !this.isFiltersShow;
		},
	},
};
</script>
