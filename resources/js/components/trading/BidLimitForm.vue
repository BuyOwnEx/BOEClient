<template>
    <form id="bid_limit_form" @submit.prevent="sendBidLimit">
        <input name="type" type="hidden" value="LIMIT">
        <input name="currency" type="hidden" :value="currency">
        <input name="market" type="hidden" :value="market">
        <input name="side" type="hidden" value="0">
        <v-text-field
                v-model="form.amount"
                ref="bid_limit_amount"
                outlined
                clearable
                dense
                hide-details
                height="28"
                :label="$vuetify.lang.translator('trading.order.direction.buy')"
                type="text"
                @keydown="validateNumber($event)"
        >
            <template v-slot:append>
                <span class="button-currency-text">{{currency.toUpperCase()}}</span>
            </template>
        </v-text-field>
        <div id="buttons-percent" class="d-flex justify-space-between mb-3 mt-3">
            <v-btn text height="32" style="border: 1px solid rgb(229, 229, 229);" width="23%" @click="setAmount(25)">
                <span>25 %</span>
            </v-btn>
            <v-btn text height="32" style="border: 1px solid rgb(229, 229, 229);" width="23%" @click="setAmount(50)">
                <span>50 %</span>
            </v-btn>
            <v-btn text height="32" style="border: 1px solid rgb(229, 229, 229);" width="23%" @click="setAmount(75)">
                <span>75 %</span>
            </v-btn>
            <v-btn text height="32" style="border: 1px solid rgb(229, 229, 229);" width="23%" @click="setAmount(100)">
                <span>100 %</span>
            </v-btn>
        </div>
        <v-text-field
                v-model="form.rate"
                ref="bid_limit_rate"
                outlined
                clearable
                dense
                height="28"
                :label="$vuetify.lang.translator('trading.rate')"
                :hint="$vuetify.lang.translator('trading.rate_per') + ' ' +currency.toUpperCase()"
                persistent-hint
                type="text"
                @keydown="validateNumber($event)"
        >
            <template v-slot:append>
                <span class="button-currency-text">{{market.toUpperCase()}}</span>
            </template>
        </v-text-field>
        <v-text-field
                v-model="volume"
                ref="bid_limit_volume"
                outlined
                placeholder=" "
                clearable
                dense
                height="28"
                :label="$vuetify.lang.translator('trading.volume')"
                :hint="$vuetify.lang.translator('trading.order.pay_limit_buy',[fee_visible]) + ' ' +currency.toUpperCase()"
                persistent-hint
                type="text"
                @keydown="validateNumber($event)"
        >
            <template v-slot:append>
                <span class="button-currency-text">{{currency.toUpperCase()}}</span>
            </template>
        </v-text-field>
        <div id="margin-select" v-if="useMargin">
            <v-select
                    v-model="form.offer"
                    :items="offers_select"
                    item-text="name"
                    item-value="id"
                    :label="$vuetify.lang.translator('trading.order.offer')"
                    dense
            >
            </v-select>
        </div>
        <div v-if="!useMargin">
            <v-text-field
                    v-model="form.sl_rate"
                    ref="bid_limit_sl_rate"
                    outlined
                    placeholder=" "
                    clearable
                    dense
                    height="28"
                    :label="$vuetify.lang.translator('trading.order.sl_rate')"
                    hide-details
                    :disabled="!additionalParamsEnabled"
                    type="text"
                    class="mb-3"
                    @keydown="validateNumber($event)"
            >
                <template v-slot:append>
                    <span class="button-currency-text">{{market.toUpperCase()}}</span>
                </template>
            </v-text-field>
            <v-text-field
                    v-model="form.tp_rate"
                    ref="bid_limit_tp_rate"
                    outlined
                    placeholder=" "
                    clearable
                    dense
                    height="28"
                    :label="$vuetify.lang.translator('trading.order.tp_rate')"
                    hide-details
                    :disabled="!additionalParamsEnabled"
                    type="text"
                    class="mb-3"
                    @keydown="validateNumber($event)"
            >
                <template v-slot:append>
                    <span class="button-currency-text">{{market.toUpperCase()}}</span>
                </template>
            </v-text-field>
            <v-text-field
                    v-model="form.ts_offset"
                    ref="bid_limit_ts_offset"
                    outlined
                    placeholder=" "
                    clearable
                    dense
                    height="28"
                    :label="$vuetify.lang.translator('trading.order.ts_offset')"
                    hide-details
                    :disabled="!additionalParamsEnabled"
                    type="text"
                    class="mb-3"
                    @keydown="validateNumber($event)"
            >
                <template v-slot:append>
                    <span class="button-currency-text">{{market.toUpperCase()}}</span>
                </template>
            </v-text-field>
        </div>
        <div class="d-flex justify-end mt-2" v-if="marginTradingAvailable">
            <v-switch
                    v-model="useMargin"
                    class="mt-1"
                    hide-details
                    height="14"
                    left
                    inset
                    :label="$vuetify.lang.translator('trading.order.use_margin')"
            ></v-switch>
        </div>
        <div class="d-flex justify-end" v-if="!useMargin">
            <v-switch
                    v-model="additionalParamsEnabled"
                    class="mt-1"
                    hide-details
                    height="14"
                    left
                    inset
                    :label="$vuetify.lang.translator('trading.order.use_additional_params')"
            ></v-switch>
        </div>
        <div class="box-footer">
            <v-btn text tile type="submit" height="32">{{$vuetify.lang.translator('trading.order.direction.buy')}}</v-btn>
            <span class="pull-right" style="padding: 6px 0;">
                {{$vuetify.lang.translator('trading.order.available')}}
                <span class="available_balance" @click="setAmount(100)">{{ balance.toString() }}</span>
                {{market.toUpperCase()}}
            </span>
        </div>
    </form>
</template>

<script>
    import BigNumber from 'bignumber.js';
    BigNumber.config({EXPONENTIAL_AT: [-15, 20]});
    export default {
        name: "BidLimitForm",
        props: ['currency', 'market'],
        data() {
            return {
                form: {
                    type: 'LIMIT',
                    currency: this.currency.toUpperCase(),
                    market: this.market.toUpperCase(),
                    side: 0,
                    amount: '',
                    rate: '',
                    sl_rate: null,
                    tp_rate: null,
                    ts_offset: null,
                    offer: 0
                },
                additionalParamsEnabled: false,
                volume: '',
                useMargin: false,
                offers: []
            };
        },
        computed: {
            isAuth() {
                return this.$store.getters.isLogged;
            },
            balances() {
                return this.$store.state.user.balances;
            },
            offers_select() {
                let self = this;
                return _.map(this.offers, function (value) {
                    return {
                        id: value.id,
                        name: self.$vuetify.lang.translator('trading.order.offer_option',
                            BigNumber(value.percent).toString(),
                            BigNumber(value.days).toString(),
                            BigNumber(value.amount).toString(),
                            self.market.toUpperCase()
                        )
                    }
                });
            },
            activeTicker() {
                return this.$store.getters.activeTicker;
            },
            markets() {
                return _.get(this.$store.state.tickers.markets, this.market.toUpperCase(), null);
            },
            selectedMarket() {
                if(this.markets === null) {
                    return null;
                }
                let market = _.find(this.markets, item => item.currency.toUpperCase() === this.currency.toUpperCase());
                return market === undefined ? null : market;
            },
            amountScale() {
                return this.selectedMarket === null ? 2 : parseInt(this.selectedMarket.amountScale);
            },
            rateScale() {
                return this.selectedMarket === null ? 2 : parseInt(this.selectedMarket.rateScale);
            },
            minAmount() {
                return this.selectedMarket === null ? 0 : parseInt(this.selectedMarket.minAmount);
            },
            marginTradingAvailable() {
                return this.selectedMarket === null ? false : this.selectedMarket.margin;
            },
            fee_currency() {
                if(this.isAuth)
                {
                    let amount = _.get(this.balances, this.currency.toUpperCase(), 0.002);
                    if(amount.fee !== undefined)
                    {
                        return BigNumber(amount.fee);
                    }
                    return BigNumber(amount);
                }
                else return BigNumber(0.002);
            },
            fee_visible() {
                return this.fee_currency.times(BigNumber(100)).toString();
            },
            balance() {
                if(this.isAuth)
                {
                    let scale = 8;
                    let amount = _.get(this.balances, this.market.toUpperCase(), 0);
                    if(amount.available !== undefined)
                    {
                        return BigNumber(amount.available).dp(scale,1);
                    }
                    return BigNumber(0).dp(scale,1);
                }
                else return BigNumber(0);
            },
        },
        methods: {
            BigNumber(item) {
                return BigNumber(item).toString();
            },
            isNumeric: function (n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            },
            updateVolume () {
                this.volume = BigNumber(this.form.amount).times(BigNumber(1 - this.fee_currency)).toString();
            },
            updateOffers() {
                if(this.useMargin)
                {
                    this.getOffers();
                }
            },
            updateAmount(){
                let oldAmount = this.form.amount;
                let newAmount = BigNumber(this.volume).div(BigNumber(1 - this.fee_currency)).decimalPlaces(this.amountScale, 1).toString();

                let prevHasDot = /\.$/.test(oldAmount);
                let newHasDot = /\./.test(newAmount);
                let prevEndsWithDotWithZeroes = /\.0+$/.test(oldAmount);


                // BigNumber конвертация отрезает точки и нули.
                if (!newHasDot) {
                    if (prevHasDot) {
                        // старое заканчивается на точку без нулей, но в новом нет точки: добавляем точку
                        newAmount += '.';
                    } else if (prevEndsWithDotWithZeroes) {
                        // старое заканчивается на точку и нули, но в новом нет точки (и нулей тоже нет): добавляем точку и потерянное количество нулей
                        let matches = oldAmount.match(/\.0+$/);
                        if (matches !== null) {
                            newAmount += matches[0];
                        }
                    }
                }

                this.form.amount = newAmount;
            },
            setAmount(percents = 100) {
                if (this.form.rate !== '' && this.form.rate !== 0) {
                    this.form.amount = this.balance
                        .div(BigNumber(this.form.rate))
                        .div(100)
                        .times(percents)
                        .decimalPlaces(this.amountScale, 1)
                        .toString();
                } else {
                    this.form.amount = 0;
                }
            },
            getOffers() {
                let app = this;
                let queryParams = {
                    params: {
                        currency: this.market.toUpperCase(),
                        amount: this.form.amount === '' ? 0 : this.form.rate === '' ? 0 : BigNumber(this.form.amount).times(BigNumber(this.form.rate)).toString(),
                        side: 0,
                        type: 'LIMIT'
                    }
                };
                axios.get('/trader/ext/get_offer_list', queryParams)
                    .then((response) => {
                        console.log(response.data);
                        this.offers = response.data;
                    });
            },
            sendBidLimit (event) {
                let form = this.additionalParamsEnabled ? this.form : _.omit(this.form, ['sl_rate', 'tp_rate', 'ts_offset']);
                if (this.marginTradingAvailable) {
                    form.margin = this.useMargin ? 1 : 0;
                }
                else form.margin = 0;
                axios.post('/trader/ext/order/limit', form)
                    .then((response) => {
                        if (response.data.success === true) {
                            console.log(response.data);
                        }
                    });
            },
            validateNumber: function (evt) {
                evt = (evt) ? evt : window.event;
                let charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)) && charCode !== 46 && charCode !== 35 && charCode !== 36 && charCode !== 37 && charCode !== 39 && evt.key != '.') {
                    evt.preventDefault();
                } else {
                    return true;
                }
            },
            setFormRate({price}) {
                this.form.rate = price;
            },
            getRateFromTicker() {
                if (!this.activeTicker) {
                    return;
                }
                this.form.rate = BigNumber(this.activeTicker.ask).dp(this.rateScale, 1).toString();
            }
        },
        watch: {
            useMargin(val, oldVal) {
                if(val)
                {
                    this.getOffers();
                    this.additionalParamsEnabled = false;
                }
            },
            currency(val, oldVal){
                this.$set(this.form, 'currency', val.toUpperCase());
                this.$set(this.form, 'amount', '');
                this.getRateFromTicker();
            },
            market(val, oldVal){
                this.$set(this.form, 'market', val.toUpperCase());
                this.$set(this.form, 'amount', '');
                this.getRateFromTicker();
            },
            volume: function (newVolume, oldVolume) {
                if (this.isNumeric(newVolume) || newVolume === '') {
                    let rl = new RegExp("\\d+\\.\\d{" + (this.amountScale + this.rateScale + 4) + ",}", "i");
                    if (rl.test(newVolume)) {
                        this.volume = oldVolume;
                        this.$refs.bid_limit_volume.lazyValue = oldVolume;
                    } else {
                        if (this.form.rate !== '' && this.volume !== '' && this.form.rate !== 0 && this.volume !== 0) {
                            this.debouncedUpdateAmount()
                        }
                    }
                } else {
                    this.volume = 0;
                }
            },
            'form.amount': function (newAmount, oldAmount) {
                if (this.isNumeric(newAmount) || newAmount === '') {
                    let rl = new RegExp("\\d+\\.\\d{" + (this.amountScale + 1) + ",}", "i");
                    if (rl.test(newAmount)) {
                        this.form.amount = oldAmount;
                        this.$refs.bid_limit_amount.lazyValue = oldAmount;
                    } else if (newAmount === '' || newAmount === 0) {
                        this.form.amount = newAmount;
                    } else {
                        this.form.amount = newAmount;
                    }
                } else {
                    this.form.amount = 0;
                }
                this.debouncedUpdateVolume();
                this.debouncedUpdateOffers();
            },
            'form.rate': function (newRate, oldRate) {
                if (this.isNumeric(newRate) || newRate === '') {
                    let rl = new RegExp("\\d+\\.\\d{" + (this.rateScale + 1) + ",}", "i");
                    if (rl.test(newRate)) {
                        this.form.rate = oldRate;
                        this.$refs.bid_limit_rate.lazyValue = oldRate;
                    } else {
                        this.form.rate = newRate;
                    }
                } else {
                    this.form.rate = 0;
                }
                this.debouncedUpdateOffers();
            },
            'form.sl_rate': function (newSlRate, oldSlRate) {
                if (this.isNumeric(newSlRate) || newSlRate === '') {
                    let rl = new RegExp("\\d+\\.\\d{" + (this.rateScale + 1) + ",}", "i");
                    if (rl.test(newSlRate)) {
                        this.form.sl_rate = oldSlRate;
                        this.$refs.bid_limit_sl_rate.lazyValue = oldSlRate;
                    } else {
                        this.form.sl_rate = newSlRate;
                    }
                } else {
                    this.form.sl_rate = 0;
                }
            },
            'form.tp_rate': function (newTpRate, oldTpRate) {
                if (this.isNumeric(newTpRate) || newTpRate === '') {
                    let rl = new RegExp("\\d+\\.\\d{" + (this.rateScale + 1) + ",}", "i");
                    if (rl.test(newTpRate)) {
                        this.form.tp_rate = oldTpRate;
                        this.$refs.bid_limit_tp_rate.lazyValue = oldTpRate;
                    } else {
                        this.form.tp_rate = newTpRate;
                    }
                } else {
                    this.form.tp_rate = 0;
                }
            },
            'form.ts_offset': function (newTsOffset, oldTsOffset) {
                if (this.isNumeric(newTsOffset) || newTsOffset === '') {
                    let rl = new RegExp("\\d+\\.\\d{" + (this.rateScale + 1) + ",}", "i");
                    if (rl.test(newTsOffset)) {
                        this.form.ts_offset = oldTsOffset;
                        this.$refs.bid_limit_ts_offset.lazyValue = oldTsOffset;
                    } else {
                        this.form.ts_offset = newTsOffset;
                    }
                } else {
                    this.form.ts_offset = 0;
                }
            },
        },
        mounted() {
            this.debouncedUpdateAmount = _.debounce(this.updateAmount, 50);
            this.debouncedUpdateVolume = _.debounce(this.updateVolume, 50);
            this.debouncedUpdateOffers = _.debounce(this.updateOffers, 1000);
        },
        created() {
            this.$eventHub.$on('set-buy-price', this.setFormRate);
        },
        beforeDestroy() {
            this.$eventHub.$off('set-buy-price', this.setFormRate);
        },
        activated(){
            this.$eventHub.$on('set-buy-price', this.setFormRate);
        },
        deactivated(){
            this.$eventHub.$off('set-buy-price', this.setFormRate);
        },
    }
</script>

<style scoped>

</style>