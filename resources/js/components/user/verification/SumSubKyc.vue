<template>
  <v-card class="user-verification-tab">
    <div id="sumsub" />
  </v-card>
</template>

<script>
import snsWebSdk from '@sumsub/websdk';
export default {
  name: 'SumSubKyc',

  data: () => ({
    SumSubToken: '',
    api: 'https://api.sumsub.com',
    email: null,
    phone: null,
    error: null
  }),

  computed: {
    userLang() {
      return this.$store.state.app.trader.language;
    },
  },

  methods: {
    async newSumSubToken() {
      return await axios.get('/trader/ext/kyc_sumsub_token').then(res => {
        this.SumSubToken = res.data.token;
        return res.data.token;
      }, err => {
        if(err.response.status === 404 && err.response.data && err.response.data.description)
        {
          this.error = err.response.data.description;
          this.$emit('set_reason', {reason: this.error});
        }
        return null;
      })
    },
    launchWebSdk(accessToken, applicantEmail, applicantPhone) {
      let snsWebSdkInstance = snsWebSdk
          .init(accessToken, () => this.newSumSubToken())
          .withConf({
            lang: this.userLang,
            email: applicantEmail,
            phone: applicantPhone,
            theme: this.$vuetify.theme.dark ? 'dark' : 'light',
          })
          .withOptions({ addViewportTag: true, adaptIframeHeight: true })
          .on("idCheck.onStepCompleted", (payload) => {
            console.log("onStepCompleted", payload);
          })
          .on("idCheck.onError", (error) => {
            console.log("onError", error);
          })
          .build();
      snsWebSdkInstance.launch('#sumsub');
    },
  },

  async mounted() {
    const token = await this.newSumSubToken();
    if(token) this.launchWebSdk(token, this.email, this.phone);
  },
};
</script>

<style scoped>

</style>