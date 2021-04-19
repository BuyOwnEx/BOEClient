<template>
	<v-card class="overview-depth-graph">
		<v-col class="pa-2" cols="12">
			<v-select
				v-model="sp"
				:items="pairs"
				:label="$t('overview.select_pair')"
				:hint="$t('overview.select_pair_hint')"
				item-text="name"
				item-value="id"
				persistent-hint
				hide-details
				@change="changePair"
			>
				<template slot="item" slot-scope="data">
					<template v-if="typeof data.item !== 'object'">
						<v-list-item-content>
							{{ data.item }}
						</v-list-item-content>
					</template>

					<template v-else>
						<v-list-item-content>
							<v-list-item-title>
								{{ data.item.name }}
							</v-list-item-title>
						</v-list-item-content>
					</template>
				</template>
			</v-select>
		</v-col>

		<highcharts class="overview-depth-graph__graph" :options="options" ref="depth_chart" />
	</v-card>
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import Highcharts from 'highcharts';
import highchartsTheme from 'highcharts/themes/grid-light';
highchartsTheme(Highcharts);

export default {
	name: 'MarketDepthGraph',

	props: {
		currency: {
			type: String,
			required: true,
		},
		market: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			graphHeight: 450,
			sp: 1,
			options: {
				chart: {
					animation: false,
					type: 'area',
					style: {
						fontFamily: '"Quicksand","Roboto", sans-serif',
						letterSpacing: '0.0071428571em',
						fontSize: '11px',
					},
					height: 450,
					spacing: [10, 10, 10, 10],
				},
				credits: {
					enabled: false,
				},
				title: {
					text: this.graphTitle(),
				},
				xAxis: [
					{
						type: 'logarithmic',
						title: {
							text: this.$t('trading.rate'),
						},
						width: '50%',
						labels: {
							style: {
								color: 'green',
							},
						},
					},
					{
						type: 'logarithmic',
						title: {
							text: this.$t('trading.rate'),
						},
						labels: {
							style: {
								color: 'red',
							},
						},
						offset: 0,
						left: '50%',
						width: '50%',
					},
				],
				yAxis: {
					gridLineWidth: 0,
					title: {
						text: this.$t('trading.volume'),
					},
				},
				legend: {
					enabled: false,
				},
				plotOptions: {
					area: {
						softThreshold: true,
						marker: {
							radius: 2,
						},
						lineWidth: 2,
						states: {
							hover: {
								lineWidth: 3,
							},
						},
						threshold: null,
					},
				},
				tooltip: {
					shared: true,
					useHTML: true,
					headerFormat: '<table>',
					pointFormat:
						'<tr><td>' +
						this.$t('trading.rate') +
						':</td><td style="text-align: right;">{point.x}</td></tr><tr><td>' +
						this.$t('trading.volume') +
						':</td><td style="text-align: right;">{point.y}</td></tr>',
					footerFormat: '</table>',
					valueDecimals: 2,
				},

				series: [
					{
						name: 'Bids',
						data: [],
						color: '#19f4bb',
						fillColor: '#06d6a0',
						xAxis: 0,
					},
					{
						name: 'Asks',
						data: [],
						color: '#ff6388',
						fillColor: '#ef476f',
						xAxis: 1,
					},
				],
			},
		};
	},

	computed: {
		selectedPair() {
			return this.$store.getters['trading/selectedPair'];
		},
		markets() {
			return this.$store.state.tickers.markets;
		},
		pairs() {
			let result = [];
			_.forEach(this.markets, function(value, key) {
				result.push({ header: key });
				_.forEach(value, function(item, key2) {
					result.push({
						id: item.id,
						name: item.currency + '/' + item.market,
						group: item.market,
					});
				});
				result.push({ divider: true });
			});
			return result;
		},
	},

	methods: {
		changePair(data) {
			console.log(data);
			const market = this.pairs ? _.find(this.pairs, item => item.id === data) : null;
			if (!market) {
				const pair = market.name.split('/');
				this.$store.commit('trading/setPair', {
					currency: pair[0],
					market: pair[1],
				});
			}
		},
		updateDepthHandler(data) {
			let depth_chart = this.$refs.depth_chart;
			if (data.asks_list) {
				let askData = data.asks_list;
				let askDataGraph = new Array(askData.length);
				let askDepthTotal = 0;
				for (let i = 0; i < askData.length; i++) {
					askDepthTotal += askData[i]['actualSize'];
					askDataGraph[i] = [askData[i]['price'], askDepthTotal];
				}
				depth_chart.chart.series[1].setData(askDataGraph, false);
			}
			if (data.bids_list) {
				let bidData = data.bids_list;
				let bidDataGraph = new Array(bidData.length);
				let bidDepthTotal = 0;
				for (let j = 0; j < bidData.length; j++) {
					bidDepthTotal += bidData[j]['actualSize'];
					bidDataGraph[j] = [bidData[j]['price'], bidDepthTotal];
				}
				depth_chart.chart.series[0].setData(bidDataGraph, false);
			}
			depth_chart.chart.redraw();
		},
	},

	mounted() {
		this.$eventHub.$on('updateDepth', this.updateDepthHandler);
	},
};
</script>
