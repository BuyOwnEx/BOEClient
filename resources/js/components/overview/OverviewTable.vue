<template>
	<v-card class="overview-table">
		<v-data-table
			class="pa-0 py-2 pa-sm-2"
			:caption="tableTitle"
			:headers="headers"
			:items="tickersList"
			:disable-pagination="true"
			:hide-default-footer="true"
			dense
		>
			<template v-slot:item.pair="{ item }">
				<span class="overview-table__item--pair">
					<a :href="item.pairLink" target="_blank">
						{{ item.pairName }}
					</a>
				</span>
			</template>

			<template v-slot:item.best_bid="{ item }">
				<span>
					{{ BigNumber(item.bid).toString() }}
					{{ item.market.toUpperCase() }}
				</span>
			</template>

			<template v-slot:item.best_ask="{ item }">
				<span>
					{{ BigNumber(item.ask).toString() }}
					{{ item.market.toUpperCase() }}
				</span>
			</template>

			<template v-slot:item.latest_price="{ item }">
				<span>
					{{ BigNumber(item.latest).toString() }}
					{{ item.market.toUpperCase() }}
				</span>
			</template>

			<template v-slot:item.change24="{ item }">
				<span v-if="item.changePercent < 0">
					<v-icon color="error" x-small>mdi-arrow-down</v-icon>
					<span class="text-danger"> {{ item.changePercent }}%</span>
				</span>
				<span v-else-if="item.changePercent > 0">
					<v-icon color="success" x-small>mdi-arrow-up</v-icon>
					<span class="text-success"> +{{ item.changePercent }}%</span>
				</span>
				<span v-else>
					<v-icon class="text-secondary" x-small>mdi-minus</v-icon>
					<span> 0%</span>
				</span>
			</template>

			<template v-slot:item.min24="{ item }">
				<span>
					{{ BigNumber(item.min).toString() }}
					{{ item.market.toUpperCase() }}
				</span>
			</template>

			<template v-slot:item.max24="{ item }">
				<span>
					{{ BigNumber(item.max).toString() }}
					{{ item.market.toUpperCase() }}
				</span>
			</template>

			<template v-slot:item.volume24="{ item }">
				<span>
					{{ formatWithScaleInAllCurrencies(item.volume, item.market) }}
					{{ item.market.toUpperCase() }}
				</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import formatWithScaleInAllCurrencies from '../../mixins/format/formatWithScaleInAllCurrencies';

export default {
	name: 'OverviewTable',

	mixins: [formatWithScaleInAllCurrencies],

	data() {
		return {
			headers: [
				{ text: this.$t('trading.pair'), value: 'pair' },
				{
					text: this.$t('trading.forms.best_bid'),
					value: 'best_bid',
				},
				{
					text: this.$t('trading.forms.best_ask'),
					value: 'best_ask',
				},
				{
					text: this.$t('trading.last_price'),
					value: 'latest_price',
				},
				{
					text: this.$t('trading.daily_change'),
					value: 'change24',
				},
				{
					text: this.$t('trading.daily_low'),
					value: 'min24',
				},
				{
					text: this.$t('trading.daily_high'),
					value: 'max24',
				},
				{
					text: this.$t('trading.daily_volume'),
					value: 'volume24',
				},
			],
		};
	},

	computed: {
		tickersFromStorage() {
			return this.$store.state.tickers.tickersList;
		},
		tickersList() {
			if (this.tickersFromStorage === null) {
				return [];
			}
			return _.map(this.tickersFromStorage, item => {
				let change = BigNumber(item.latest).minus(BigNumber(item.previous_day));
				let changePercent = 0;
				if (!change.isZero()) {
					if (BigNumber(item.previous_day).isZero()) {
						changePercent = 100;
					} else {
						changePercent = change.multipliedBy(100).div(BigNumber(item.previous_day));
					}
				}
				return {
					pairName: item.currency.toUpperCase() + '/' + item.market.toUpperCase(),
					pairLink: '/trading/' + item.market.toUpperCase() + '/' + item.currency.toUpperCase(),
					bid: item.bid,
					ask: item.ask,
					min: item.min,
					max: item.max,
					market: item.market,
					currency: item.currency,
					margin: item.margin,
					volume: item.volume,
					latest: item.latest,
					change: change.toFixed(item.scale),
					changePercent: changePercent.toFixed(2),
				};
			});
		},

		tableTitle() {
			return this.$t('overview.table_title');
		},
	},

	methods: {
		BigNumber(item) {
			return BigNumber(item);
		},
	},
};
</script>

<style scoped lang="sass">
.overview-table
	span
		display: flex
		align-items: center
	&__item
		&--pair a
			text-decoration: none
			font-weight: bold
			color: unset

	::v-deep.v-data-table table
		table-layout: fixed !important
</style>
