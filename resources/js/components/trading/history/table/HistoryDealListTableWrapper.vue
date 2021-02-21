<template>
  <v-simple-table
    class="hdl__content__table"
    :height="calculateTableHeight"
    dense
    fixed-header
  >
    <template v-slot:default>
      <HistoryDealListTableHeader :currency="currency" :market="market" />
      <HistoryDealListTableBody :history-data="historyData" />
    </template>
  </v-simple-table>
</template>

<script>
import HistoryDealListTableBody from "./HistoryDealListTableBody";
import HistoryDealListTableHeader from "./HistoryDealListTableHeader";

export default {
  name: "HistoryDealListTableWrapper",

  components: { HistoryDealListTableBody, HistoryDealListTableHeader },

  props: {
    currency: {
      type: String,
      required: true
    },
    market: {
      type: String,
      required: true
    },
    historyData: {
      type: Array,
      required: true
    }
  },

  computed: {
    calculateTableHeight() {
      const deviceWidth = this.$vuetify.breakpoint.width;
      const mobile = deviceWidth <= 960;
      const mid = deviceWidth > 960 && deviceWidth <= 1264;
      const mid2 = deviceWidth > 1264 && deviceWidth <= 1382;
      const mid3 = deviceWidth > 1382 && deviceWidth <= 1768;

      if (mobile) return undefined;
      else if (mid) return 380;
      else if (mid2) return 380;
      else if (mid3) return 1097;
      else return 846;
    }
  }
};
</script>

<style scoped lang="sass"></style>
