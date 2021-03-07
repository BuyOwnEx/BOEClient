<template>
	<v-card>
		<v-data-table
			class="elevation-1 pa-4"
			caption="Market overview"
			:calculate-widths="true"
			:headers="headers"
			:items="tickersList"
			:disable-pagination="true"
			:hide-default-footer="true"
			dense
		>
			<template v-slot:item.pair="{ item }">
				<span>
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
					<span class="fa fa-caret-down text-danger"></span>
					<span class="text-danger"> {{ item.changePercent }}%</span>
				</span>
				<span v-else-if="item.changePercent > 0">
					<span class="fa fa-caret-up text-success"></span>
					<span class="text-success"> +{{ item.changePercent }}%</span>
				</span>
				<span v-else>
					<span class="fa fa-minus"></span>
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
					{{ BigNumber(item.volume).toString() }}
					{{ item.market.toUpperCase() }}
				</span>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
	name: 'MarketOverview',

	data() {
		return {
			headers: [
				{ text: this.$vuetify.lang.translator('trading.pair'), value: 'pair' },
				{
					text: this.$vuetify.lang.translator('trading.best_bid'),
					value: 'best_bid',
				},
				{
					text: this.$vuetify.lang.translator('trading.best_ask'),
					value: 'best_ask',
				},
				{
					text: this.$vuetify.lang.translator('trading.latest_price'),
					value: 'latest_price',
				},
				{
					text: this.$vuetify.lang.translator('trading.change24'),
					value: 'change24',
				},
				{
					text: this.$vuetify.lang.translator('trading.min24'),
					value: 'min24',
				},
				{
					text: this.$vuetify.lang.translator('trading.max24'),
					value: 'max24',
				},
				{
					text: this.$vuetify.lang.translator('trading.volume24'),
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
						changePercent = change
							.multipliedBy(100)
							.div(BigNumber(item.previous_day));
					}
				}
				return {
					pairName:
						item.currency.toUpperCase() + '/' + item.market.toUpperCase(),
					pairLink:
						'/trader/trading/' +
						item.market.toUpperCase() +
						'/' +
						item.currency.toUpperCase(),
					bid: item.bid,
					ask: item.ask,
					min: item.min,
					max: item.max,
					market: item.market,
					currency: item.currency,
					margin: item.margin,
					volume: item.volume,
					volumeReadable: BigNumber(item.volume)
						.dp(item.scale)
						.toString(),
					latest: item.latest,
					change: change.toFixed(item.scale),
					changePercent: changePercent.toFixed(2),
				};
			});
		},
	},
	methods: {
		BigNumber(item) {
			return BigNumber(item);
		},
	},
};
</script>

<style scoped></style>
