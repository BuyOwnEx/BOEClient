<template>
  <div class="d-flex text-center flex-column flex-md-row flex-grow-1">
    <v-sheet class="layout-side mx-auto d-none d-md-flex flex-md-column justify-space-between" style="background: linear-gradient(5deg, #142f6d 0%, #091c48 40%);">
      <canvas class="waves" id="waves"></canvas>
      <div class="mt-3 mt-md-10 pa-2">
        <div class="display-2 font-weight-bold primary--text">
          {{ product.name }}
        </div>
        <div class="title my-2 white--text">be the future. be the crypto</div>
        <v-btn href="/" class="my-4">Take me back</v-btn>
      </div>
      <div class="pa-2 mb-1">
        <v-img max-width="250" src="/images/logo_full.png" class="ma-auto"></v-img>
      </div>
    </v-sheet>

    <div class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column">
      <div class="layout-content ma-auto w-full">
        <slot></slot>
      </div>
      <div class="overline mt-4">{{ product.name }} - {{ product.version }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState('app', ['product'])
  },
  methods: {

  },
}
</script>

<style scoped>
.layout-side {
  width: 420px;
}

.layout-content {
  max-width: 480px;
}
.waves {
  width: 100%;
  max-height: 100%;
  position: absolute;
  top: 0;
  left: -2px;
  height: 100vh;
}
</style>
