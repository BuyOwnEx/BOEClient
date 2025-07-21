<template>
	<v-container class='text-start'>
    <v-row>
      <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
      <v-col cols="12" sm="12" md="10" lg="8" xl="8">
        <div class='text-uppercase font-weight-bold body-2 primary--text mb-2'>{{ $t('landing.features.primary_title') }}</div>
        <h2 class='text-h3'>{{ $t('landing.features.main_title') }}</h2>
      </v-col>
      <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
    </v-row>
		<v-row>
      <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
      <v-col cols="12" sm="12" md="5" lg="4" xl="4">
        <div class='d-flex my-md-4'>
          <div class='mr-2'>
            <v-sheet class='pa-2'>
              <img class="feature-img" :src="service_logo_1" alt="">
            </v-sheet>
          </div>
          <div>
            <div class='text-h5 primary--text mb-4'>{{ $t('landing.features.option_1.text') }}</div>
            <div class='text-h6 font-weight-light mt-1'>
              <span>{{ $t('landing.features.option_1.feature_1') }}</span><br>
              <span>{{ $t('landing.features.option_1.feature_2') }}</span><br>
              <span>{{ $t('landing.features.option_1.feature_3') }}</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="5" lg="4" xl="4">
        <div class='d-flex my-md-4'>
          <div class='mr-2'>
            <v-sheet class='pa-2'>
              <img class="feature-img" :src="service_logo_2" alt="">
            </v-sheet>
          </div>
          <div>
            <div class='text-h5 primary--text mb-4'>{{ $t('landing.features.option_2.text') }}</div>
            <div class='text-h6 font-weight-light mt-1'>
              <span>{{ $t('landing.features.option_2.feature_1') }}</span><br>
              <span>{{ $t('landing.features.option_2.feature_2') }}</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="0" md="1" lg="2" xl="2" class="d-none d-md-block"></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="0" md="1" lg="2" xl="2" class="d-none d-md-block"></v-col>
      <v-col cols="12" sm="12" md="5" lg="4" xl="4">
        <div class='d-flex my-md-4'>
          <div class='mr-2'>
            <v-sheet class='pa-2'>
              <img class="feature-img" :src="service_logo_3" alt="">
            </v-sheet>
          </div>
          <div>
            <div class='text-h5 primary--text mb-4'>{{ $t('landing.features.option_3.text') }}</div>
            <div class='text-h6 font-weight-light mt-1'>
              <span>{{ $t('landing.features.option_3.feature_1') }}</span><br>
              <span>{{ $t('landing.features.option_3.feature_2') }}</span><br>
              <span>{{ $t('landing.features.option_3.feature_3') }}</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="5" lg="4" xl="4">
        <div class='d-flex my-md-4'>
          <div class='mr-2'>
            <v-sheet class='pa-2'>
              <img class="feature-img" :src="service_logo_4" alt="">
            </v-sheet>
          </div>
          <div>
            <div class='text-h5 primary--text mb-4'>{{ $t('landing.features.option_4.text') }}</div>
            <div class='text-h6 font-weight-light mt-1'>
              <span>{{ $t('landing.features.option_4.feature_1') }}</span><br>
              <span>{{ $t('landing.features.option_4.feature_2') }}</span><br>
              <span>{{ $t('landing.features.option_4.feature_3') }}</span>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
		</v-row>
	</v-container>
</template>
<script>
export default {
  data() {
    return {
      service_logo_1: '/storage/landing/service-1.png',
      service_logo_2: '/storage/landing/service-2.png',
      service_logo_3: '/storage/landing/service-3.png',
      service_logo_4: '/storage/landing/service-4.png'
    }
  }
}
</script>
<style scoped>
.feature-img {
  width: 100px;
}
@media (min-width: 960px) {
  .container {
    max-width: none;
  }
}
</style>