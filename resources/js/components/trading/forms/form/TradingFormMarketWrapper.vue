<template>
  <v-row class="tfmw" align="start" justify="center" no-gutters>
    <v-col cols="12" md="6" class="tfmw__bid px-1">
      <v-card outlined>
        <v-card-title class="tfmw__title text-uppercase pb-1">
          {{ $t("trading.order.direction.buy") }}
          {{ currency }}
        </v-card-title>
        <v-card-text>
          <keep-alive>
            <BidMarketForm :currency="currency" :market="market" />
          </keep-alive>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="6" class="tfmw__ask px-1">
      <v-card outlined>
        <v-card-title class="tfmw__title text-uppercase pb-1">
          {{ $t("trading.order.direction.sell") }}
          {{ currency }}
        </v-card-title>
        <v-card-text>
          <keep-alive>
            <AskMarketForm :currency="currency" :market="market" />
          </keep-alive>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AskMarketForm from "../ask/AskMarketForm";
import BidMarketForm from "../bid/BidMarketForm";

export default {
  name: "TradingFormMarketWrapper",
  components: { AskMarketForm, BidMarketForm },
  props: {
    currency: {
      type: String,
      required: true
    },
    market: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.tfmw {
  &__title {
    font-size: 1rem;
  }
}
@media screen and (max-width: 960px) {
  .tfmw {
    &__ask {
      margin: 1rem 0;
    }
  }
}
</style>
