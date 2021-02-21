<template>
    <v-card class="pa-2">
        <div class="ask-bid-container d-flex flex-column">
            <div class="mt-2 mb-3 d-flex flex-grow-0 justify-space-between">
                <v-btn
                        tile
                        text
                        width="32%"
                        class="pt-2 pb-2"
                        height="32"
                        :class="{'selected': activeListsDisplayMode === 'ask'}"
                        @click="activeListsDisplayMode = 'ask'"
                >
                    {{ $vuetify.lang.translator('trading.headers.ask') }}
                </v-btn>
                <v-btn
                        tile
                        text
                        width="32%"
                        class="pt-2 pb-2"
                        height="32"
                        :class="{'selected': activeListsDisplayMode === 'bid'}"
                        @click="activeListsDisplayMode = 'bid'"
                >
                    {{ $vuetify.lang.translator('trading.headers.bid') }}
                </v-btn>
                <v-btn
                        tile
                        text
                        width="34%"
                        class="pt-2 pb-2"
                        height="32"
                        :class="{'selected': activeListsDisplayMode === 'askbid'}"
                        @click="activeListsDisplayMode = 'askbid'"
                >
                    {{ $vuetify.lang.translator('trading.headers.ask_bid') }}
                </v-btn>
            </div>
            <div class="d-flex flex-grow-0 justify-space-between pr-2 pl-2 mb-2">
                <div class="align-center pa-1">{{ $vuetify.lang.translator('trading.rate') }}</div>
                <div class="align-center pa-1">{{ $vuetify.lang.translator('trading.amount') }}</div>
                <div class="align-center pa-1">{{ $vuetify.lang.translator('trading.volume') }}</div>
            </div>
            <div style="width: 100%">
                <ask-list
                        v-if="activeListsDisplayMode === 'ask' || activeListsDisplayMode === 'askbid'"
                        :ask_list="ask_list"
                        :ask_volume_depth="ask_volume_depth"
                        :ask_amount_depth="ask_amount_depth"
                        :currency="currency"
                        :market="market"
                ></ask-list>
                <ask-bid-last-price
                        :market="market"
                ></ask-bid-last-price>
                <bid-list
                        v-if="activeListsDisplayMode === 'bid' || activeListsDisplayMode === 'askbid'"
                        :bid_list="bid_list"
                        :bid_volume_depth="bid_volume_depth"
                        :bid_amount_depth="bid_amount_depth"
                        :currency="currency"
                        :market="market"
                ></bid-list>
            </div>
        </div>
    </v-card>
</template>

<script>
    import askList from "./AskList";
    import bidList from "./BidList";
    import askBidLastPrice from "./AskBidLastPrice";
    export default {
        name: "OrderBook",
        components: {
            askList,
            bidList,
            askBidLastPrice
        },
        props: ['market', 'currency'],
        data() {
            return {
                activeListsDisplayMode: 'askbid',
                /*ask_list: [],
                bid_list: [],
                bid_amount_depth: 0,
                bid_volume_depth: 0,
                ask_amount_depth: 0,
                ask_volume_depth: 0,
                best_ask: 0,
                best_bid: 0,*/
            };
        },
        computed: {
            pair: function() {
                return [this.currency,this.market];
            },
            ask_list() {
                return this.$store.state.trading.ask_list;
            },
            bid_list() {
                return this.$store.state.trading.bid_list;
            },
            ask_amount_depth() {
                return this.$store.state.trading.ask_amount_depth;
            },
            bid_amount_depth() {
                return this.$store.state.trading.bid_amount_depth;
            },
            ask_volume_depth() {
                return this.$store.state.trading.ask_volume_depth;
            },
            bid_volume_depth() {
                return this.$store.state.trading.bid_volume_depth;
            },
            best_ask() {
                return this.$store.state.trading.best_ask;
            },
            best_bid() {
                return this.$store.state.trading.best_bid;
            },
        },
        /*watch: {
            pair(val, oldVal) {
                this.loadCommonTraderData();
            }
        },*/
        methods: {
            /*loadCommonTraderData() {
                let queryParams = {
                    params: {
                        currency: this.currency,
                        market: this.market
                    }
                };
                axios.get('/trader/depth', queryParams).then((response) => {
                    //console.log(response.data);
                    this.ask_list = response.data.asks_list;
                    this.bid_list = response.data.bids_list;
                    this.ask_amount_depth = response.data.asks_amount;
                    this.ask_volume_depth = response.data.asks_vol;
                    this.bid_amount_depth = response.data.bids_amount;
                    this.bid_volume_depth = response.data.bids_vol;
                    if (response.data.asks_list.length !== 0) {
                        this.best_ask = response.data.asks_list[0].price;
                        this.$eventHub.$emit('set-buy-price', {price: this.best_ask});
                    }
                    if (response.data.bids_list.length !== 0) {
                        this.best_bid = response.data.bids_list[0].price;
                        this.$eventHub.$emit('set-sell-price', {price: this.best_bid});
                    }
                });
            },*/
        },
        mounted() {
            //this.loadCommonTraderData();
        },
        /*beforeMount() {
            if (this.ask_list === null && this.bid_list === null) {
                this.$store.dispatch('trading/getOrderBookFromServer').then(resp => {
                    if (resp.asks_list.length !== 0) {
                        this.$eventHub.$emit('set-buy-price', {price: resp.asks_list[0].price});
                    }
                    if (resp.bids_list.length !== 0) {
                        this.$eventHub.$emit('set-sell-price', {price: resp.bids_list[0].price});
                    }
                });
            }
        },*/
    }
</script>

<style scoped>

</style>