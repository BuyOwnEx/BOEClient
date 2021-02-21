<template>
    <v-card class="pa-2">
        <div>
            <v-text-field
                    :label="$vuetify.lang.translator('trading.search')"
                    v-model="tickersSearchQuery"
                    outlined
                    dense
                    flat
                    hide-details
                    append-icon="mdi-magnify"
                    color="#a6a6a6"
                    height="35"
            >
            </v-text-field>
        </div>
        <div class="tickers-header mt-1 mb-3 d-flex justify-space-between">
            <div class="tickers-markets">
                <v-btn
                        v-if="marketsFromStorage!==null"
                        text
                        height="32"
                        v-for="market in markets"
                        :key="market"
                        class="mt-2 mr-1"
                        :class="{'selected': market === selectedMarket}"
                        @click="selectedMarket = market">
                    <span>{{ market }}</span>
                </v-btn>
            </div>
            <div class="tickers-favorites d-flex">
                <v-btn
                        icon
                        height="32"
                        color="#FFE040"
                        class="mt-1 align-self-center"
                        :class="{'selected': selectedMarket === 'favorites'}"
                        @click="selectedMarket = 'favorites'">
                    <v-icon>mdi-star-outline</v-icon>
                </v-btn>
            </div>
        </div>
        <div id="ticker-buttons" class="d-flex justify-center">
            <v-btn
                    tile
                    text
                    width="50%"
                    height="26"
                    class="pt-2 pb-2"
                    :class="{'selected': tickersSorting.indexOf('change') !== -1}"
                    @click="setSorting('change')"
            >
                <v-icon left v-if="tickersSorting === 'changeAsc'">mdi-chevron-up</v-icon>
                <v-icon left v-if="tickersSorting === 'changeDesc'">mdi-chevron-down</v-icon>
                {{ $vuetify.lang.translator('trading.sort.change') }}
            </v-btn>
            <v-btn
                    tile
                    text
                    width="50%"
                    height="26"
                    class="pt-2 pb-2"
                    :class="{'selected': tickersSorting.indexOf('volume') !== -1}"
                    @click="setSorting('volume')"
            >
                <v-icon left v-if="tickersSorting === 'volumeAsc'">mdi-chevron-up</v-icon>
                <v-icon left v-if="tickersSorting === 'volumeDesc'">mdi-chevron-down</v-icon>
                {{ $vuetify.lang.translator('trading.sort.volume') }}
            </v-btn>
        </div>
        <v-simple-table
                v-if="tickersList !== null && tickersListFilteredAndSorted.length > 0"
                dense
                fixed-header
                class="ticker-table"
        >
            <template v-slot:default>
                <thead>
                <tr style="height: 45px;">
                    <th class="text-center" style="color:#A6A6A6;font-weight:500;">{{ $vuetify.lang.translator('trading.market') }}</th>
                    <th class="text-center" style="color:#A6A6A6;font-weight:500;">{{ $vuetify.lang.translator('trading.rate') }}</th>
                    <th class="text-center" style="color:#A6A6A6;font-weight:500;">
                        <span v-if="tickersSorting.indexOf('volume') === -1">{{ $vuetify.lang.translator('trading.sort.change') }}</span>
                        <span v-if="tickersSorting.indexOf('volume') !== -1">{{ $vuetify.lang.translator('trading.sort.volume') }}</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in tickersListFilteredAndSorted" :key="item.pairName">
                    <td class="ticker-item-pair-name">
                        <i
                                class="favorite-checked clickable"
                                v-if="favoritePairs.indexOf(item.pairName) !== -1"
                                @click="removeFromFavorites(item.pairName)"
                        ></i>
                        <i
                                class="favorite-unchecked clickable"
                                v-if="favoritePairs.indexOf(item.pairName) === -1"
                                @click="addToFavorites(item.pairName)"
                        ></i>
                        <a href="#"
                           @click.prevent="selectMarketAndCurrency(item.market, item.currency)">
                            <strong>{{ item.currency }}</strong><span class="market-name">/{{ item.market }}</span>
                        </a>
                    </td>
                    <td class="ticker-item-cost">
                        {{ BigNumber(item.latest).toString() }}
                    </td>
                    <td class="ticker-item-change text-right"
                        :class="{'text-danger':  item.changePercent <0, 'text-success': item.changePercent >0}">
                        <span v-if="tickersSorting.indexOf('volume') === -1">{{ item.changePercent }}%</span>
                        <span v-if="tickersSorting.indexOf('volume') !== -1">{{ item.volumeReadable }}</span>
                    </td>
                </tr>
                </tbody>
            </template>
        </v-simple-table>
    </v-card>
</template>

<script>
    import BigNumber from 'bignumber.js';
    BigNumber.config({EXPONENTIAL_AT: [-15, 20]});

    export default {
        name: "TickersList",
        props: ['market'],
        data() {
            return {
                selectedMarket: this.market,
                tickersSorting: 'volumeDesc',
                tickersSearchQuery: '',
                favoritePairs: [],
            };
        },
        computed: {
            selectedTradingMarket() {
                return this.$store.state.trading.selectedMarket;
            },
            marketsFromStorage() {
                return this.$store.state.tickers.markets;
            },
            tickersFromStorage() {
                return this.$store.state.tickers.tickersList;
            },
            markets() {
                return _.keys(this.marketsFromStorage);
            },

            tickersList() {
                if (this.tickersFromStorage === null || this.marketsFromStorage === null) {
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

                    let amountScale = 6;
                    let rateScale = 2;
                    let currentMarket = this.marketsFromStorage[item.market.toUpperCase()];
                    if (currentMarket !== undefined) {
                        let currentPair = _.find(currentMarket, (marketArray) => {
                            return marketArray.currency.toLowerCase() === item.currency.toLowerCase();
                        });
                        if (currentPair !== undefined) {
                            amountScale = currentPair.amountScale;
                            rateScale = currentPair.rateScale;
                        }
                    }
                    return {
                        pairName: item.currency.toUpperCase() + '/' + item.market.toUpperCase(),
                        market: item.market,
                        currency: item.currency,
                        margin: item.margin,
                        volume: item.volume,
                        volumeReadable: BigNumber(item.volume).dp(amountScale+rateScale).toString(),
                        latest: item.latest,
                        change: change.toFixed(item.scale),
                        changePercent: changePercent.toFixed(2)
                    }
                });
            },
            tickersListFiltered() {
                if (this.selectedMarket === null) {
                    return this.markets;
                }
                if (this.tickersSearchQuery !== '' && this.selectedMarket !== 'favorites') {
                    return _.filter(this.tickersList, (item) => {
                        return item.pairName.toLowerCase().indexOf(this.tickersSearchQuery.toLowerCase()) !== -1;
                    });
                }
                if (this.selectedMarket === 'favorites') {
                    if (this.tickersSearchQuery !== '') {
                        return _.filter(this.allFavorites, (item) => {
                            return item.pairName.toLowerCase().indexOf(this.tickersSearchQuery.toLowerCase()) !== -1;
                        });
                    }
                    return this.allFavorites;
                }

                return _.filter(this.tickersList, (item) => {
                    return item.market === this.selectedMarket;
                });
            },
            tickersListFilteredAndSorted() {
                switch (this.tickersSorting) {
                    case 'changeAsc':
                        return _.sortBy(this.tickersListFiltered, item => parseFloat(item.changePercent));
                    case 'changeDesc':
                        return _.sortBy(this.tickersListFiltered, item => parseFloat(item.changePercent) * -1);
                    case 'volumeAsc':
                        return _.sortBy(this.tickersListFiltered, item => parseFloat(item.volume));
                    case 'volumeDesc':
                    default:
                        return _.sortBy(this.tickersListFiltered, item => parseFloat(item.volume) * -1);
                }
            },
            allFavorites() {
                if (this.favoritePairs.length === 0) {
                    return [];
                }
                return _.filter(this.tickersList, item => {
                    return _.find(this.favoritePairs, pair => {
                        return pair === item.pairName;
                    });
                });
            }
        },
        methods: {
            BigNumber(item) {
                return BigNumber(item);
            },
            selectMarketAndCurrency(market, currency) {
                market = market.toLowerCase();
                currency = currency.toLowerCase();
                this.$store.commit('trading/setPair', {market: market, currency: currency});
            },
            setSorting(type) {
                let sort = this.tickersSorting;
                switch (type) {
                    case 'change':
                        if (sort === 'changeAsc') {
                            this.tickersSorting = 'changeDesc';
                        } else {
                            this.tickersSorting = 'changeAsc';
                        }
                        break;
                    case 'volume':
                    default:
                        if (sort === 'volumeAsc') {
                            this.tickersSorting = 'volumeDesc';
                        } else {
                            this.tickersSorting = 'volumeAsc';
                        }
                }
            },
            addToFavorites(pairName) {
                let exist = _.find(this.favoritePairs, item => {
                    return item.toLowerCase() === pairName.toLowerCase();
                });
                if (exist === undefined) {
                    this.favoritePairs.push(pairName);
                }
            },
            removeFromFavorites(pairName) {
                let index = _.findIndex(this.favoritePairs, item => {
                    return item.toLowerCase() === pairName.toLowerCase();
                });
                if (index !== -1) {
                    this.favoritePairs.splice(index, 1);
                }
            }
        },
        watch: {
            favoritePairs(val, oldVal) {
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem('tickersFavorites', JSON.stringify(val));
                }
            },
            selectedTradingMarket(val, oldVal) {
                if (this.selectedMarket !== 'favorites' && val) {
                    this.selectedmarket = val.toUpperCase();
                }
            }
        },
        mounted() {
            this.selectedMarket = this.selectedTradingMarket ? this.selectedTradingMarket.toUpperCase() : this.market;

            if (typeof (Storage) !== "undefined") {
                let savedFavoriteTickers = localStorage.getItem('tickersFavorites');
                if (savedFavoriteTickers !== null) {
                    this.favoritePairs = JSON.parse(savedFavoriteTickers);
                }
            }
        },
        /*beforeMount() {
            if (this.marketsFromStorage === null) {
                this.$store.dispatch('tickers/getMarketDataFromServer').then(() => {
                    if (this.tickersFromStorage === null) {
                        this.$store.dispatch('tickers/getTickersListFromServer')
                    }
                });
            }
        }*/
    }
</script>

<style scoped>

</style>