<template>
  <div class="d-flex">
    <overlap-images
      :items="item"
      :size="size"
      :tile="tile"
    ></overlap-images>
    <span class="ml-1 align-self-center">{{ cell_text }}</span>
  </div>
</template>

<script>
import OverlapImages from "./OverlapImages.vue";
export default {
  name: "ItemWithLogo",
  props: {
    cell_text: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: false,
    },
    tile: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: Number,
      required: false,
      default: 20
    }
  },
  components: { OverlapImages },
  computed: {
    item() {
      return [
        { name: this.cell_text, logo: this.logo}
      ];
    }
  }
}
</script>

<style scoped>

</style>
