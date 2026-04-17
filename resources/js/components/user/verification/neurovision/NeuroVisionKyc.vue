<template>
  <v-card class="user-verification-tab fill-height">
    <div id="neuro_vision" class="d-flex fill-height justify-center">
      <v-btn
          v-if="!is_passed && nv_status !== 'failed' && nv_status !== 'pending'"
          color="primary"
          :loading="!widgetLoaded"
          :disabled="!widgetLoaded"
          @click="openWidgetHandler"
      >
        {{ $t('kyc.nv_start') }}
      </v-btn>
      <v-alert dense text type="error" border="left" v-if="nv_status === 'failed'">
        {{ $t('kyc.nv_failed_description') }}
      </v-alert>
      <v-alert dense text type="warning" border="left" v-if="nv_status === 'pending'">
        {{ $t('kyc.nv_pending_description') }}
      </v-alert>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'NeuroVisionKyc',
  props: {
    scheme_id: {
      type: String,
      required: true
    },
    nv_status: {
      type: String,
      required: false
    },
    is_passed: {
      type: Boolean,
      required: false
    },
  },
  data: () => ({
    nv_fake: false,
    widgetLoaded: false,
    NeuroVisionClientKey: '',
    error: null
  }),

  computed: {
    userLang() {
      return this.$store.state.app.trader.language;
    },
  },

  methods: {
    loadWidgetScript() {
      if(!this.is_passed)
      {
        const scriptId = "kyc-widget-script-id";
        if (document.getElementById(scriptId)) {
          this.widgetLoaded = true;
          return;
        }
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = 'https://kyc.neuro-vision.ru/lib/widget-lib.js';
        script.defer = true;
        script.crossOrigin = "anonymous";
        script.onload = () => {
          this.widgetLoaded = true;
        };
        script.onerror = () => {
          console.error("Error load KYC widget");
        };
        document.head.appendChild(script);
      }
    },
    async openWidgetHandler() {
      if(this.nv_fake) this.$emit('set_nv_data', '')
      else {
        if (!window.KYCWidget) return;
        const client_key = await this.newNeuroVisionClientKey();
        window.KYCWidget.setupKYC({
          schemaId: this.scheme_id,
          clientKey: client_key,
          theme: this.$vuetify.theme.isDark ? 'dark' : 'light',
          closeCb: () => console.log("CLOSE CALLBACK"),
          successCb: (payload) => this.$emit('set_nv_data', payload)
        });
      }
    },
    async newNeuroVisionClientKey() {
      return await axios.get('/trader/ext/neuro_vision_token').then(res => {
        this.NeuroVisionClientKey = res.data.key;
        return res.data.key;
      }, err => {
        console.log(err);
        return null;
      })
    },
  },
  async mounted() {
    if (window.KYCWidget) {
      this.widgetLoaded = true;
      return;
    }
    this.loadWidgetScript();
  },
};
</script>

<style lang="sass" scoped>
.verification-failed-alert
  color: white !important
  margin-bottom: 5px
  background: #ff7365d6
  ::v-deep.v-card__subtitle
    color: white !important

.verification-pending-alert
  color: white !important
  margin-bottom: 5px
  background: #ff7365d6
  ::v-deep.v-card__subtitle
    color: white !important
</style>