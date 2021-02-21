<template>
    <v-card>
        <v-expansion-panels v-model="panel" multiple flat>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    {{$vuetify.lang.translator('trading.headers.market_activity')}}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <div>
                        <table class="table">
                            <tbody>
                            <tr v-for="item in activityList">
                                <td>
                                    <span>{{ item.currency }}</span><span class="market-name">/{{ item.market }}</span>
                                </td>
                                <td :class="{'text-success': item.trend === 'positive', 'text-danger':item.trend=== 'negative'}">
                                    <span style="font-weight: normal">{{ item.changePercent }}%</span>
                                </td>
                                <td class="history-deal-date">
                                    <div class="market-activity-indicator"
                                         :class="{positive: item.trend === 'positive', negative: item.trend === 'negative'}">
                                        <div v-for="star in item.stars"
                                             class="market-activity-arrow"></div>
                                    </div>

                                </td>
                            </tr>
                            <tr v-if="activityList.length===0">
                                <td colspan="5" class="text-center">
                                    {{$vuetify.lang.translator('trading.no_activity')}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script>
    import BigNumber from 'bignumber.js';
    BigNumber.config({EXPONENTIAL_AT: [-15, 20]});
    export default {
        name: "MarketActivity",
        data() {
            return {
                panel: [0],
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
                            changePercent = change.multipliedBy(100).div(BigNumber(item.previous_day)).dp(2).toNumber();
                        }
                    }
                    return {
                        market: item.market,
                        trend: change > 0 ? 'positive' : change < 0 ? 'negative' : 0,
                        currency: item.currency,
                        change: change.dp(item.scale).toNumber(),
                        changePercent: changePercent
                    }
                });
            },
            activityList() {
                let positive = _.chain(this.tickersList)
                    .filter(item => {
                        return item.trend === 'positive' || item.trend === 0
                    })
                    .sortBy(item => {
                        return item.changePercent * -1;
                    })
                    .slice(0, 3)
                    .map((item, key) => {
                        item['stars'] = 3 - key;
                        return item;
                    })
                    .value();
                let negative = _.chain(this.tickersList)
                    .filter(item => {
                        return item.trend === 'negative'
                    })
                    .sortBy(item => {
                        return item.changePercent;
                    })
                    .slice(0, 3)
                    .map((item, key) => {
                        item['stars'] = 3 - key;
                        return item;
                    })
                    .value();
                return _.union(positive, negative);
            }
        }

    }
</script>

<style scoped>

</style>