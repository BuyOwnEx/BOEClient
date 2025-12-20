<template>
  <div style="background-color: #1e1e1e">
    <v-sheet class="sheet-home pb-md-10">
      <v-container class="pt-lg-15 text-start">
        <v-row>
          <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
          <v-col cols="12" sm="12" md="5" lg="4" xl="4">
            <div class="text-center text-md-right">
              <img class="landing-home-img" :src="home_logo" alt="">
            </div>
          </v-col>
          <v-col cols="12" sm="12" md="5" lg="4" xl="4">
            <h6 class="text-h6 text-sm-h4 text-md-h5 text-lg-h6 mb-2"><span class="primary--text">{{ $t('landing.home.primary_title') }}</span></h6>
            <h1 class="text-h4 text-sm-h3 text-md-h2 text-lg-h1" style="font-weight: 600">{{ config.product.name }}</h1>
            <h2 class="text-h6 text-sm-h5 mt-4 w-full w-md-8-12 w-xl-half text-uppercase">{{ $t('landing.home.main_title') }}</h2>
            <div class="mt-8 d-flex flex-column">
              <div class="landing-line primary w-md-8-12"></div>
              <div class="landing-home-slogan mt-1 text-start w-xl-half">{{ $t('landing.home.slogan_1') }}</div>
              <div class="landing-line primary mt-4 w-md-8-12"></div>
              <div class="landing-home-slogan mt-1 text-start w-xl-half">{{ $t('landing.home.slogan_2') }}</div>
            </div>
          </v-col>
          <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <Fees />

    <HowTo :app_name="config.product.name" />

    <Suitable />

    <Faq :app_name="config.product.name" />

    <Feature2 />

  </div>
</template>

<script>
import Fees from '@/components/landing/Fees.vue';
import HowTo from '@/components/landing/HowTo.vue';
import Suitable from '@/components/landing/Suitable.vue';
import Faq from '@/components/landing/Faq.vue';
import Feature2 from '@/components/landing/Feature2.vue'
import config from '@/configs'
export default {
  components: {
    Fees,
    HowTo,
    Suitable,
    Faq,
    Feature2
  },
  data() {
    return {
      config,
      home_logo: '/storage/landing/landing-home.png'
    }
  }
}
</script>
<style scoped>
.sheet-home {
  background-image: url('@/assets/images/landing/landing-background.png');
  background-size: cover;
  background-position: right center;
  background-repeat: no-repeat;
}
.landing-line {
  height: 2px;
}
.landing-home-slogan {
  line-height: 39px;
  height: auto;
  font-size: 20px;
  font-weight: 600;
  color: #eaeaea;
}
@media (min-width: 960px) {
  .container {
    max-width: none;
  }
  .landing-home-img {
    width: 100%;
  }
}
@media (max-width: 600px) {
  .landing-home-img {
    width: 100%;
  }
}
</style>