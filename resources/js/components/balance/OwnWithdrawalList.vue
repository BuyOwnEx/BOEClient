<template>
    <v-card>
        <v-data-table
                dense
                :calculate-widths=true
                :headers="headers"
                :items="withdrawals"
                :items-per-page="itemsPerPage"
                :footer-props="footer_props"
                class="elevation-0 pl-4 pr-4"
        >
            <template v-slot:top>
                <v-toolbar flat dense class="mt-2">
                    <v-toolbar-title>{{tableCaption}}</v-toolbar-title>
                </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
                <v-menu close-on-click offset-y v-model="item.menu" transition="slide-y-transition" bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn x-small color="success" dense v-on="on">
                            {{$vuetify.lang.translator('trading.actions')}} <v-icon right>mdi-chevron-down</v-icon>
                        </v-btn>
                    </template>
                    <v-list dense>
                        <crypto-deposit
                                v-if="menuItemExist('cancel_withdraw')"
                                :withdrawObj="item"
                                v-on:closeMenu="closeMenu(item)"
                        ></crypto-deposit>
                    </v-list>
                </v-menu>
            </template>
            <template v-slot:item.currency="{ item }">
                <v-avatar :color="item.color" size="22" v-if="!item.logo">
                    <v-img v-if="item.logo" class="elevation-6" :src="item.logo"></v-img>
                    <span v-else class="white--text subtitle-2">{{item.currency.charAt(0)}}</span>
                </v-avatar>
                <v-img v-else class="elevation-0 d-inline-flex" style="vertical-align: middle" :src="item.logo" max-height="22" max-width="22"></v-img>
                <span class="ml-1">{{item.currency}}</span>
            </template>
            <template v-slot:item.amount="{ item }">
                {{ BigNumber(item.amount).toString() }}
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
    import BigNumber from 'bignumber.js';
    BigNumber.config({EXPONENTIAL_AT: [-15, 20]});
    import WithdrawCancel from '../dialogs/balance/withdraw/WithdrawCancel';
    export default {
        name: "OwnWithdrawalList",
        components: {
            WithdrawCancel
        },
        data() {
            return {
                withdrawals: [],
                tableCaption: this.$vuetify.lang.translator('balance.headers.own_active_withdraw_list'),
                itemsPerPage: 5,
                headers: [
                    {
                        text: 'ID',
                        align: 'start',
                        sortable: true,
                        value: 'id',
                    },
                    { text: this.$vuetify.lang.translator('balance.date'), value: 'date', },
                    { text: this.$vuetify.lang.translator('balance.currency'), value: 'currency' },
                    { text: this.$vuetify.lang.translator('balance.amount'), value: 'amount' },
                    { text: this.$vuetify.lang.translator('balance.actions'), value: 'action', sortable: false },
                ],
                footer_props: {
                    "items-per-page-options": [5,10,30,100,500],
                    "items-per-page-all-text": '500'
                },
                closeOnContentClick: true,
                actions: [
                    { title: this.$vuetify.lang.translator('balance.action.cancel_withdraw'), name: 'cancel_withdraw' }
                ]
            }
        },
        computed: {

        },
        methods: {
            BigNumber(item) {
                return BigNumber(item);
            },
            menuItemExist(func) {
                return _.findIndex(this.actions, action => action.name === func)!== -1;
            },
            closeMenu(item) {
                item.menu = false;
            }
        },
        mounted() {
            axios.get('/trader/ext/balance/all-withdrawals').then(response => {
                if (_.get(response, 'data.success') === true) {
                    this.withdrawals =response.data.withdrawals;
                }
            });
        },
    }
</script>

<style scoped>

</style>