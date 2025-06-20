<template>
  <div class="avatars">
    <span :class="tile ? 'avatar tile align-self-center' : 'avatar align-self-center'" v-for="item in items" :style="size ? 'width: '+size+'px' : ''">
        <img v-if="item.logo" alt="" :src="'/'+item.logo" />
        <v-avatar v-else :color="getRandomColor(item.name)" :size="size" :tile="tile">
          <span class="white--text" style="font-size: 0.6rem">{{ item.name.charAt(0) }}</span>
        </v-avatar>
    </span>
  </div>
</template>

<script>
import randomColor from 'randomcolor';
export default {
  name: "OverlapImages",
  props: {
    items: {
      type: Array,
      required: true,
      default: [],
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
  methods: {
    getRandomColor(seed) {
      return randomColor({
        seed: seed,
        luminosity: 'dark',
        format: 'rgba',
        alpha: 0.5,
      });
    },
  },
}
</script>

<style scoped lang="scss">
.avatars {
  display: inline-flex;
  align-self: center;
}
.avatar {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  width: 20px;
}
.tile {
  border-radius: 0 !important;
}
.avatar:not(:last-child) {
  margin-right: -8px;
}
.avatar img {
  width: 100%;
  display: block;
}
</style>
