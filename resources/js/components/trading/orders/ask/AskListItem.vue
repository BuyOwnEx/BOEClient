<template>
  <div
    class="order clickable d-flex align-center"
    @click="emitPrice"
    style="position: relative"
  >
    <span
      class="order_info asks_price text-danger d-inline-block flex-grow-1 flex-shrink-1 text-left"
      >{{ price }} {{ market }}</span
    >
    <span
      class="order_info asks_amount d-inline-block flex-grow-1 flex-shrink-1 text-right"
      >{{ size }} {{ currency }}</span
    >
    <span
      class="order_info asks_value d-inline-block flex-grow-1 flex-shrink-1 text-right"
      >{{ volume }} {{ market }}</span
    >
    <i
      class="order_info progressbar"
      :style="{ width: percent + '%' }"
      style="position: absolute; height: 100%; z-index:1"
    ></i>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: [-15, 20] });

export default {
  name: "AskListItem",

  props: ["currency", "market", "item", "ask_volume"],

  computed: {
    volume: function() {
      return BigNumber(this.item.price)
        .times(BigNumber(this.item.actualSize))
        .toString();
    },
    size: function() {
      return BigNumber(this.item.actualSize).toString();
    },
    price: function() {
      return BigNumber(this.item.price).toString();
    },
    percent: function() {
      return BigNumber(this.item.actualSize)
        .times(100)
        .div(BigNumber(this.ask_volume))
        .dp(2)
        .toString();
    }
  },

  methods: {
    emitPrice() {
      this.$eventHub.$emit("set-buy-price", { price: this.price });
    }
  }
};
</script>

<style scoped></style>
