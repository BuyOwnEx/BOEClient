<template>
  <v-card class="hdl pa-1">
    <v-card-title class="hdl__header text-uppercase pa-0">
      {{ $t("trading.headers.history_deal_list") }}
    </v-card-title>

    <v-card-text class="hdl__content pa-0">
      <div v-if="!historyDealList || isLoading" class="text-center mt-3">
        <v-progress-circular
          color="primary"
          size="30"
          width="2"
          indeterminate
        />
      </div>

      <HistoryDealListTableWrapper
        v-else
        :currency="currency"
        :historyData="historyDealList"
        :market="market"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import HistoryDealListTableWrapper from "./table/HistoryDealListTableWrapper";

export default {
  name: "HistoryDealList",

  props: {
    currency: {
      type: String,
      required: true
    },
    market: {
      type: String,
      required: true
    }
  },

  components: { HistoryDealListTableWrapper },

  data() {
    return {
      isLoading: true
    };
  },

  computed: {
    selectedMarket() {
      return this.$store.state.trading.selectedMarket === null
        ? ""
        : this.$store.state.trading.selectedMarket.toUpperCase();
    },
    selectedCurrency() {
      return this.$store.state.trading.selectedCurrency === null
        ? ""
        : this.$store.state.trading.selectedCurrency.toUpperCase();
    },
    historyDealList() {
      return this.$store.state.trading.history_deal_list;
    },
  },

  mounted() {
    this.isLoading = false;
  }
};
</script>

<style scoped lang="sass">
.hdl
  display: flex
  flex-flow: column
  flex-grow: 1
  position: relative

  &__header
    word-break: normal
    font-weight: 700
    margin-left: 4px
</style>
