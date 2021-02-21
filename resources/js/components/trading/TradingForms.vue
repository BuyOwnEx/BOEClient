<template>
    <v-card class="pa-2">
        <div id="order-type-buttons" class="d-flex justify-start">
            <v-btn tile text height="26" class="pt-2 pb-2"
                   :class="{'selected': activeTradingFormsDisplayMode === 'limit'}"
                   @click="activeTradingFormsDisplayMode = 'limit'">
                <span>{{$vuetify.lang.translator('trading.order.type.limit')}}</span>
            </v-btn>
            <v-btn tile text height="26" class="pt-2 pb-2"
                   :class="{'selected': activeTradingFormsDisplayMode === 'market'}"
                   @click="activeTradingFormsDisplayMode = 'market'">
                <span>{{$vuetify.lang.translator('trading.order.type.market')}}</span>
            </v-btn>
        </div>
        <div class="trading-forms-content">
            <v-row align="start" justify="center" v-if="activeTradingFormsDisplayMode === 'limit'">
                <v-col md="6">
                    <v-card outlined>
                        <v-card-title class="text-uppercase pb-3">{{$vuetify.lang.translator('trading.order.direction.buy')}} {{ currency }}</v-card-title>
                        <v-card-text>
                            <keep-alive>
                                <bid-limit-form
                                        :currency="currency"
                                        :market="market"
                                ></bid-limit-form>
                            </keep-alive>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col md="6">
                    <v-card outlined>
                        <v-card-title class="text-uppercase pb-3">{{$vuetify.lang.translator('trading.order.direction.sell')}} {{ currency }}</v-card-title>
                        <v-card-text>
                            <keep-alive>
                                <ask-limit-form
                                        :currency="currency"
                                        :market="market"
                                ></ask-limit-form>
                            </keep-alive>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row align="start" justify="center" v-if="activeTradingFormsDisplayMode === 'market'">
                <v-col md="6">
                    <v-card outlined>
                        <v-card-title class="text-uppercase pb-3">{{$vuetify.lang.translator('trading.order.direction.buy')}} {{ currency }}</v-card-title>
                        <v-card-text>
                            <keep-alive>
                                <bid-market-form
                                        :currency="currency"
                                        :market="market"
                                ></bid-market-form>
                            </keep-alive>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col md="6">
                    <v-card outlined>
                        <v-card-title class="text-uppercase pb-3">{{$vuetify.lang.translator('trading.order.direction.sell')}} {{ currency }}</v-card-title>
                        <v-card-text>
                            <keep-alive>
                                <ask-market-form
                                        :currency="currency"
                                        :market="market"
                                ></ask-market-form>
                            </keep-alive>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>

<script>
    import BidLimitForm from "./BidLimitForm";
    import AskLimitForm from "./AskLimitForm";
    import BidMarketForm from "./BidMarketForm";
    import AskMarketForm from "./AskMarketForm";
    export default {
        name: "TradingForms",
        components: {AskMarketForm, BidMarketForm, AskLimitForm, BidLimitForm},
        props: ['currency', 'market'],
        data() {
            return {
                activeTradingFormsDisplayMode: 'limit'
            };
        },
        computed: {

        },
        mounted() {

        },
    }
</script>

<style scoped>

</style>