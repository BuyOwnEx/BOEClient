<template>
  <div class="d-flex">
    <overlap-images
      :items="items"
    ></overlap-images>
    <span class="ml-1 align-self-center">{{ currency }}/{{ market }}</span>
  </div>
</template>

<script>
import OverlapImages from '@/components/common/OverlapImages.vue';
export default {
  name: "PairWithLogo",
  props: {
    currency: {
      type: String,
      required: true,
    },
    market: {
      type: String,
      required: true,
    },
    currency_logo: {
      type: String,
      required: false,
    },
    market_logo: {
      type: String,
      required: false,
    },
  },
  components: { OverlapImages },
  computed: {
    items() {
      return [
        { name: this.currency, logo: this.currency_logo},
        { name: this.market, logo: this.market_logo}
      ];
    }
  }
}
</script>

<style scoped>

</style>
