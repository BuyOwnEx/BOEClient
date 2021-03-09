<template>
	<v-card class="orders flex-grow-1">
		<v-data-table
			class="pa-2"
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
			caption="Orders"
		>
			<template v-slot:top>
				<filters
					v-on:apply-table-filter="onFilterApply"
					v-on:reset-table-filter="onFilterReset"
					v-on:table-filter="onUseFilter"
					:all_sides="sides"
					:all_types="types"
					:all_statuses="statuses"
				/>

				<v-divider />

				<v-toolbar flat dense height="42">
					<v-toolbar-title>{{ tableCaption }}</v-toolbar-title>
					<v-spacer />
				</v-toolbar>
			</template>

			<template v-slot:item.pair="{ item }">
				<v-avatar :color="item.color" size="32">
					<span class="white--text subtitle-2">
						{{ item.currency.charAt(0) + item.market.charAt(0) }}
					</span>
				</v-avatar>
				<span class="ml-1">{{ item.currency }}/{{ item.market }}</span>
			</template>

			<template v-slot:item.type="{ item }">
				<span>{{ getTypeName(item.type) }}</span>
			</template>

			<template v-slot:item.status="{ item }">
				<span>{{ getStatusName(item.status) }}</span>
			</template>

			<template v-slot:item.side="{ item }">
				<span>{{ getSideName(item.side) }}</span>
			</template>

			<template v-slot:item.created_at="{ item }">
				<span>{{ getDateFromTick(item.created_at) }}</span>
			</template>

			<template v-slot:item.size="{ item }">
				<span>{{ BigNumber(item.size) + ' ' + item.currency }}</span>
			</template>

			<template v-slot:item.price="{ item }">
				<span>{{ BigNumber(item.price) + ' ' + item.market }}</span>
			</template>

			<template v-slot:item.actual_size="{ item }">
				<span>
					{{ BigNumber(item.actual_size) + ' ' + item.currency }}
				</span>
			</template>
			<template v-slot:item.volume="{ item }">
				<span>
					{{ getVolume(item.size, item.price) + ' ' + item.market }}
				</span>
			</template>
			<template v-slot:item.actualVolume="{ item }">
				<span>
					{{ getVolume(item.actual_size, item.price) + ' ' + item.market }}
				</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
import moment from 'moment';
import randomColor from 'randomcolor';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import filters from '../components/filters/Orders';

export default {
	name: 'Orders',

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
			headers: [
				{ text: 'ID', value: 'id' },
				{ text: 'Date', value: 'created_at' },
				{ text: 'Pair', value: 'pair', sortable: false },
				{ text: 'Type', value: 'type' },
				{ text: 'Size', value: 'size' },
				{ text: 'Actual size', value: 'actual_size' },
				{ text: 'Price', value: 'price' },
				{ text: 'Volume', value: 'volume', sortable: false },
				{ text: 'Actual volume', value: 'actualVolume', sortable: false },
				{ text: 'Status', value: 'status' },
				{ text: 'Side', value: 'side' },
			],
			footer_props: {
				'items-per-page-options': [30, 50, 100, 500],
				'items-per-page-all-text': '500',
			},
			types: [
				{ value: 'LIMIT', name: 'Limit order' },
				{ value: 'MARKET', name: 'Market order' },
				{ value: 'STOPLOSS', name: 'Stop loss order' },
				{ value: 'TAKEPROFIT', name: 'Take profit order' },
				{ value: 'TRAILINGSTOP', name: 'Trailing stop order' },
			],
			statuses: [
				{ value: 'filled', name: 'Filled' },
				{ value: 'partiallyFilled', name: 'Partially filled' },
				{ value: 'accepted', name: 'Accepted' },
				{ value: 'cancelled', name: 'Cancelled' },
			],
			sides: [
				{ value: true, name: 'Sell' },
				{ value: false, name: 'Buy' },
			],
		};
	},

	computed: {
		pairs() {
			return this.$store.state.tickers.markets;
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
		getVolume(size, price) {
			return BigNumber(size)
				.multipliedBy(BigNumber(price))
				.toString();
		},
		getDateFromTick(date) {
			return date
				? moment
						.unix(
							BigNumber(date)
								.div(10000000)
								.absoluteValue()
								.minus(62135596800)
								.toNumber()
						)
						.format('YYYY-MM-DD HH:mm:ss')
				: '-';
		},
		getTypeName(type) {
			let index = _.findIndex(this.types, item => item.value === type);
			return this.types[index].name;
		},
		getStatusName(status) {
			let index = _.findIndex(this.statuses, item => item.value === status);
			return this.statuses[index].name;
		},
		getSideName(side) {
			let index = _.findIndex(this.sides, item => item.value === side);
			return this.sides[index].name;
		},
		getRandomColor: function() {
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
					.get('/trader/ext/all_orders', {
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
	},
};
</script>

<style scoped></style>
