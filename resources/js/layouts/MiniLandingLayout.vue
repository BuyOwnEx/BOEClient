<template>
  <v-main>
    <router-view :key="$route.fullPath"></router-view>
  </v-main>
</template>
<script>
export default {
  name: "MiniLandingLayout",
  mounted() {
    this.$vuetify.theme.dark = true;
  },
}
</script>

<style scoped lang="sass">
:root
  --text-color: #00aa00
.v-main
  font-family: "Roboto", sans-serif
  background-color: #333
  color: #ccc
  font-size: 18px
  line-height: 1.6
</style>