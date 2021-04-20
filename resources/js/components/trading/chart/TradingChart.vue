<template>
	<highcharts :constructor-type="'stockChart'" :options="options" :highcharts="hcInstance" ref="candle" />
</template>

<script>
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import Highcharts from 'highcharts';
import loadStock from 'highcharts/modules/stock';
import indicators from 'highcharts/indicators/indicators-all';
import dragPanes from 'highcharts/modules/drag-panes';

import annotationsAdvanced from 'highcharts/modules/annotations-advanced';
import priceIndicator from 'highcharts/modules/price-indicator';
import fullScreen from 'highcharts/modules/full-screen';
import exportingInit from 'highcharts/modules/exporting';
import stockTools from 'highcharts/modules/stock-tools';

import highchartsTheme from 'highcharts/themes/grid-light';

loadStock(Highcharts);
indicators(Highcharts);
dragPanes(Highcharts);
annotationsAdvanced(Highcharts);
priceIndicator(Highcharts);
fullScreen(Highcharts);
exportingInit(Highcharts);
stockTools(Highcharts);
highchartsTheme(Highcharts);

export default {
	name: 'TradingChart',

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
			hcInstance: Highcharts,
			graphHeight: 400,
			chartInFullscreen: false,
			candle_period: '1m',
			valuesToDisplay: 97,
			maxCandles: 501,
			options: {
				time: {
					timezone: moment.tz.guess(),
				},
				chart: {
					style: {
						fontFamily: '"Quicksand", "Roboto", sans-serif',
						letterSpacing: '0.0071428571em',
						fontSize: '11px',
					},
					height: this.$vuetify.breakpoint.smAndDown ? this.calculateGraphHeight() : 400,
					spacing: [10, 10, 10, 10],
					events: {
						load() {
							setTimeout(() => {
								this.reflow();
							}, 100);
						},
					},
				},
				credits: {
					enabled: false,
				},
				navigator: {
					height: 25,
					margin: 2,
					maskFill: 'rgba(102,133,194,0.3)',
					handles: {
						enabled: true,
					},
					enabled: true,
				},
				scrollbar: {
					enabled: false,
					height: 1 / 1,
					barBackgroundColor: 'transparent',
					barBorderColor: 'transparent',
					buttonArrowColor: 'transparent',
					buttonBackgroundColor: 'transparent',
					buttonBorderColor: 'transparent',
				},
				rangeSelector: {
					allButtonsEnabled: true,
					enabled: true,
					buttons: [
						{
							type: 'minute',
							index: 0,
							room: 1,
							count: 97,
							text: '1m',
							events: {
								click: e => {
									this.candle_period = '1m';
								},
							},
						},
						{
							type: 'minute',
							index: 1,
							room: 5,
							count: 97 * 5,
							text: '5m',
							events: {
								click: e => {
									this.candle_period = '5m';
								},
							},
						},
						{
							type: 'minute',
							index: 2,
							room: 15,
							count: 97 * 15,
							text: '15m',
							events: {
								click: () => {
									this.candle_period = '15m';
								},
							},
						},
						{
							type: 'minute',
							index: 3,
							room: 30,
							count: 97 * 30,
							text: '30m',
							events: {
								click: () => {
									this.candle_period = '30m';
								},
							},
						},
						{
							type: 'hour',
							index: 4,
							room: 60,
							count: 97,
							text: '1h',
							events: {
								click: () => {
									this.candle_period = '1h';
								},
							},
						},
						{
							type: 'hour',
							index: 5,
							room: 240,
							count: 97 * 4,
							text: '4h',
							events: {
								click: () => {
									this.candle_period = '4h';
								},
							},
						},
						{
							type: 'day',
							index: 6,
							room: 1440,
							count: 97,
							text: '1d',
							events: {
								click: () => {
									this.candle_period = '1d';
								},
							},
						},
						{
							type: 'day',
							index: 7,
							room: 10080,
							count: 97 * 7,
							text: '1w',
							events: {
								click: () => {
									this.candle_period = '1w';
								},
							},
						},
					],
					selected: 0,
					inputEnabled: false,
				},
				xAxis: {
					overscroll: 1 * 60 * 1000, // одна минута
					resize: {
						enabled: false,
					},
					range: 97 * 60 * 1000, // изначально данные показываем за 97 минут
					events: {
						setExtremes: _.debounce(e => {
							//
						}, 100),
					},
				},
				yAxis: [
					{
						labels: {
							align: 'right',
							x: -3,
							formatter() {
								return BigNumber(this.value).toString();
							},
						},
						title: {
							text: this.$t('trading.rate') + ', ' + this.market,
						},
						height: '75%',
						lineWidth: 1,
						floor: 0,
						offset: 35,
						resize: {
							enabled: true,
							lineWidth: 1,
						},
					},
					{
						id: 'volume',
						labels: {
							align: 'right',
							x: -3,
						},
						title: {
							text: this.$t('trading.volume') + ', ' + this.currency,
						},
						top: '75%',
						height: '25%',
						offset: 35,
						floor: 0,
						lineWidth: 1,
					},
				],
				tooltip: {
					split: true,
				},
				series: [
					{
						type: 'candlestick',
						id: 'main',
						name: this.$t('trading.rate') + ', ' + this.market,
						data: [],
						yAxis: 0,
						xAxis: 0,
						color: '#ef476f',
						lineColor: '#ef476f',
						upColor: '#06d6a0',
						upLineColor: '#06d6a0',
						tooltip: {
							pointFormatter() {
								return (
									'<span style="color:' +
									this.color +
									'">●</span> <b> ' +
									this.series.name +
									'</b><br/>Open: ' +
									BigNumber(this.open).toString() +
									'<br/>High: ' +
									BigNumber(this.high).toString() +
									'<br/>Low: ' +
									BigNumber(this.low).toString() +
									'<br/>Close: ' +
									BigNumber(this.close).toString() +
									'<br/>'
								);
							},
						},
					},
					{
						type: 'column',
						id: 'volume',
						linkedTo: 'main',
						name: this.$t('trading.volume') + ', ' + this.currency,
						data: [],
						yAxis: 1,
						xAxis: 0,
					},
				],
				navigation: {
					buttonOptions: {
						height: 34,
						width: 38,
						symbolSize: 20,
						symbolX: 19,
						symbolY: 17,
						symbolStrokeWidth: 2,
						x: -15,
					},
				},
				stockTools: {
					gui: {
						definitions: {
							typeChange: {
								items: ['typeCandlestick', 'typeLine', 'typeOHLC'],
							},
						},
						iconsURL: '/images/highcharts/',
					},
				},
			},
		};
	},

	computed: {
		pair() {
			return [this.currency, this.market];
		},
		selectedPeriodObject() {
			const period = this.candle_period;
			return _.find(this.options.rangeSelector.buttons, item => {
				return item.text === period.toLowerCase();
			});
		},
		candle_room() {
			return this.selectedPeriodObject.room;
		},
		candlePeriodIndex() {
			return this.selectedPeriodObject.index;
		},
	},

	methods: {
		calculateGraphHeight() {
			const deviceHeight = this.$vuetify.breakpoint.height;

			const header = 56;
			const marketInfo = 53;
			const pageContainerPaddings = 10;
			const tabs = 56;
			const footer = 58;

			return deviceHeight - header - marketInfo - pageContainerPaddings - tabs - footer;
		},
		monitoringFullMode() {
			if (document.addEventListener) {
				document.addEventListener('webkitfullscreenchange', this.exitHandler, false);
				document.addEventListener('mozfullscreenchange', this.exitHandler, false);
				document.addEventListener('fullscreenchange', this.exitHandler, false);
				document.addEventListener('MSFullscreenChange', this.exitHandler, false);
			}
		},
		exitHandler() {
			if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
				this.chartInFullscreen = false;
			} else {
				this.chartInFullscreen = true;
			}
		},
		initGraphDataHandler(data) {
			const candle = this.$refs.candle;
			const graphsToProcess = ['main'];
			candle.chart.series.forEach((item, i) => {
				const id = _.get(item, 'options.id', undefined);
				if (graphsToProcess.indexOf(id) !== -1) {
					candle.chart.series[i].setData(data.xData, false, false, false);
				}
			});
			candle.chart.series[1].setData(data.yData, false);
			const overscroll = Math.round(this.candle_room) * 60 * 1000;
			candle.chart.xAxis[0].update({
				range: this.valuesToDisplay * this.candle_room * 60 * 1000,
				overscroll,
			});
			candle.chart.redraw();
		},
		addPointHandler(data) {
			const candle = this.$refs.candle;
			const shift = candle.chart.series[0].options.data.length >= this.maxCandles;
			candle.chart.series[0].addPoint(
				{
					x: parseInt(data.point.x),
					open: data.point.close,
					high: data.point.close,
					low: data.point.close,
					close: data.point.close,
				},
				false,
				shift,
				true
			);
			candle.chart.series[1].addPoint(
				{
					x: parseInt(data.point.x),
					y: 0,
				},
				true,
				shift,
				true
			);
			candle.chart.redraw();
		},
		updatePointHandler(data) {
			const candle = this.$refs.candle;
			const candlesData = candle.chart.series[0].options.data;
			const volumeData = candle.chart.series[1].options.data;
			candlesData[candlesData.length - 1] = {
				x: parseInt(data.point.x),
				open: BigNumber(data.point.open).toNumber(),
				high: BigNumber(data.point.high).toNumber(),
				low: BigNumber(data.point.low).toNumber(),
				close: BigNumber(data.point.close).toNumber(),
			};
			volumeData[volumeData.length - 1] = {
				x: parseInt(data.point.x),
				y: BigNumber(data.point.volume).toNumber(),
			};
			const graphsToProcess = ['main'];
			candle.chart.series.forEach((item, i) => {
				const id = _.get(item, 'options.id', undefined);
				if (graphsToProcess.indexOf(id) !== -1) {
					candle.chart.series[i].setData(candlesData, false, false, false);
				}
			});
			candle.chart.series[1].setData(volumeData, false);
			candle.chart.redraw();
		},
	},

	watch: {
		chartInFullscreen(val, oldVal) {
			this.$nextTick(() => {
				const candle = this.$refs.candle;
				if (val === true) {
					candle.chart.setSize(undefined, null);
				} else {
					candle.chart.setSize(undefined, this.graphHeight);
				}
			});
		},
		pair(val) {
			const candle = this.$refs.candle;
			candle.chart.series.forEach((item, i) => {
				const id = _.get(item, 'options.id', undefined);
				if (id === 'main') {
					candle.chart.series[i].update({
						name: this.$t('trading.rate') + ', ' + val[1],
					});
				}
				if (id === 'volume') {
					candle.chart.series[i].update({
						name: this.$t('trading.volume') + ', ' + val[0],
					});
				}
			});
			candle.chart.yAxis[0].update({
				title: {
					text: this.$t('trading.rate') + ', ' + val[1],
				},
			});
			candle.chart.yAxis[1].update({
				title: {
					text: this.$t('trading.volume') + ', ' + val[0],
				},
			});
		},
		candle_period(val) {
			if ('localStorage' in window) {
				window.localStorage.setItem('tradingCandlePeriod', val);
			}
			this.$store.commit('trading/setGraphPeriod', val);
		},
	},

	created() {
		this.$nextTick(() => {
			window.candle = this.$refs.candle;
		});
		if ('localStorage' in window) {
			const candlePeriod = window.localStorage.getItem('tradingCandlePeriod');
			if (candlePeriod) {
				const candlePeriodObject = _.find(this.options.rangeSelector.buttons, item => {
					return item.text.toLowerCase() === candlePeriod.toLowerCase();
				});
				if (!candlePeriodObject) {
					this.candle_period = '1m';
					this.options.rangeSelector.selected = 0;
				} else {
					this.candle_period = candlePeriodObject.text;
					this.options.rangeSelector.selected = candlePeriodObject.index;
				}
			} else {
				this.candle_period = '1m';
				this.options.rangeSelector.selected = 0;
			}
		} else {
			this.candle_period = '1m';
			this.options.rangeSelector.selected = 0;
		}
		this.$store.commit('trading/setGraphPeriod', this.candle_period);
		this.$eventHub.$on('addedPoint', this.addPointHandler);
		this.$eventHub.$on('updatedPoint', this.updatePointHandler);
		this.$eventHub.$on('initGraphData', this.initGraphDataHandler);
	},

	mounted() {
		this.monitoringFullMode();
	},

	activated() {},
	deactivated() {},
};
</script>