<template>
	<v-card class="deals flex-grow-1">
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
			:style="{ 'min-height': calculateTableHeight }"
			caption="Deals"
		>
			<template v-slot:top>
				<filters
					:all_sides="sides"
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
					@toggleFiltersShow="toggleFiltersShow"
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

			<template v-slot:item.volume="{ item }">
				<span>
					{{ getVolume(item.size, item.price) + ' ' + item.market }}
				</span>
			</template>

			<template v-slot:item.fee="{ item }">
				<span v-if="item.side">
					{{ BigNumber(item.fee) + ' ' + item.market }}
				</span>
				<span v-else>{{ BigNumber(item.fee) + ' ' + item.currency }}</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
import moment from 'moment';
import randomColor from 'randomcolor';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import filters from '../components/filters/Deals';

export default {
	name: 'Deals',

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
			headers: [
				{ text: 'ID', value: 'id' },
				{ text: 'Date', value: 'created_at' },
				{ text: 'Pair', value: 'pair', sortable: false },
				{ text: 'Order', value: 'orderId', sortable: false },
				{ text: 'Fee', value: 'fee' },
				{ text: 'Size', value: 'size' },
				{ text: 'Price', value: 'price' },
				{ text: 'Volume', value: 'volume', sortable: false },
				{ text: 'Side', value: 'side' },
			],
			footer_props: {
				'items-per-page-options': [30, 50, 100, 500],
				'items-per-page-all-text': '500',
			},
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
		calculateTableHeight() {
			const width = this.$vuetify.breakpoint.width;
			const isMediumBreakpoint = width < 1264 && width > 960;
			const diffBetweenLargeAndMediumFooter = 11;

			const fullPageWithOpenFilters = 'calc(100vh - 504px)';
			const fullPageWithoutOpenFilters = 'calc(100vh - 284px)';
			const fullMediumPageWithOpenFilters = `calc(100vh - 504px - ${diffBetweenLargeAndMediumFooter}px)`;
			const fullMediumPageWithoutOpenFilters = `calc(100vh - 284px - ${diffBetweenLargeAndMediumFooter}px)`;

			if (isMediumBreakpoint) {
				if (this.isFiltersShow) return fullMediumPageWithOpenFilters;
				else return fullMediumPageWithoutOpenFilters;
			} else {
				if (this.isFiltersShow) return fullPageWithOpenFilters;
				else return fullPageWithoutOpenFilters;
			}
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
		getSideName(side) {
			let index = _.findIndex(this.sides, item => item.value === side);
			return this.sides[index].name;
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
					.get('/trader/ext/all_deals', {
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

		toggleFiltersShow() {
			this.isFiltersShow = !this.isFiltersShow;
		},
	},
};
</script>

<style scoped></style>
