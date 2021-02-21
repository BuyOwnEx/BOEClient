<template>
  <v-card class="bid-list pa-1">
    <v-card-title class="bid-list__title pa-0 pb-1">
      BUY ORDERS
    </v-card-title>

    <v-card-text v-if="bidList !== null" class="bid-list__content pa-1 pt-0">
      <BidListItem
        v-for="(bid, index) in bidList"
        :item="bid"
        :index="index"
        :key="bid.price"
        :bid_volume="bidVolumeDepth"
        :currency="currency"
        :market="market"
      />
    </v-card-text>
    <!--<bid-depth
                :amount="bid_amount_depth"
                :volume="bid_volume_depth"></bid-depth>-->
  </v-card>
</template>

<script>
import BidListItem from "./BidListItem.vue";
export default {
  name: "BidList",

  components: {
    BidListItem
  },

  props: [
    "currency",
    "market"
    // "bid_list",
    // "bid_volume_depth",
    // "bid_amount_depth"
  ],

  computed: {
    bidList() {
      return this.$store.state.trading.bid_list;
    },
    bidAmountDepth() {
      return this.$store.state.trading.bid_amount_depth;
    },
    bidVolumeDepth() {
      return this.$store.state.trading.bid_volume_depth;
    },
    bestBid() {
      return this.$store.state.trading.best_bid;
    }
  }
};
</script>

<style scoped lang="sass">
.bid-list
  &__content
    overflow-y: hidden
    position: absolute
    top: 46px
    bottom: 12px
    left: 0
    right: 0
</style>
