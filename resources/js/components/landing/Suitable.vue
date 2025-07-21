<template>
  <v-sheet class="sheet-suitable">
    <v-container class="text-start">
      <v-row>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2"></v-col>
        <v-col cols="12" sm="12" md="5" lg="4" xl="4">
          <h4 class='text-h4'>{{ $t('landing.suitable.main_title') }}</h4>
        </v-col>
        <v-col cols="12" sm="12" md="5" lg="4" xl="4">
          <div class="mb-1 mt-2 mt-md-0 body-2">
            {{ $t('landing.suitable.main_text') }}
          </div>
        </v-col>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2" class="d-none d-md-block"></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2" class="d-none d-md-block"></v-col>
        <v-col cols="12" sm="12" md="10" lg="8" xl="8">
          <v-row>
            <v-col cols="12">
              <div class="landing-line primary mt-0 mt-md-10 mb-0 mb-md-4"></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="suitable-option">{{ $t('landing.suitable.option_1.text') }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="d-flex flex-column">
                    <span class="suitable-text">{{ $t('landing.suitable.option_1.action_1') }}</span>
                    <span class="suitable-text">{{ $t('landing.suitable.option_1.action_2') }}</span>
                    <span class="suitable-text">{{ $t('landing.suitable.option_1.action_3') }}</span>
                    <div class="mt-6">
                      <Link class="link-with-underline mr-6" path="/login">{{ $t('landing.suitable.login') }}</Link>
                      <Link style="color: #eaeaea;" class="link-with-underline" path="/register">{{ $t('landing.suitable.register') }}</Link>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="landing-line primary mt-0 mt-md-10 mb-0 mb-md-4"></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="suitable-option">{{ $t('landing.suitable.option_2.text') }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="d-flex flex-column">
                    <span class="suitable-text">{{ $t('landing.suitable.option_2.action_1') }}</span>
                    <span class="suitable-text">{{ $t('landing.suitable.option_2.action_2') }}</span>
                    <span class="suitable-text">{{ $t('landing.suitable.option_2.action_3') }}</span>
                    <div class="mt-6">
                      <Link class="link-with-underline mr-6" path="/login">{{ $t('landing.suitable.login') }}</Link>
                      <Link style="color: #eaeaea;" class="link-with-underline" path="/register">{{ $t('landing.suitable.register') }}</Link>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="landing-line primary mt-0 mt-md-10 mb-0 mb-md-4"></div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="suitable-option">{{ $t('landing.suitable.option_3.text') }}</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="d-flex flex-column">
                    <span class="suitable-text">{{ $t('landing.suitable.option_3.action_1') }}</span>
                    <span class="suitable-text">{{ $t('landing.suitable.option_3.action_2') }}</span>
                    <span class="suitable-text">{{ $t('landing.suitable.option_3.action_3') }}</span>
                    <div class="mt-6">
                      <Link class="link-with-underline mr-6" path="/login">{{ $t('landing.suitable.login') }}</Link>
                      <Link style="color: #eaeaea;" class="link-with-underline" path="/register">{{ $t('landing.suitable.register') }}</Link>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="0" md="1" lg="2" xl="2" class="d-none d-md-block"></v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>
<script>
import Link from "@/components/common/Link.vue";
export default {
  name: 'HowTo',
  components: {
    Link
  },
};
</script>
<style scoped>
.sheet-suitable {
  background-image: url('@/assets/images/landing/landing-suitable-background.png');
  background-size: cover;
  background-position: right center;
  background-repeat: no-repeat;

}
@media (min-width: 960px) {
  .container {
    max-width: none;
  }
}
.landing-line {
  height: 2px;
  width: 100%;
}
.suitable-option {
  width: 300px;
  line-height: 39px;
  font-size: 20px;
  font-weight: 700;
  color: #eaeaea;
}
.suitable-text {
  line-height: 28px;
  font-size: 16px;
  font-weight: 500;
  color: #eaeaea;
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
</style>