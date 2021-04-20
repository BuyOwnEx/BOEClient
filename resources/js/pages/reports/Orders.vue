<template>
	<v-card class="orders">
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
			:caption="$t('reports.orders_title')"
			dense
		>
			<template v-slot:top>
				<filters
					:all_sides="sides"
					:all_types="types"
					:all_statuses="statuses"
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
					@toggleFiltersShow="toggleFiltersShow"
				/>
				<v-divider class="pb-2" />
			</template>

			<template v-slot:item.pair="{ item }">
				<v-avatar :color="item.color" size="22">
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
				<span :class="getStatusClassColor(item.status)">
					{{ getStatusName(item.status) }}
				</span>
			</template>

			<template v-slot:item.side="{ item }">
				<span :class="item.side === false ? 'success--text' : 'error--text'">
					{{ getSideName(item.side) }}
				</span>
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

import filters from '../../components/filters/Orders';

export default {
	name: 'Orders',

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
		headers() {
			return [
				{ text: 'ID', value: 'id' },
				{ text: this.$t('table_header.date'), value: 'created_at' },
				{ text: this.$t('table_header.pair'), value: 'pair', sortable: false },
				{ text: this.$t('table_header.type'), value: 'type' },
				{ text: this.$t('table_header.size'), value: 'size' },
				{ text: this.$t('table_header.actual_size'), value: 'actual_size' },
				{ text: this.$t('table_header.price'), value: 'price' },
				{ text: this.$t('table_header.volume'), value: 'volume', sortable: false },
				{ text: this.$t('table_header.actual_volume'), value: 'actualVolume', sortable: false },
				{ text: this.$t('table_header.status'), value: 'status' },
				{ text: this.$t('table_header.side'), value: 'side' }
			]
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
			const response = await axios.get('/trader/ext/all_orders', {
				params: parameters,
			});
			return response.data;
		},

		getStatusClassColor(status) {
			if (status === 'filled') return 'success--text';
			else if (status === 'partiallyFilled') return 'warning--text';
			else if (status === 'cancelled') return 'error--text';
			else return '';
		},

		toggleFiltersShow() {
			this.isFiltersShow = !this.isFiltersShow;
		},
	},
};
</script>
