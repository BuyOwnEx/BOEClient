<template>
    <v-row :align="alignment" :justify="justify" class="pl-3 pr-3" style="height: 40px;">
        <div class="pair-name-block">
            <span class="currency-name">{{ selectedCurrency }}</span><span class="market-name">/{{ selectedMarket }}</span>
        </div>
        <div class="last-price-block">
            <span class="title">{{$vuetify.lang.translator('trading.last_price')}}</span>
            <span class="value last-price-value">{{ lastPrice }} <span class="currency-name">{{ selectedMarket }}</span></span>
        </div>
        <div class="daily-block">
            <span class="title">{{$vuetify.lang.translator('trading.daily_change')}}</span>
            <span class="value daily-value"
                  :class="{'text-success': dailyChange > 0, 'text-danger': dailyChange < 0}">
                {{ dailyChangeAbsolute }} <span class="currency-name">{{ market }}</span> {{ dailyChangePercent }}%
            </span>
        </div>
        <div class="daily-high-block">
            <span class="title">{{$vuetify.lang.translator('trading.daily_high')}}</span>
            <span class="value daily-high-value">{{ dailyHigh }} <span class="currency-name">{{ selectedMarket }}</span></span>
        </div>
        <div class="daily-low-block">
            <span class="title">{{$vuetify.lang.translator('trading.daily_low')}}</span>
            <span class="value daily-low-value">{{ dailyLow }} <span class="currency-name">{{ selectedMarket }}</span></span>
        </div>
        <div class="daily-volume">
            <span class="title">{{$vuetify.lang.translator('trading.daily_volume')}}</span>
            <span class="value daily-volume-value">{{ dailyVolume }}<span class="currency-name">/{{ selectedMarket }}</span>
            </span>
        </div>
    </v-row>
</template>

<script>
    import BigNumber from 'bignumber.js';
    BigNumber.config({EXPONENTIAL_AT: [-15, 20]});
    export default {
        name: "MarketInfo",
        props: ['market', 'currency'],
        data() {
            return {
                alignment: 'center',
                justify: 'space-between'
            }
        },
        computed: {
            selectedMarket() {
                return this.$store.state.trading.selectedMarket === null ? '' : this.$store.state.trading.selectedMarket.toUpperCase();
            },
            selectedCurrency() {
                return this.$store.state.trading.selectedCurrency === null ? '' : this.$store.state.trading.selectedCurrency.toUpperCase();
            },
            selectedPair () {
                return this.$store.getters['trading/selectedPair'];
            },
            ticker() {
                return this.$store.getters['trading/activeTicker'];
                //return this.$store.getters.activeTicker;
            },
            lastPrice() {
                return this.ticker ? BigNumber(this.ticker.latest).dp(this.ticker.scale).toString() : 0.00;
            },
            dailyChange() {
                if (this.ticker === null) {
                    return BigNumber(0);
                }
                return BigNumber(this.ticker.latest).minus(BigNumber(this.ticker.previous_day));
            },
            dailyChangeAbsolute() {
                if (this.ticker === null) {
                    return 0;
                }
                return this.dailyChange.abs().dp(this.ticker.scale).toString();
            },
            dailyChangePercent() {
                let changePercent = 0;
                if (!this.dailyChange.isZero()) {
                    if (BigNumber(this.ticker.previous_day).isZero()) {
                        changePercent = 100;
                    } else {
                        changePercent = this.dailyChange.multipliedBy(100).div(BigNumber(this.ticker.previous_day)).toString();
                    }
                }
                return BigNumber(changePercent).dp(2).toString();
            },
            dailyHigh() {
                return this.ticker ? BigNumber(this.ticker.max).dp(this.ticker.scale).toString() : 0;
            },
            dailyLow() {
                return this.ticker ? BigNumber(this.ticker.min).dp(this.ticker.scale).toString() : 0;
            },
            dailyVolume() {
                return this.ticker ? BigNumber(this.ticker.volume).dp(this.ticker.scale).toString() : 0;
            }
        },
        methods: {
            BigNumber(item) {
                return BigNumber(item);
            },
        }
    }
</script>

<style scoped>

</style>