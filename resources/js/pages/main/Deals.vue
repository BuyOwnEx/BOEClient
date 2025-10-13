<template>
	<v-card class="deals">
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
			:caption="$t('reports.deals_title')"
			dense
		>
			<template #top>
				<filters
					:all_sides="sides"
          :is_show="is_show_filters"
					@apply-table-filter="onFilterApply"
					@reset-table-filter="onFilterReset"
					@table-filter="onUseFilter"
				/>
				<v-divider class="pb-2" />
			</template>

			<template #item.pair="{ item }">
				<v-avatar :color="item.color" size="22">
					<span class="white--text caption">
						{{ item.currency.charAt(0) + item.market.charAt(0) }}
					</span>
				</v-avatar>
				<span class="ml-1">{{ item.currency }}/{{ item.market }}</span>
			</template>

			<template #item.side="{ item }">
				<span :class="item.side === false ? 'success--text' : 'error--text'">
					{{ getSideName(item.side) }}
				</span>
			</template>

			<template #item.created_at="{ item }">
				<span>{{ getDateFromTick(item.created_at) }}</span>
			</template>

			<template #item.size="{ item }">
				<span>{{ BigNumber(item.size) + ' ' + item.currency }}</span>
			</template>

			<template #item.price="{ item }">
				<span>{{ BigNumber(item.price) + ' ' + item.market }}</span>
			</template>

			<template #item.volume="{ item }">
				<span>
					{{ getVolume(item.size, item.price) + ' ' + item.market }}
				</span>
			</template>

			<template #item.fee="{ item }">
				<span v-if="item.side">
					{{ BigNumber(item.fee) + ' ' + item.market }}
				</span>
				<span v-else>{{ BigNumber(item.fee) + ' ' + item.currency }}</span>
			</template>
      <template #item.fee_market="{ item }">
				<span v-if="item.side === false">
					{{ getVolume(item.fee, item.price) + ' ' + item.market }}
				</span>
        <span v-else>{{ BigNumber(item.fee) + ' ' + item.market }}</span>
      </template>
		</v-data-table>
	</v-card>
</template>
<script>
import randomColor from 'randomcolor';
import filters from '@/components/filters/Deals.vue';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });
export default {
	name: 'Deals',
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
			sides: [
				{ value: true, name: this.$t('deals.sides.sell') },
				{ value: false, name: this.$t('deals.sides.buy') },
			],
		};
	},
	computed: {
    ...mapState('app', ['product']),
    is_show_filters() {
      return this.product.filters_all_expanded
    },
    showing_fee_in_market() {
      return this.product.deals_show_fee_in_market
    },
		headers() {
			return [
				{ text: 'ID', value: 'id' },
				{ text: this.$t('table_header.date'), value: 'created_at' },
				{ text: this.$t('table_header.pair'), value: 'pair', sortable: false },
				{ text: this.$t('table_header.order'), value: 'order_id', sortable: false },
				{ text: this.$t('table_header.fee'), value: 'fee' },
        { text: this.$t('table_header.fee_market'), value: 'fee_market', sortable: false, align: !this.showing_fee_in_market ? ' d-none' : '' },
				{ text: this.$t('table_header.size'), value: 'size' },
				{ text: this.$t('table_header.price'), value: 'price' },
				{ text: this.$t('table_header.volume'), value: 'volume', sortable: false },
				{ text: this.$t('table_header.side'), value: 'side' },
			];
		},
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
				? this.$moment
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
			const response = await axios.get('/trader/ext/all_deals', {
				params: parameters,
			});
			return response.data;
		},
	},
};
</script>
