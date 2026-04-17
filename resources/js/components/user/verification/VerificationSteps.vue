<template>
  <v-stepper v-if="!isLoading" v-model="step" class="no-transition user-verification-tab tab-fill-height w-full" vertical>
    <v-stepper-step :complete="step > 1" step="1" :color="step > 1 ? 'success': 'primary'">
      {{ $t('user.title.residence_status') }}
      <small v-if="residence && step > 1" class="caption">{{ $t('common.'+residence) }}</small>
    </v-stepper-step>
    <v-stepper-content step="1">
      <v-card outlined tile class="user-residence-tab pa-2 d-inline-block">
        <v-card-text class="pa-0 pl-1">{{ $t('kyc.resident_step_text') }} {{ $t('kyc.resident_country.'+verification_settings.settings.resident_country.toLowerCase()) }}</v-card-text>
        <v-radio-group
            v-model="residence"
            dense
            mandatory
        >
          <v-radio
              :label="$t('common.resident')"
              value="resident"
              :ripple="false"
          ></v-radio>
          <v-radio
              :label="$t('common.non_resident')"
              value="non_resident"
              :ripple="false"
          ></v-radio>
        </v-radio-group>
        <v-btn
            color="primary"
            class="text-uppercase caption"
            small
            depressed
            tile
            @click="step = 2">
          {{ $t('common.continue') }}
        </v-btn>
      </v-card>
    </v-stepper-content>
    <v-stepper-step :complete="step > 2" step="2" :color="step > 2 ? 'success': 'primary'">
      {{ $t('user.title.legal_status') }}
      <small v-if="legality && step > 2" class="caption">{{ $t('common.'+legality) }}</small>
    </v-stepper-step>
    <v-stepper-content step="2">
      <v-card outlined tile class="user-residence-tab pa-2 d-inline-block">
        <v-card-text class="pa-0 pl-1">{{ $t('kyc.legal_step_text') }}</v-card-text>
        <v-radio-group
            v-model="legality"
            dense
            mandatory
        >
          <v-radio
              :label="$t('common.individual')"
              value="individual"
              :ripple="false"
          ></v-radio>
          <v-radio
              :label="$t('common.legal')"
              value="legal"
              :ripple="false"
          ></v-radio>
        </v-radio-group>
        <v-btn
            class="text-uppercase caption"
            small
            depressed
            tile
            @click="step = 1">
          {{ $t('common.back') }}
        </v-btn>
        <v-btn
            color="primary"
            class="text-uppercase caption ml-2"
            small
            depressed
            tile
            @click="saveVerificationStatus(); step = 3;">
          {{ $t('common.continue') }}
        </v-btn>
      </v-card>
    </v-stepper-content>
    <v-stepper-step :complete="step > 3" step="3" :color="step > 3 ? 'success': 'primary'">
      {{ $t('user.title.verification') }}
      <small v-if="verifyStatus && this.verificationStatus.nv_pass && step > 3" class="caption">{{ $t('kyc.verification_passed') }}</small>
    </v-stepper-step>
    <v-stepper-content step="3" class="ml-0">
      <neuro-vision-kyc
          v-if="residence === 'resident' && legality === 'individual' && need_nv_res_step"
          :scheme_id="verification_settings.nv_res_scheme_id"
          :is_passed="verifyStatus && verificationStatus.nv_pass"
          :nv_status="verifyStatus ? verifyStatus : 'new'"
          @set_nv_data="set_nv_data"
      ></neuro-vision-kyc>
      <neuro-vision-kyc
          v-if="residence === 'non_resident' && legality === 'individual' && need_nv_non_res_step"
          :scheme_id="verification_settings.nv_nonres_scheme_id"
          :is_passed="verifyStatus && verificationStatus.nv_pass"
          :nv_status="verifyStatus"
          @set_nv_data="set_nv_data"
      ></neuro-vision-kyc>
      <forbidden-alert
          v-if="residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider === 'forbidden'"
          :is_resident="true"
          :is_legal="false"
          @back="step = 2"
      ></forbidden-alert>
      <forbidden-alert
          v-if="residence === 'resident' && legality === 'legal' && verification_settings.settings.resident_legal_kyc_provider === 'forbidden'"
          :is_resident="true"
          :is_legal="true"
          @back="step = 2"
      ></forbidden-alert>
      <forbidden-alert
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.settings.non_resident_individual_kyc_provider === 'forbidden'"
          :is_resident="false"
          :is_legal="false"
          @back="step = 2"
      ></forbidden-alert>
      <forbidden-alert
          v-if="residence === 'non_resident' && legality === 'legal' && verification_settings.settings.non_resident_legal_kyc_provider === 'forbidden'"
          :is_resident="false"
          :is_legal="true"
          @back="step = 2"
      ></forbidden-alert>
      <kontur-individual
          v-if="(residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider === 'kontur' && !need_nv_res_step)"
      ></kontur-individual>
      <kontur-company
          v-if="residence === 'resident' && legality === 'legal' && verification_settings.settings.resident_legal_kyc_provider	 === 'kontur'"
      ></kontur-company>
      <sum-sub-kyc
          v-if="residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider	 === 'sumsub'"
          @set_reason="set_reason"
      ></sum-sub-kyc>
      <sum-sub-kyb
          v-if="residence === 'resident' && legality === 'legal' && verification_settings.settings.resident_legal_kyc_provider	 === 'sumsub'"
          @set_reason="set_reason"
      ></sum-sub-kyb>

      <kontur-individual
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.settings.non_resident_individual_kyc_provider === 'kontur' && !need_nv_non_res_step"
      ></kontur-individual>
      <kontur-company
          v-if="residence === 'non_resident' && legality === 'legal' && verification_settings.settings.non_resident_legal_kyc_provider === 'kontur'"
      ></kontur-company>
      <sum-sub-kyc
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.settings.non_resident_individual_kyc_provider === 'sumsub'"
          @set_reason="set_reason"
      ></sum-sub-kyc>
      <sum-sub-kyb
          v-if="residence === 'non_resident' && legality === 'legal' && verification_settings.settings.non_resident_legal_kyc_provider === 'sumsub'"
          @set_reason="set_reason"
      ></sum-sub-kyb>

      <local-individual-v1
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.settings.non_resident_individual_kyc_provider === 'local' && local_verification_version === 'v1' && !need_nv_non_res_step"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
      ></local-individual-v1>
      <local-company-v1
          v-if="residence === 'non_resident' && legality === 'legal' && verification_settings.settings.non_resident_legal_kyc_provider === 'local' && local_verification_version === 'v1'"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
      ></local-company-v1>
      <local-individual-v1
          v-if="residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider === 'local' && local_verification_version === 'v1' && !need_nv_res_step"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
      ></local-individual-v1>
      <local-company-v1
          v-if="residence === 'resident' && legality === 'legal' && verification_settings.settings.resident_legal_kyc_provider === 'local' && local_verification_version === 'v1'"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
      ></local-company-v1>

      <local-individual-v2
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.settings.non_resident_individual_kyc_provider === 'local' && local_verification_version === 'v2' && !need_nv_non_res_step"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
      ></local-individual-v2>
      <local-company-v2
          v-if="residence === 'non_resident' && legality === 'legal' && verification_settings.settings.non_resident_legal_kyc_provider === 'local'  && local_verification_version === 'v2'"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
      ></local-company-v2>
      <local-individual-v2
          v-if="residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider === 'local' && local_verification_version === 'v2' && !need_nv_res_step"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
      ></local-individual-v2>
      <local-company-v2
          v-if="residence === 'resident' && legality === 'legal' && verification_settings.settings.resident_legal_kyc_provider === 'local' && local_verification_version === 'v2'"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
      ></local-company-v2>
      <v-btn
          v-if="verifyStatus === 'new'"
          class="text-uppercase caption"
          small
          depressed
          tile
          @click="step = 2">
        {{ $t('common.back') }}
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
        v-if="is_scheme_chosen && (need_nv_res_step || need_nv_non_res_step)"
        :complete="verifyStatus === 'verified'"
        :rules="[() => notBadStatus]"
        :step="4"
        :color="verifyStatus === 'verified' ? 'success': 'primary'"
    >
      {{ $t('kyc.scoring') }}
      <small v-if="reason" class="caption">{{ reason }}</small>
      <small v-if="verifyStatus === 'verified'" class="caption">{{ $t('kyc.scoring_passed') }}</small>
    </v-stepper-step>
    <v-stepper-content :step="4" class="ml-0">
      <kontur-individual
          v-if="(residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider === 'kontur' && !nv_res_enabled) || (nv_res_enabled && residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider === 'kontur' && verificationStatus && verificationStatus.nv_data)"
          :nv_data="verificationStatus?.nv_data"
          :nv_res_enabled="nv_res_enabled"
      ></kontur-individual>
      <local-individual-v1
          v-if="residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider === 'local' && local_verification_version === 'v1' && nv_res_enabled && verificationStatus && verificationStatus.nv_data"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
          :nv_data="verificationStatus?.nv_data"
          :nv_enabled="nv_res_enabled"
      ></local-individual-v1>
      <local-individual-v1
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.settings.non_resident_individual_kyc_provider === 'local' && local_verification_version === 'v1' && nv_non_res_enabled && verificationStatus && verificationStatus.nv_data"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
          :nv_data="verificationStatus?.nv_data"
          :nv_enabled="nv_non_res_enabled"
      ></local-individual-v1>
      <local-individual-v2
          v-if="residence === 'resident' && legality === 'individual' && verification_settings.settings.resident_individual_kyc_provider === 'local' && local_verification_version === 'v2' && nv_res_enabled && verificationStatus && verificationStatus.nv_data"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
          :nv_data="verificationStatus?.nv_data"
          :nv_enabled="nv_res_enabled"
      ></local-individual-v2>
      <local-individual-v2
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.settings.non_resident_individual_kyc_provider === 'local' && local_verification_version === 'v2' && nv_non_res_enabled && verificationStatus && verificationStatus.nv_data"
          :resident-country="verification_settings.settings.resident_country"
          :resident="residence"
          :nv_data="verificationStatus?.nv_data"
          :nv_enabled="nv_non_res_enabled"
      ></local-individual-v2>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import KonturIndividual from '@/components/user/verification/kontur/KonturIndividual.vue';
import KonturCompany from '@/components/user/verification/kontur/KonturCompany.vue';
import SumSubKyc from '@/components/user/verification/sumsub/SumSubKyc.vue';
import SumSubKyb from '@/components/user/verification/sumsub/SumSubKyb.vue';
import NeuroVisionKyc from "@/components/user/verification/neurovision/NeuroVisionKyc.vue";
import LocalIndividualV1 from '@/components/user/verification/local/v1/LocalIndividual.vue';
import LocalCompanyV1 from '@/components/user/verification/local/v1/LocalCompany.vue';
import LocalIndividualV2 from '@/components/user/verification/local/v2/LocalIndividual.vue';
import LocalCompanyV2 from '@/components/user/verification/local/v2/LocalCompany.vue';
import ForbiddenAlert from '@/components/user/verification/ForbiddenAlert.vue';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'VerificationSteps',
  components: {
    KonturIndividual,
    KonturCompany,
    SumSubKyc,
    SumSubKyb,
    NeuroVisionKyc,
    LocalIndividualV1,
    LocalCompanyV1,
    LocalIndividualV2,
    LocalCompanyV2,
    ForbiddenAlert
  },
  data() {
    return {
      isLoading: true,
      step: 1,
      residence: null,
      legality: null,
      verification_settings: null,
      reason: null,
      nv_data: null
    };
  },
  computed: {
    ...mapState('user', ['verificationStatus']),
    local_verification_version() {
      return import.meta.env.VITE_LOCAL_VERIFICATION_VERSION === 'v2' ? 'v2' : 'v1'
    },
    verifyStatus() {
      return this.verificationStatus?.status || null;
    },
    notBadStatus() {
      return (this.verifyStatus === null || this.verifyStatus === 'verified' || this.verifyStatus === 'passed' || this.verifyStatus === 'pending' || this.verifyStatus === 'new' || this.verifyStatus === 'checking') && !this.reason
    },
    getKycProvider() {
      if(this.residence === 'resident' && this.legality === 'individual')
        return this.verification_settings.settings.resident_individual_kyc_provider;
      else if(this.residence === 'resident' && this.legality === 'legal')
        return this.verification_settings.settings.resident_legal_kyc_provider;
      else if(this.residence === 'non_resident' && this.legality === 'individual')
        return this.verification_settings.settings.non_resident_individual_kyc_provider;
      else if(this.residence === 'non_resident' && this.legality === 'legal')
        return this.verification_settings.settings.non_resident_legal_kyc_provider;
    },
    is_scheme_chosen() {
      return this.verificationStatus && "resident" in this.verificationStatus &&
          "legal_entity" in this.verificationStatus &&
          "kyc_provider" in this.verificationStatus;
    },
    need_nv_res_step() {
      return this.is_scheme_chosen && this.verificationStatus.resident && this.nv_res_enabled
    },
    need_nv_non_res_step() {
      return this.is_scheme_chosen && !this.verificationStatus.resident && this.nv_non_res_enabled
    },
    nv_res_enabled() {
      return (this.verification_settings.settings.nv_use_res_kyc && this.legality === 'individual' && this.residence === 'resident' && this.verification_settings.settings.resident_individual_kyc_provider !== 'forbidden')
    },
    nv_non_res_enabled() {
      return (this.verification_settings.settings.nv_use_nonres_kyc && this.legality === 'individual' && this.residence === 'non_resident' && this.verification_settings.settings.non_resident_individual_kyc_provider !== 'forbidden')
    },
    nv_enabled() {
      return (this.verification_settings.settings.nv_use_res_kyc && this.legality === 'individual' && this.residence === 'resident' && this.verification_settings.settings.resident_individual_kyc_provider !== 'forbidden') ||
          (this.verification_settings.settings.nv_use_nonres_kyc && this.legality === 'individual' && this.residence === 'non_resident' && this.verification_settings.settings.non_resident_individual_kyc_provider !== 'forbidden')
    }
  },
  async created() {
    await Promise.all([this.fetchVerificationSettings(), this.getVerificationStatusStore()]);
    this.isLoading = false;
    this.showStep();
  },
  methods: {
    ...mapActions({
      getVerificationStatusStore: 'user/getVerificationStatus',
      setVerificationStatusStore: 'user/updateVerificationStatus',
      setVerificationNVStatusStore: 'user/updateVerificationNVStatus',
      setVerificationNVDataStore: 'user/setVerificationNVData',
    }),

    async fetchVerificationSettings() {
      const { data } = await axios.get('/get_verification_settings');
      this.verification_settings = data.data;
    },
    async saveVerificationStatus() {
      if(this.getKycProvider !== 'forbidden')
      {
        const payload = {
          resident: this.residence === 'resident',
          legal_entity: this.legality === 'legal',
          kyc_provider: this.getKycProvider
        };
        await this.setVerificationStatusStore(payload);
        this.showStep();
      }
    },
    showStep() {
      if(!this.verificationStatus) this.step = 1;
      else {
        if(this.verificationStatus.resident)
        {
          this.residence = 'resident';
          this.step = 2;
        }
        else
        {
          this.residence = 'non_resident';
          this.step = 2;
        }
        if(this.verificationStatus.legal_entity)
        {
          this.legality = 'legal';
          this.step = 3;
        }
        else
        {
          this.legality = 'individual';
          if(this.nv_enabled && this.verificationStatus.nv_pass) this.step = 4;
          else this.step = 3;
        }
      }
    },
    set_reason(data) {
      this.reason = data.reason;
    },
    async set_nv_data(data) {
      const json_data = JSON.parse(data);
      await this.setVerificationNVStatusStore();
      if(this.residence === 'resident')
      {
        const documentResult = _.find(json_data.results, result =>
            result.type === 'document' &&
            result.ocr &&
            result.ocr.status === 'success'
        );
        if (documentResult) {
          const fields = documentResult.ocr.fields;
          const getFieldValue = (fieldName) =>
              _.get(_.find(fields, ['title', fieldName]), 'value', '');
          const getDateFieldValue = (fieldName) =>
              _.get(_.find(fields, ['title', fieldName]), 'valueUTC', '');

          const country = documentResult['countryCode'];
          const surname = getFieldValue('Surname');
          const givenName = getFieldValue('Given name(s)');
          const fathersName = getFieldValue("Father's name");
          const fullName = `${surname} ${givenName} ${fathersName}`.trim();
          const birthDate = getDateFieldValue('Date of birth');
          const passportSeries = getFieldValue('Document series');
          const passportNumber = getFieldValue('Document number');
          const fullPassportNumber = `${passportSeries} ${passportNumber}`.trim();
          this.setVerificationNVDataStore({
            country: country,
            fio: fullName,
            birthday: birthDate,
            passport_number: fullPassportNumber
          });
          this.step++;
        }
      }
      else if(this.residence === 'non_resident')
      {
        const documentResult = _.find(json_data.results, result =>
            result.type === 'document' &&
            result.ocr &&
            result.ocr.status === 'success'
        );
        if (documentResult) {
          const fields = documentResult.ocr.fields;
          const getFieldValue = (fieldName) =>
              _.get(_.find(fields, ['title', fieldName]), 'value', '');
          const getDateFieldValue = (fieldName) =>
              _.get(_.find(fields, ['title', fieldName]), 'valueUTC', '');
          const country = documentResult['countryCode'].slice(0,3);
          const fullName = getFieldValue('Surname and given name(s)');
          const birthDate = getDateFieldValue('Date of Birth');
          const fullPassportNumber = getFieldValue('Document Number');
          this.setVerificationNVDataStore({
            country: country,
            fio: fullName,
            birthday: birthDate,
            passport_number: fullPassportNumber
          });
          this.step++;
        }
      }
    }
  },
};
</script>

<style scoped>

</style>