<template>
	<highcharts :constructor-type="'stockChart'" :options="options" :highcharts="hcInstance" ref="candle" />
</template>

<script>
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

import { Chart } from 'highcharts-vue';
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
    components: {
        highcharts: Chart
    },
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
			chartInFullscreen: false,
			candle_period: '1m',
			valuesToDisplay: 97,
			maxCandles: 501,
			options: {
				time: {
          timezoneOffset: new Date().getTimezoneOffset()
        },
				chart: {
					style: {
						fontFamily: '"Quicksand", "Roboto", sans-serif',
						letterSpacing: '0.0071428571em',
						fontSize: '11px',
					},

					spacing: [10, 10, 10, 10],
					events: {
						load() {
              this.redraw();
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
                  return true;
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
                  return true;
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
                  return true;
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
                  return true;
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
                  return true;
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
                  return true;
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
                  return true;
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
                  return true;
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
							text: this.$t('table_header.rate') + ', ' + this.market,
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
							text: this.$t('table_header.volume') + ', ' + this.currency,
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
						name: this.$t('table_header.rate') + ', ' + this.market,
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
						name: this.$t('table_header.volume') + ', ' + this.currency,
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
						iconsURL: '/resources/js/assets/images/highcharts/',
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
    leaveHandler() {
      this.$eventHub.$off('addedPoint', this.addPointHandler);
      this.$eventHub.$off('updatedPoint', this.updatePointHandler);
      this.$eventHub.$off('initGraphData', this.initGraphDataHandler);
      this.$eventHub.$off('chartLeave', this.leaveHandler);
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
			this.chartInFullscreen = !(!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement);
		},
		initGraphDataHandler(data) {
      if (this.$refs.candle)
      {
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
        if (data.xData.length > this.valuesToDisplay)
          candle.chart.xAxis[0].setExtremes(data.xData[data.xData.length - this.valuesToDisplay - 1].x, data.xData[data.xData.length - 1].x);
        else
          candle.chart.xAxis[0].setExtremes(data.xData[0].x, data.xData[data.xData.length - 1].x);
        setTimeout(() => {
          candle.chart.redraw();
          candle.chart.reflow();
        }, 200);
      }
		},
		addPointHandler(data) {
      if (this.$refs.candle)
      {
        const candle = this.$refs.candle;
        const shift = candle.chart.series[0].options.data.length >= this.maxCandles;
        candle.chart.series[0].addPoint({
            x: parseInt(data.point.x),
            open: data.point.close,
            high: data.point.close,
            low: data.point.close,
            close: data.point.close,
        }, false, shift, true);
        candle.chart.series[1].addPoint({
            x: parseInt(data.point.x),
            y: 0,
        }, true, shift, true);
        candle.chart.redraw();
      }
		},
		updatePointHandler(data) {
      if (this.$refs.candle)
      {
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
      }
		},
	},

	watch: {
		chartInFullscreen(val, oldVal) {
			this.$nextTick(() => {
				const candle = this.$refs.candle;
				if (val === true) {
					candle.chart.redraw();
				} else {
          candle.chart.redraw();
				}
			});
		},
		pair(val) {
			const candle = this.$refs.candle;
			candle.chart.series.forEach((item, i) => {
				const id = _.get(item, 'options.id', undefined);
				if (id === 'main') {
					candle.chart.series[i].update({
						name: this.$t('table_header.rate') + ', ' + val[1],
					});
				}
				if (id === 'volume') {
					candle.chart.series[i].update({
						name: this.$t('table_header.volume') + ', ' + val[0],
					});
				}
			});
			candle.chart.yAxis[0].update({
				title: {
					text: this.$t('table_header.rate') + ', ' + val[1],
				},
			});
			candle.chart.yAxis[1].update({
				title: {
					text: this.$t('table_header.volume') + ', ' + val[0],
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
		this.$eventHub.$on('addedPoint', this.addPointHandler);
		this.$eventHub.$on('updatedPoint', this.updatePointHandler);
		this.$eventHub.$on('initGraphData', this.initGraphDataHandler);
    this.$eventHub.$on('chartLeave', this.leaveHandler);
	},

	mounted() {
		this.monitoringFullMode();
	},
};
</script>
