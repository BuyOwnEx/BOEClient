<template>
    <v-card>
        <v-col cols="12" md="12">
            <v-select
                    v-model="sp"
                    @change="changePair"
                    :items="pairs"
                    item-text="name"
                    item-value="id"
                    label="Select pair"
                    hint="Select pair from available options"
                    persistent-hint
                    hide-details="auto"
            >
                <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                        <v-list-item-content v-text="data.item"/>
                    </template>
                    <template v-else>
                        <v-list-item-content>
                            <v-list-item-title v-html="data.item.name"/>
                        </v-list-item-content>
                    </template>
                </template>
            </v-select>
        </v-col>
        <highcharts :options="options" ref="depth_chart"></highcharts>
    </v-card>
</template>

<script>
    import BigNumber from 'bignumber.js';
    BigNumber.config({EXPONENTIAL_AT: [-15, 20]});

    import Highcharts from 'highcharts'
    import highchartsTheme from 'highcharts/themes/grid-light';
    highchartsTheme(Highcharts);

    export default {
        name: "MarketDepthGraph",
        props: ['currency', 'market'],
        data () {
            return {
                graphHeight: 450,
                sp: 1,
                options: {
                    chart: {
                        type: 'area',
                        style: {
                            fontFamily: 'Roboto'
                        },
                        backgroundColor: '#ffffff',
                        height: this.graphHeight,
                        spacing: [10, 10, 10, 10],
                    },
                    credits: {
                        enabled: false,
                    },
                    title: {
                        text: 'Market depth',
                        style: {
                            color: '#000000'
                        }
                    },
                    xAxis: [{
                        type: 'logarithmic',
                        title: {
                            text: this.$vuetify.lang.translator('trading.rate'),
                            style: {
                                color: '#000000'
                            }
                        },
                        width: '50%',
                        labels: {
                            style: {
                                color: 'green'
                            }
                        }
                    }, {
                        type: 'logarithmic',
                        title: {
                            text: this.$vuetify.lang.translator('trading.rate'),
                            style: {
                                color: '#000000'
                            }
                        },
                        labels: {
                            style: {
                                color: 'red'
                            }
                        },
                        offset: 0,
                        left: '50%',
                        width: '50%'
                    }],
                    yAxis: {
                        gridLineWidth: 0,
                        title: {
                            text: this.$vuetify.lang.translator('trading.volume'),
                            style: {
                                color: '#000000'
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        area: {
                            softThreshold: true,
                            marker: {
                                radius: 2
                            },
                            lineWidth: 2,
                            states: {
                                hover: {
                                    lineWidth: 3
                                }
                            },
                            threshold: null
                        }
                    },
                    tooltip: {
                        shared: true,
                        useHTML: true,
                        headerFormat: '<table>',
                        pointFormat: '<tr><td>' + this.$vuetify.lang.translator('trading.rate') + ':</td><td style="text-align: right;">{point.x}</td></tr><tr><td>' + this.$vuetify.lang.translator('trading.volume') + ':</td><td style="text-align: right;">{point.y}</td></tr>',
                        footerFormat: '</table>',
                        valueDecimals: 2
                    },

                    series: [{
                        name: 'Bids',
                        data: [],
                        color: 'rgb(161,243,121)',
                        fillColor: 'rgba(161,243,121, 0.9)',
                        xAxis: 0
                    }, {
                        name: 'Asks',
                        data: [],
                        color: 'rgb(237,114,72)',
                        fillColor: 'rgba(237,114,72, 0.9)',
                        xAxis: 1
                    }]
                }
            }
        },
        computed: {
            selectedPair () {
                return this.$store.getters['trading/selectedPair'];
            },
            markets() {
                return this.$store.state.tickers.markets;
            },
            pairs () {
                let result = [];
                _.forEach(this.markets, function (value, key) {
                    result.push({header: key});
                    _.forEach(value, function(item, key2) {
                        result.push({id: item.id, name: item.currency+'/'+item.market, group: item.market});
                    });
                    result.push({divider: true});
                });
                return result
            }
        },
        methods: {
            changePair: function (data) {
                console.log(data);
                let market = this.pairs ? _.find(this.pairs, item => item.id === data) : null;
                if(market !== null)
                {
                    let pair = market.name.split('/');
                    this.$store.commit('trading/setPair', {currency: pair[0], market: pair[1]});
                }
            },
            updateDepthHandler: function (data) {
                let depth_chart = this.$refs.depth_chart;
                if(data.asks_list)
                {
                    let askData = data.asks_list;
                    let askDataGraph = new Array(askData.length);
                    let askDepthTotal = 0;
                    for (let i = 0; i < askData.length; i++) {
                        askDepthTotal += askData[i]['actualSize'];
                        askDataGraph[i] = [askData[i]['price'],askDepthTotal];
                    }
                    depth_chart.chart.series[1].setData(askDataGraph, false);
                    //this.options.series[1].data = askDataGraph;
                }
                if(data.bids_list)
                {
                    let bidData = data.bids_list;
                    let bidDataGraph = new Array(bidData.length);
                    let bidDepthTotal = 0;
                    for (let j = 0; j < bidData.length; j++) {
                        bidDepthTotal += bidData[j]['actualSize'];
                        bidDataGraph[j] = [bidData[j]['price'],bidDepthTotal];
                    }
                    depth_chart.chart.series[0].setData(bidDataGraph, false);
                    //this.options.series[0].data = bidDataGraph;
                }
                depth_chart.chart.redraw();
            }
        },
        mounted: function () {
            //this.getGraph(this.currency, this.market);
            this.$eventHub.$on('updateDepth', this.updateDepthHandler);
        },
    }
</script>

<style scoped>

</style>