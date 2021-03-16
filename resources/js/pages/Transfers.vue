<template>
	<v-card class="transfers flex-grow-1">
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
			caption="Internal transfers"
		>
			<template v-slot:top>
				<filters
					:all_sides="sides"
					:all_currencies="currencies"
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
					@toggleFiltersShow="toggleFiltersShow"
				/>
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

			<template v-slot:item.side="{ item }">
				<span>{{ getSideName(item.side) }}</span>
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

import filters from '../components/filters/Transfers';

export default {
	name: 'Transfers',

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
				{ text: 'Direction', value: 'side' },
				{ text: 'Currency', value: 'currency' },
				{ text: 'Amount', value: 'amount' },
			],
			footer_props: {
				'items-per-page-options': [30, 50, 100, 500],
				'items-per-page-all-text': '500',
			},
			sides: [
				{ value: false, name: 'From safe to trade wallet' },
				{ value: true, name: 'From trade to safe wallet' },
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

	computed: {
		calculateTableHeight() {
			const width = this.$vuetify.breakpoint.width;
			const isMediumBreakpoint = width < 1264 && width > 960;
			const diffBetweenLargeAndMediumFooter = 11;

			const fullPageWithOpenFilters = 'calc(100vh - 458px)';
			const fullPageWithoutOpenFilters = 'calc(100vh - 241px)';
			const fullMediumPageWithOpenFilters = `calc(100vh - 458px - ${diffBetweenLargeAndMediumFooter}px)`;
			const fullMediumPageWithoutOpenFilters = `calc(100vh - 241px - ${diffBetweenLargeAndMediumFooter}px)`;

			if (isMediumBreakpoint) {
				if (this.isFiltersShow) return fullMediumPageWithOpenFilters;
				else return fullMediumPageWithoutOpenFilters;
			} else {
				if (this.isFiltersShow) return fullPageWithOpenFilters;
				else return fullPageWithoutOpenFilters;
			}
		},
	},

	methods: {
		BigNumber: function(item) {
			return BigNumber(item).toString();
		},
		getDate(date) {
			return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '-';
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
					.get('/trader/ext/all_transfers', {
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

<style scoped></style>
