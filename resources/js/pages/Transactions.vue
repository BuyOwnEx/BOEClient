<template>
	<v-container fluid>
		<v-row align="start" justify="center">
			<v-col cols="12" class="text-center">
				<v-card>
					<v-data-table
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
						class="pr-4 pl-4"
					>
						<template v-slot:top>
							<filters
								v-on:apply-table-filter="onFilterApply"
								v-on:reset-table-filter="onFilterReset"
								v-on:table-filter="onUseFilter"
								:all_types="types"
								:all_statuses="statuses"
								:all_currencies="currencies"
							/>

							<v-divider />

							<v-toolbar flat dense height="42">
								<v-toolbar-title>{{ tableCaption }}</v-toolbar-title>
								<v-spacer />
							</v-toolbar>
						</template>

						<template v-slot:item.currency="{ item }">
							<v-avatar :color="item.color" size="32" v-if="!item.logo">
								<v-img
									v-if="item.logo"
									class="elevation-6"
									:src="getImage(item.logo)"
								/>
								<span v-else class="white--text subtitle-2">
									{{ item.currency.charAt(0) }}
								</span>
							</v-avatar>
							<v-img
								v-else
								class="elevation-0 d-inline-flex"
								style="vertical-align: middle"
								:src="getImage(item.logo)"
								max-height="32"
								max-width="32"
							/>
							<span class="ml-1">{{ item.currency }}</span>
						</template>

						<template v-slot:item.type="{ item }">
							<span>{{ getTypeName(item.type) }}</span>
						</template>

						<template v-slot:item.status="{ item }">
							<span>{{ getStatusName(item.status) }}</span>
						</template>

						<template v-slot:item.created_at="{ item }">
							<span>{{ getDate(item.created_at) }}</span>
						</template>

						<template v-slot:item.amount="{ item }">
							<span>{{ BigNumber(item.amount) }}</span>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import BigNumber from 'bignumber.js';
import moment from 'moment';
import randomColor from 'randomcolor';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import filters from '../components/filters/Transactions';

export default {
	name: 'Transactions',

	components: {
		filters,
	},

	data() {
		return {
			tableCaption: 'Crypto transactions',
			totalItems: 0,
			items: [],
			loading: true,
			options: {},
			itemsPerPage: 30,
			sortBy: 'id',
			sortDesc: true,
			headers: [
				{ text: 'ID', value: 'id' },
				{ text: 'Date', value: 'created_at' },
				{ text: 'Type', value: 'type' },
				{ text: 'Currency', value: 'currency' },
				{ text: 'Amount', value: 'amount' },
				{ text: 'Address', value: 'address' },
				{ text: 'Trx Hash', value: 'txid' },
				{ text: 'Approves', value: 'confirmations' },
				{ text: 'Status', value: 'status' },
			],
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
			return this.types[index].name;
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
				const total = result.data.length;
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
			try {
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
				const response = await axios
					.get('/trader/ext/all_transactions', {
						params: parameters,
					})
					.catch(function(error) {
						console.log(error);
					})
					.finally(function() {
						// always executed
					});
				return response.data;
			} catch (error) {
				console.error(error);
			}
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

	mounted() {
		axios.get('/trader/ext/crypto_currencies').then(response => {
			this.currencies = response.data.data;
		});
	},
};
</script>

<style scoped></style>
