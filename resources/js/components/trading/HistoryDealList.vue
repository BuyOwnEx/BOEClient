<template>
    <v-card>
        <v-expansion-panels v-model="panel" multiple flat>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    {{$vuetify.lang.translator('trading.headers.history_deal_list')}} {{ selectedCurrency }} / {{selectedMarket}}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <vue-perfect-scrollbar
                            style="max-height: 368px"
                            class="scroll-area"
                            :settings="scrollSettings"
                    >
                        <v-simple-table dense fixed-header id="history-deals">
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th class="text-left">{{$vuetify.lang.translator('trading.rate')}}</th>
                                    <th class="text-left">{{$vuetify.lang.translator('trading.amount')}}</th>
                                    <th class="text-left">{{$vuetify.lang.translator('trading.date')}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-if="history_deal_list!==null" v-for="item in history_deal_list">
                                    <td :class="{'text-danger': item.side === true, 'text-success':item.side === false}">
                                        <strong>{{ BigNumber(item.price).toString() }}</strong>
                                    </td>
                                    <td>{{ BigNumber(item.size).toString() }}</td>
                                    <td class="date-cell">{{ date(item.createdAt) }}</td>
                                </tr>
                                <tr v-if="history_deal_list!==null && history_deal_list.length===0">
                                    <td colspan="3" class="text-center">
                                        {{$vuetify.lang.translator('trading.no_deals')}}
                                    </td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </vue-perfect-scrollbar>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<script>
    import VuePerfectScrollbar from 'vue-perfect-scrollbar';
    import BigNumber from 'bignumber.js';
    BigNumber.config({EXPONENTIAL_AT: [-15, 20]});
    import moment from 'moment'

    export default {
        name: "HistoryDealList",
        props: ['currency', 'market'],
        components: {VuePerfectScrollbar},
        data(){
            return {
                isCollapsed: false,
                panel: [0],
                scrollSettings: {
                    wheelPropagation: true,
                },
            };
        },
        computed: {
            selectedMarket() {
                return this.$store.state.trading.selectedMarket === null ? '' : this.$store.state.trading.selectedMarket.toUpperCase();
            },
            selectedCurrency() {
                return this.$store.state.trading.selectedCurrency === null ? '' : this.$store.state.trading.selectedCurrency.toUpperCase();
            },
            history_deal_list() {
                return this.$store.state.trading.history_deal_list;
            }
        },
        methods: {
            BigNumber(item) {
                return BigNumber(item);
            },
            date(date) {
                return moment.utc(date).tz(moment.tz.guess()).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        mounted() {
            
        }
    }
</script>

<style scoped>

</style>