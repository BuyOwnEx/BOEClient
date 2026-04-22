<template>
  <v-card class="user-verification-tab d-flex flex-column fill-height">
    <v-card-text class="d-flex flex-row flex-grow-1">
      <v-row class="d-flex flex-grow-1 justify-space-between">
        <v-col class="pb-1 pt-1" cols="12" md="5">
          <v-alert dense text border="left">
            <small>{{ is_legal ? $t('kyc.nv_comp_instruction') : $t('kyc.nv_ind_instruction') }}</small>
          </v-alert>
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
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" md="2">
        </v-col>
        <v-col class="pb-1 pt-1" cols="12" md="5">
        </v-col>
      </v-row>
    </v-card-text>
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
    is_legal: {
      type: Boolean,
      required: true
    }
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
      if(this.nv_fake) this.$emit('set_nv_data', '{"status":"success","sessionId":"f3d3f810-35d4-11f1-82e1-6429e3acb835","errors":[],"version":7,"schemaId":"737404c0-31de-11f1-ac55-6f222c05fa52","clientId":"93f34672-32ae-11f1-81a4-faf72b4e7a3c","spent":220.158,"createdAt":"2026-04-11T18:33:36.000Z","isClientNew":false,"clientKey":"57:80","clientUser":"","secondsToLive":0,"responseTime":"2026-04-11T18:41:00.542Z","results":[{"status":"success","type":"document","spent":0.442,"errors":[],"history":[],"startedAt":"2026-04-11T18:33:36.572Z","isBackSide":false,"countryCode":"RUS","tries":1,"docName":"Passport (2006)","checks":[{"caption":"fraud","items":[{"status":"success","caption":"isMRZValid"},{"status":"success","caption":"isStampsOk"},{"status":"success","caption":"isPrinted","confidence":1},{"status":"success","caption":"isDamaged","confidence":1},{"status":"success","caption":"isOtherObjectsOk"},{"status":"success","caption":"isXerocopy","confidence":0.932},{"status":"success","caption":"isEdited","confidence":0.996},{"status":"success","caption":"isSignatureOwnerOk"},{"status":"success","caption":"isSignatureIssuerOk"},{"status":"success","caption":"isDisplay","confidence":0.947},{"status":"success","caption":"isFieldsModified"},{"status":"success","caption":"isCropped"},{"status":"success","caption":"isFieldsCorrected"},{"status":"success","caption":"isMobile","confidence":1},{"status":"success","caption":"isPhotoApplication"},{"status":"success","caption":"isLogicalMismatch"}]}],"ocr":{"status":"success","fields":[{"title":"Surname","value":"ЗУБАРЕВ","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0,"isMRZOk":true},{"title":"Given name(s)","value":"НИКОЛАЙ","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0,"isMRZOk":true},{"title":"Father\'s name","value":"СЕРГЕЕВИЧ","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0},{"title":"Sex","value":"М","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0,"isMRZOk":true},{"title":"Date of birth","value":"06.06.1985","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0,"isMRZOk":true,"valueUTC":"1985-06-06T00:00:00Z"},{"title":"Place of birth","value":"ГОР.ФРУНЗЕ КИРГИЗСКОЙ ССР","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0},{"title":"Document series","value":"4511","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0},{"title":"Document number","value":"658993","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0,"isMRZOk":true},{"title":"Date of issue","value":"01.08.2012","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0,"valueUTC":"2012-08-01T00:00:00Z"},{"title":"Issuing authority","value":"ОТДЕЛЕНИЕМ УФМС РОССИИ ПО ГОР. МОСКВЕ ПО РАЙОНУ ОБРУЧЕВСКИЙ","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0},{"title":"Issuing authority code","value":"770-120","conf":"high","lcid":1049,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0},{"title":"MRZ string","value":"PNRUSZUBAREV<<NIKOLAQ<SERGEEVI3<<<<<<<<<<<<<4516589932RUS8506069M<<<<<<<1120801770120<64","conf":"high","isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0}]},"images":["https://api.neuro-vision.ru/images/kyc/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/document_0/0"],"imagesFull":["https://api.neuro-vision.ru/images/kycfull/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/2026/04/11/f3d3f810-35d4-11f1-82e1-6429e3acb835/document_0_0.jpg"],"imageObjects":["https://api.neuro-vision.ru/images/kyc/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/stamp/0","https://api.neuro-vision.ru/images/kyc/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/signatureOwner/0","https://api.neuro-vision.ru/images/kyc/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/signatureIssuer/0"]},{"status":"success","type":"address_proof","spent":0,"errors":[],"history":[],"startedAt":"2026-04-11T18:34:25.978Z","tries":1,"docName":"Document of identity","checks":[],"ocr":{"status":"success","fields":[{"title":"address","value":"Г. МОСКВА, УЛ. АДМИРАЛА ЛАЗАРЕВА, Д. 63, КОРП. 2, КВ. 109","lcid":0,"isUnreadable":false,"isModified":false,"isEdited":false,"isMismatch":false,"imageIndex":0}]},"images":["https://api.neuro-vision.ru/images/kyc/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/address_proof_1/0"],"imagesFull":["https://api.neuro-vision.ru/images/kycfull/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/2026/04/11/f3d3f810-35d4-11f1-82e1-6429e3acb835/address_proof_1_0.jpg"]},{"status":"success","type":"selfie","spent":0.238,"errors":[],"history":[],"startedAt":null,"tries":1,"docName":"Passport (2006)","checks":[{"caption":"fraud","items":[{"status":"success","caption":"isFaceDeepFake"},{"status":"success","caption":"isAgeMismatch","value":48},{"status":"success","caption":"isCropped"},{"status":"success","caption":"isEditedSelfie","confidence":0.707},{"status":"success","caption":"isXerocopy","confidence":0.928},{"status":"success","caption":"isGenderMismatch","value":"male"},{"status":"success","caption":"isDisplaySelfie","confidence":1},{"status":"success","caption":"isMobile","confidence":1}]}],"withDoc":["Domestic passport"],"faceSelfie":"https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie/0","faceDoc":"https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie_document/0","images":["https://api.neuro-vision.ru/images/kyc/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie_2/0"],"imagesFull":["https://api.neuro-vision.ru/images/kycfull/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/2026/04/11/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie_2_0.jpg"]},{"status":"success","type":"liveness","spent":0,"errors":[],"history":[],"startedAt":"2026-04-11T18:33:36.531Z","tries":1,"checks":[],"faces":["https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/liveness_0","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/liveness_1","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/liveness_2","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/liveness_3","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/liveness_4"]},{"status":"success","type":"faces","spent":0.002,"errors":[],"history":[],"startedAt":"2026-04-11T18:37:16.070Z","checks":[{"caption":"Face matching","items":[{"status":"success","caption":"document_0 & selfie","value":"82%","images":["https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/document_0","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie"]},{"status":"success","caption":"document_0 & selfie_document","value":"96%","images":["https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/document_0","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie_document"]},{"status":"success","caption":"document_0 & liveness_0","value":"84%","images":["https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/document_0","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/liveness_0"]},{"status":"success","caption":"selfie & selfie_document","value":"77%","images":["https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie_document"]},{"status":"success","caption":"selfie & liveness_0","value":"100%","images":["https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/liveness_0"]},{"status":"success","caption":"selfie_document & liveness_0","value":"79%","images":["https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/selfie_document","https://api.neuro-vision.ru/images/kycthumb/3ccaf9f0-cb9b-11f0-bb7f-0886e58280b6/f3d3f810-35d4-11f1-82e1-6429e3acb835/liveness_0"]}]}]}]}')
      else {
        if (!window.KYCWidget) return;
        const client_key = await this.newNeuroVisionClientKey();
        window.KYCWidget.setupKYC({
          schemaId: this.scheme_id,
          clientKey: client_key,
          theme: this.$vuetify.theme.isDark ? 'dark' : 'light',
          closeCb: () => {this.$emit('reload')},
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