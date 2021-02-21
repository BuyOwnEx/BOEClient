<template>
    <div class="bids_last_price_line text-center">
        <div class="bids_last_price ib"
             :class="{'text-success': lastChangeIsPositive, 'text-danger': lastChangeIsNegative}">
                <span class="glyphicon"
                      :class="{'glyphicon-arrow-down': lastChangeIsNegative, 'glyphicon-arrow-up': lastChangeIsPositive}"></span>
            {{ lastPrice }} {{ market.toUpperCase() }}
        </div>
    </div>
</template>

<script>
    import BigNumber from 'bignumber.js';
    BigNumber.config({EXPONENTIAL_AT: [-15, 20]});

    export default {
        name: "AskBidLastPrice",
        props: ['market'],
        computed: {
            ticker() {
                return this.$store.getters['trading/activeTicker'];
            },
            lastPrice() {
                return this.ticker ? BigNumber(this.ticker.latest).toString() : 0;
            },
            $_lastChange() {
                return this.ticker ? BigNumber(this.ticker.latest).minus(BigNumber(this.ticker.previous)) : null;
            },
            lastChangeIsPositive() {
                return this.ticker ? this.$_lastChange.isPositive() : false;
            },
            lastChangeIsNegative() {
                return this.ticker ? this.$_lastChange.isNegative() : false;
            }
        }
    }
</script>

<style scoped>

</style>