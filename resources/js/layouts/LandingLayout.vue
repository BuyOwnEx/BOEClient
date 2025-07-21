<template>
  <div>
    <v-app-bar dark flat height="80">
      <v-container class="py-0 px-0 px-sm-2 fill-height">
        <v-spacer></v-spacer>
        <div class="d-block">
          <v-btn text class="mx-1" to="/login">
            {{ $t('menu.login') }}
          </v-btn>
        </div>
        <v-btn outlined large to="/register">
          {{ $t('menu.register') }}
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view :key="$route.fullPath"></router-view>
      <v-footer dark color="#0b0b0b">
        <v-container class="footer_container">
          <v-row>
            <v-col cols="12" md="4">
              <div class="text-h6 text-lg-h5 font-weight-bold"> {{ $t('landing.footer.navigation.title') }} </div>
              <div style="width: 80px; height: 2px" class="mb-5 mt-1 primary" />
              <div class="d-flex flex-wrap">
                <div v-for="(link, i) in links" :key="i" class="w-half body-1 mb-1">
                <Link style="color: #eaeaea;" class="text-decoration-none link-with-underline" :path="link.to">{{ link.label }}</Link>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-h6 text-lg-h5 font-weight-bold">{{ $t('menu.contacts') }}</div>
              <div style="width: 80px; height: 2px" class="mb-5 mt-1 primary" />
              <div class="d-flex mb-2 font-weight-bold">
                <v-icon dark color="primary lighten-1" class="mr-2">mdi-map-marker-outline</v-icon>
                {{ config.product.company_address }}
              </div>
              <div class="d-flex mb-2">
                <v-icon dark color="primary lighten-1" class="mr-2">mdi-phone-outline</v-icon>
                <a href="#" class="text-decoration-none text--primary">
                  {{ config.product.company_phone }}
                </a>
              </div>
              <div class="d-flex mb-2">
                <v-icon dark color="primary lighten-1" class="mr-2">mdi-email-outline</v-icon>
                <a href="#" class="text-decoration-none text--primary">
                  {{ config.product.company_email }}
                </a>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-h6 text-lg-h5 font-weight-bold">{{ $t('landing.footer.newsletter') }}</div>
              <div style="width: 80px; height: 2px" class="mb-5 mt-1 primary" />
              <div class="d-flex flex-column flex-lg-row w-full">
                <v-text-field
                  outlined
                  solo
                  :label="$t('landing.footer.newsletter_label')"
                  dense
                  readonly
                  disabled
                  height="44"
                  class="mr-lg-2"
                ></v-text-field>
                <v-btn disabled large color="primary">{{ $t('landing.footer.subscribe') }}</v-btn>
              </div>
              <div class="text-center text-md-right mt-4 mt-lg-2">
                {{ $t('landing.footer.connect') }}
                <v-avatar small class="ml-2" v-for="(item, i) in socials" :key="i" style="cursor: pointer">
                  <img :src="'/storage/socials/'+item.label.toLowerCase()+'.png'" :alt="item.label" @click="extLink(item.to)">
                </v-avatar>
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <div class="text-center caption">
            {{ config.product.copyright }} {{ config.product.copy_start_year }} - {{ new Date().getFullYear() }}. {{ config.product.all_rights_text }}
          </div>
        </v-container>
      </v-footer>
    </v-main>
  </div>
</template>

<script>
import config from '@/configs'
import Link from "@/components/common/Link.vue";
import { mapState } from 'vuex';
export default {
  components: {
    Link
  },
  computed: {
    ...mapState('app', ['product']),
  },
  data() {
    return {
      config,
      socials: [ {
        label: 'Telegram',
        to: 'https://ya.ru'
      }],
      links: [{
        label: this.$t('menu.trading'),
        to: '/trading'
      }, {
        label: this.$t('menu.overview'),
        to: '/overview'
      }, {
        label: this.$t('menu.fees'),
        to: '/fees'
      }, {
        label: this.$t('menu.system_status'),
        to: '/status'
      }, {
        label: this.$t('menu.api'),
        to: '/api'
      }, {
        label: this.$t('menu.terms'),
        to: '/terms'
      }, {
        label: this.$t('menu.policy'),
        to: '/policy'
      }]
    }
  },
  mounted() {
    this.$vuetify.theme.dark = true;
  },
  methods: {
    extLink(to) {
      window.location.href = to
    },
  }
}
</script>
<style lang="sass" scoped>
.footer_container
  max-width: none
.link-with-underline
  text-decoration: none /* Remove default underline */
  position: relative
  display: inline-block /* Important for positioning the underline */

.link-with-underline::after
  content: ''
  position: absolute
  bottom: 0
  left: 0
  width: 0 /* Initially hidden */
  height: 2px /* Underline thickness */
  background-color: var(--v-primary-base) /* Use the link's color */
  transition: width 0.3s ease /* Animation duration and easing */

.link-with-underline:hover::after
  width: 100% /* Expand to full width on hover */

</style>