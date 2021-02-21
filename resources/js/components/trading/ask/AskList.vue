<template>
  <v-card class="ask-list pa-1">
    <v-card-title class="ask-list__title pa-0 pb-1">
      SELL ORDERS
    </v-card-title>

    <v-card-text v-if="askList !== null" class="ask-list__content pa-1 pt-0">
      <AskListItem
        v-for="(ask, index) in askList.slice().reverse()"
        :item="ask"
        :index="index"
        :key="ask.price"
        :ask_volume="askVolumeDepth"
        :currency="currency"
        :market="market"
      />
    </v-card-text>
    <!--<ask-depth
                :amount="ask_amount_depth"
                :volume="ask_volume_depth"></ask-depth>-->
  </v-card>
</template>

<script>
import AskListItem from "./AskListItem.vue";
export default {
  name: "AskList",

  components: {
    AskListItem
  },

  props: [
    "currency",
    "market"
    // "ask_list",
    // "ask_volume_depth",
    // "ask_amount_depth"
  ],

  computed: {
    askList() {
      return this.$store.state.trading.ask_list;
    },
    askAmountDepth() {
      return this.$store.state.trading.ask_amount_depth;
    },
    askVolumeDepth() {
      return this.$store.state.trading.ask_volume_depth;
    },
    bestAsk() {
      return this.$store.state.trading.best_ask;
    }
  }
};
</script>

<style scoped lang="sass">
.ask-list
  &__content
    overflow-y: hidden
    position: absolute
    top: 46px
    bottom: 12px
    left: 0
    right: 0
</style>
