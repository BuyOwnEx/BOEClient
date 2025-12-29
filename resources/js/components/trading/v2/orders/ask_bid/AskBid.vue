<template>
  <v-card class="ask-bid-list d-flex flex-column pa-1">
    <v-card-title class="ask-bid-list__header component-title pa-0">
      {{ $t('trading.headers.order_book') }}
    </v-card-title>
    <AskListTableHeader :currency="currency" :market="market" />
    <v-card-text class="d-flex flex-column fill-height ask-bid-list__content pa-0">
      <AskList class="trading__mobile__orders__ask flex-grow-1" :currency="currency" :market="market" />
      <AskBidLastPrice
          class="trading__mobile__orders__last-price flex-grow-0"
          id="last-price"
          ref="askBidLastPrice"
          :market="market"
          @mounted="moveToOrdersLastPrice"
      />
      <BidList class="trading__mobile__orders__bid flex-grow-1" :currency="currency" :market="market" />
    </v-card-text>
  </v-card>
</template>

<script>
import AskList from "@/components/trading/v2/orders/ask/AskList.vue";
import BidList from "@/components/trading/v2/orders/bid/BidList.vue";
import AskBidLastPrice from "@/components/trading/v2/orders/mobile/AskBidLastPrice.vue";
import HistoryDealListTableWrapper from "@/components/trading/v2/history/table/HistoryDealListTableWrapper.vue";
import AskListTableHeader from "@/components/trading/v2/orders/ask/table/AskListTableHeader.vue";

export default {
  name: "AskBid",
  props: {
    currency: {
      type: String,
      required: true,
    },
    market: {
      type: String,
      required: true,
    },
  },
  components: {
    AskListTableHeader,
    HistoryDealListTableWrapper,
    BidList,
    AskList,
    AskBidLastPrice
  },
  methods: {
    moveToOrdersLastPrice() {
      const element = this.$refs.askBidLastPrice.$el;
      element.scrollIntoView({
        block: 'center',
      });
    },
  },
}
</script>

<style scoped lang="sass">
.ask-bid-list
  &__header
    margin: 0 4px
    font-size: 12px !important
    letter-spacing: 0.982143px
    line-height: 25px
    opacity: 0.8
</style>