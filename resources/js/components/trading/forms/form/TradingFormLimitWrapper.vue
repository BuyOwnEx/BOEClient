<template>
  <v-row class="tflw" align="start" justify="center" no-gutters>
    <v-col cols="12" md="6" class="tflw__bid px-1">
      <v-card outlined>
        <v-card-title class="tflw__title text-uppercase pb-1">
          {{ $vuetify.lang.translator("trading.order.direction.buy") }}
          {{ currency }}
        </v-card-title>
        <v-card-text>
          <keep-alive>
            <BidLimitForm :currency="currency" :market="market" />
          </keep-alive>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="6" class="tflw__ask px-1">
      <v-card outlined>
        <v-card-title class="tflw__title text-uppercase pb-1">
          {{ $vuetify.lang.translator("trading.order.direction.sell") }}
          {{ currency }}
        </v-card-title>
        <v-card-text>
          <keep-alive>
            <AskLimitForm :currency="currency" :market="market" />
          </keep-alive>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AskLimitForm from "../ask/AskLimitForm";
import BidLimitForm from "../bid/BidLimitForm";

export default {
  name: "TradingFormLimitWrapper",

  components: { AskLimitForm, BidLimitForm },

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
.tflw {
  &__title {
    font-size: 1rem;
  }
}
@media screen and (max-width: 960px) {
  .tflw {
    &__ask {
      margin: 1rem 0;
    }
  }
}
</style>
