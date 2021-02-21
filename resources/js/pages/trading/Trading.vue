<template>
    <div class="d-flex flex-grow-1 flex-column">
        <market-info
                :currency="selectedCurrency"
                :market="selectedMarket"
        ></market-info>
        <v-row align="start" justify="center">
            <v-col cols="3" class="text-center">
                <tickers-list :market="market"></tickers-list>
            </v-col>
            <v-col cols="6" class="text-center">
                <trading-chart
                        :currency="selectedCurrency"
                        :market="selectedMarket"
                ></trading-chart>
            </v-col>
            <v-col cols="3" class="text-center">
                <history-deal-list
                        :market="selectedMarket"
                        :currency="selectedCurrency"
                ></history-deal-list>
            </v-col>
        </v-row>
        <v-row align="start" justify="center">
            <v-col cols="3" class="text-center">
                <order-book
                        :currency="selectedCurrency"
                        :market="selectedMarket"
                ></order-book>
            </v-col>
            <v-col cols="6" class="text-center">
                <trading-forms
                        :currency="selectedCurrency"
                        :market="selectedMarket"
                ></trading-forms>
            </v-col>
            <v-col cols="3" class="text-center">
                <market-activity></market-activity>
            </v-col>
        </v-row>
        <v-row align="start" justify="center" v-if="isLogged">
            <v-col cols="12" class="text-center">
                <own-active-order-list
                        :currency="selectedCurrency"
                        :market="selectedMarket"
                ></own-active-order-list>
            </v-col>
        </v-row>
        <v-row align="start" justify="center" v-if="isLogged && isMargin">
            <v-col cols="12" class="text-center">
                <own-active-position-list
                        :currency="selectedCurrency"
                        :market="selectedMarket"
                ></own-active-position-list>
            </v-col>
        </v-row>
        <v-row align="start" justify="center" v-if="isLogged">
            <v-col cols="12" class="text-center">
                <own-history-deal-list
                        :currency="selectedCurrency"
                        :market="selectedMarket"
                ></own-history-deal-list>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import CentrifugeTradingMixin from '../../mixins/centrifugo-trading';
    import TickersList from "../../components/trading/TickersList";
    import MarketInfo from "../../components/trading/MarketInfo";
    import OrderBook from "../../components/trading/OrderBook";
    import HistoryDealList from "../../components/trading/HistoryDealList";
    import MarketActivity from "../../components/trading/MarketActivity";
    import TradingForms from "../../components/trading/TradingForms";
    import TradingChart from "../../components/trading/TradingChart";
    import OwnActiveOrderList from "../../components/trading/OwnActiveOrderList";
    import OwnActivePositionList from "../../components/trading/OwnActivePositionList";
    import OwnHistoryDealList from "../../components/trading/OwnHistoryDealList";

    export default {
        name: "Trading",
        mixins: [CentrifugeTradingMixin],
        components: {
            TradingChart,
            TickersList,
            MarketInfo,
            TradingForms,
            MarketActivity,
            HistoryDealList,
            OrderBook,
            OwnActiveOrderList,
            OwnActivePositionList,
            OwnHistoryDealList
        },
        props: ['currency','market'],
        data: () => ({
            //user: null,
        }),
        computed: {
            selectedMarket() {
                return this.$store.state.trading.selectedMarket;
            },
            selectedCurrency() {
                return this.$store.state.trading.selectedCurrency;
            },
            selectedPair () {
                return this.$store.getters['trading/selectedPair'];
            },
            markets() {
                return _.get(this.$store.state.tickers.markets, this.selectedMarket.toUpperCase(), null);
            },
            isMargin() {
                let market = this.markets ? _.find(this.markets, item => item.currency.toUpperCase() === this.selectedCurrency.toUpperCase()) : null;
                return market === null ? false : market.margin;
            },
            isLogged() {
                return this.$store.getters.isLogged;
            }
        },
        methods: {
            updateUrl() {
                if ('history' in window) {
                    window.history.pushState(null, this.selectedMarket.toUpperCase() + '/' + this.selectedCurrency.toUpperCase(), '/trader/trading/' + this.selectedMarket.toUpperCase() + '/' + this.selectedCurrency.toUpperCase());
                }
            },
        },
        created: function () {
            //this.trading_currency = this.$trading_currency;
            //this.trading_market = this.$trading_market;
            //this.user = this.$user;
            if (this.$store.state.trading.selectedMarket === null || this.$store.state.trading.selectedCurrency === null ) {
                console.log('currency: '+this.$trading_currency);
                console.log('market: '+this.$trading_market);
                this.$store.commit('trading/setPair', {currency: this.$trading_currency, market: this.$trading_market});
            }
        },
        mounted() {
            this.debouncedUpdateUrl = _.debounce(this.updateUrl, 300);
            this.$watch('selectedPair', this.debouncedUpdateUrl);
            console.log('user: '+this.$user);
            this.$store.commit('app/setAuthUser', {'user': this.$user, 'vm': this});
        }
    }
</script>

<style scoped>

</style>