<template>
  <v-sheet>
    <v-container class="text-start">
      <v-row>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
        <v-col cols="12" sm="12" md="5" lg="4" xl="4">
          <div class="how-to-text">
            <h4 class='text-h4 text-center text-md-left'>
              {{ $t('landing.how_to.main_title', [app_name]) }}
            </h4>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="5" lg="4" xl="4">
          <div class="how-to-available-text mb-1 caption text-center text-md-left">
            {{ $t('landing.how_to.available_currencies_text') }}
          </div>
          <div class="how-to-block pt-1 d-flex justify-space-between">
            <div v-for="item in currencies" :key="item" class="d-flex flex-column mr-1">
              <div class="text-center">
                <img width="32px" :src="getCurrencyLogo(item)" :alt="item.toLowerCase()">
              </div>
              <div class="currency-text text-center">{{ item.toUpperCase() }}</div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
      </v-row>
      <v-row class="mt-6">
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
        <v-col cols="12" sm="12" md="10" lg="8" xl="8" class="d-flex flex-column flex-md-row justify-space-between">
          <div class="d-flex flex-column mr-10">
            <div class="d-flex justify-space-between mb-4">
              <span class="step-text primary--text">01</span>
            </div>
            <div class="step-text-detail text-left">{{ $t('landing.how_to.step_1_text') }}</div>
            <div>
              <Link class="link-with-underline text-uppercase mt-10" path="/register">{{ $t('landing.how_to.step_1_action') }}</Link>
            </div>
          </div>
          <div class="d-flex flex-column mr-10">
            <div class="d-flex justify-space-between mb-4">
              <span class="step-text primary--text">02</span>
            </div>
            <div class="step-text-detail text-left">{{ $t('landing.how_to.step_2_text') }}</div>
            <div>
              <Link class="link-with-underline text-uppercase mt-10" path="/login">{{ $t('landing.how_to.step_2_action') }}</Link>
            </div>
          </div>
          <div class="d-flex flex-column">
            <div class="d-flex justify-space-between mb-4">
              <span class="step-text primary--text">03</span>
            </div>
            <div class="step-text-detail text-left">{{ $t('landing.how_to.step_3_text') }}</div>
            <div>
              <Link class="link-with-underline text-uppercase mt-10" path="/trading">{{ $t('landing.how_to.step_3_action') }}</Link>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>
<script>
import Link from "@/components/common/Link.vue";
export default {
  name: 'HowTo',
  props: ['app_name'],
  components: {
    Link
  },
  data() {
    return {
      currencies: ['btc','ltc','bch','eth','trx','bnb','usdt'],
      landing_arrow_right_logo: '/storage/landing/landing-arrow-right.svg',
    }
  },
  methods: {
    getCurrencyLogo(currency) {
      return '/storage/currencies/'+currency.toLowerCase()+'.png'
    }
  },
};
</script>
<style scoped>
.how-to-available-text {
  font-size: 14px !important;
}
.currency-text {
  color: #eaeaea;
}
.step-text {
  line-height: 143px;
  font-size: 130px;
  font-weight: 500;
}
.step-text-detail {
  color: #eaeaea;
}
.arrow-img {
  opacity: 0.45;
  width: 30px;
}
.link-with-underline {
  text-decoration: none; /* Remove default underline */
  position: relative;
  display: inline-block; /* Important for positioning the underline */
}

.link-with-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0; /* Initially hidden */
  height: 2px; /* Underline thickness */
  background-color: currentColor; /* Use the link's color */
  transition: width 0.3s ease; /* Animation duration and easing */
}

.link-with-underline:hover::after {
  width: 100%; /* Expand to full width on hover */
}
@media (min-width: 960px) {
  .container {
    max-width: none;
  }
}
@media (max-width: 960px) {
  .step-text {
    line-height: 64px;
    font-size: 60px;
    font-weight: 500;
  }
  .arrow-img {
    display: none;
  }
}
</style>