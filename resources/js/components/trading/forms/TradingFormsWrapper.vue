<template>
  <v-card class="tf pa-1">
    <div class="tf__actions px-2">
      <v-btn
        class="pt-2 pb-2"
        :class="{ selected: activeTradingFormsDisplayMode === 'limit' }"
        small
        tile
        :text="!isSelectedLimitMode"
        @click="activeTradingFormsDisplayMode = 'limit'"
      >
        <span>{{ $t("trading.order.type.limit") }}</span>
      </v-btn>
      <v-btn
        class="pt-2 pb-2"
        :class="{ selected: activeTradingFormsDisplayMode === 'market' }"
        small
        tile
        :text="!isSelectedMarketMode"
        @click="activeTradingFormsDisplayMode = 'market'"
      >
        <span>{{ $t("trading.order.type.market") }}</span>
      </v-btn>
    </div>

    <div class="tf__content">
      <TradingFormLimitWrapper
        v-if="activeTradingFormsDisplayMode === 'limit'"
        :currency="currency"
        :market="market"
      />
      <TradingFormMarketWrapper
        v-if="activeTradingFormsDisplayMode === 'market'"
        :currency="currency"
        :market="market"
      />
    </div>
  </v-card>
</template>

<script>
import TradingFormLimitWrapper from "./form/TradingFormLimitWrapper";
import TradingFormMarketWrapper from "./form/TradingFormMarketWrapper";

export default {
  name: "TradingForms",

  components: { TradingFormMarketWrapper, TradingFormLimitWrapper },

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

  data() {
    return {
      activeTradingFormsDisplayMode: "limit"
    };
  },

  computed: {
    isSelectedLimitMode() {
      return this.activeTradingFormsDisplayMode === "limit";
    },
    isSelectedMarketMode() {
      return this.activeTradingFormsDisplayMode === "market";
    }
  },

  mounted() {}
};
</script>

<style scoped lang="scss">
.tf {
  display: flex;
  flex-grow: 1;
  flex-flow: column;

  &__actions {
    padding-bottom: 0.5rem;
  }
  &__content {
  }
}

@media screen and (max-width: 960px) {
  .tf {
    &__content {
      &__sell {
        padding-top: 2rem;
      }
    }
  }
}
</style>
