<template>
  <v-sheet>
    <v-container class="text-start">
      <v-row>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
        <v-col cols="12" sm="12" md="5" lg="4" xl="4">
          <div class="float-none float-md-right mr-md-10 text-center text-md-left">
            <div class='text-uppercase font-weight-bold body-2 primary--text mb-2 mt-0 mt-xl-10'>{{ $t('landing.fees.primary_title') }}</div>
            <h2 class='text-h3'>{{ $t('landing.fees.main_title') }}</h2>
            <div class="mt-4">
              <img class="fees-img" :src="fee_logo" alt="">
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="12" md="5" lg="4" xl="4" class="align-content-end">
          <div class="pt-8 d-flex justify-space-around justify-md-space-between">
            <div class="fees-block d-flex flex-column">
              <div class="fee-value primary--text text-center"><span class="fee-value-from mr-1">{{ $t('common.from') }}</span>{{ deal_min_fee }}%</div>
              <div class="fees-block-text mt-4 text-center">{{ $t('landing.fees.deals_fee') }}</div>
            </div>
            <div class="fees-block d-flex flex-column">
              <div class="fee-value primary--text text-center"><span class="fee-value-from mr-1">{{ $t('common.from') }}</span>{{ fiat_replenish_min_fee }}%</div>
              <div class="fees-block-text mt-4 text-center">{{ $t('landing.fees.fiat_replenish_fee') }}</div>
            </div>
          </div>
          <div class="landing-line primary mt-14 mb-4"></div>
        </v-col>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>
<script>
export default {
  data() {
    return {
      deal_min_fee: 0.07,
      fiat_replenish_min_fee: 0,
      fee_logo: '/storage/landing/landing-fees.png'
    }
  }
}
</script>
<style scoped>
.fee-value {
  line-height: 74px;
  font-size: 70px;
}
.fee-value-from {
  line-height: 42px;
  font-size: 40px;
}
.fees-block {
  width: 270px;
}
.fees-block-text {
  line-height: 26px;
  font-size: 17px;
  font-weight: 400;
  color: #eaeaea;
}
.landing-line {
  height: 2px;
}
@media (min-width: 960px) {
  .container {
    max-width: none;
  }
  .fees-img {
    width: 100%;
  }
  .fee-value {
    line-height: 60px;
    font-size: 56px;
  }
}
@media (min-width: 1264px) {
  .fee-value {
    line-height: 64px;
    font-size: 60px;
  }
}
@media (max-width: 960px) {
  .fees-img {
    width: 100%;
  }
}
</style>