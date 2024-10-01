<template>
  <v-stepper v-if="!isLoading" v-model="step" class="no-transition user-verification-tab tab-fill-height" vertical>
    <v-stepper-step :complete="step > 1" step="1" :color="step > 1 ? 'success': 'primary'">
      {{ $t('user.title.residence_status') }}
      <small v-if="residence && step > 1" class="caption">{{ $t('common.'+residence) }}</small>
    </v-stepper-step>
    <v-stepper-content step="1">
      <v-card class="user-residence-tab ml-2 mb-2">
        <v-card-text class="pa-0 pl-1">{{ $t('kyc.resident_step_text') }} {{ $t('kyc.resident_country.'+verification_settings.resident_country) }}</v-card-text>
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
      <v-card class="user-residence-tab ml-2 mb-2">
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
            @click="step = 3;saveVerificationStatus()">
          {{ $t('common.continue') }}
        </v-btn>
      </v-card>
    </v-stepper-content>
    <v-stepper-step :complete="verifyStatus === 'verified'" :rules="[() => notBadStatus]" step="3" :color="verifyStatus === 'verified' ? 'success': 'primary'">
      {{ $t('user.title.verification') }}
      <small v-if="reason" class="caption">{{ reason }}</small>
    </v-stepper-step>
    <v-stepper-content step="3">
      <kontur-individual
        v-if="residence === 'resident' && legality === 'individual' && verification_settings.resident_individual_kyc_provider === 'kontur'"
      ></kontur-individual>
      <kontur-company
          v-if="residence === 'resident' && legality === 'legal' && verification_settings.resident_legal_kyc_provider	 === 'kontur'"
      ></kontur-company>
      <sum-sub-kyc
          v-if="residence === 'resident' && legality === 'individual' && verification_settings.resident_individual_kyc_provider	 === 'sumsub'"
          @set_reason="set_reason"
      ></sum-sub-kyc>
      <sum-sub-kyb
          v-if="residence === 'resident' && legality === 'legal' && verification_settings.resident_legal_kyc_provider	 === 'sumsub'"
          @set_reason="set_reason"
      ></sum-sub-kyb>
      <local-individual
          v-if="residence === 'resident' && legality === 'individual' && verification_settings.resident_individual_kyc_provider === 'local'"
      ></local-individual>
      <local-legal
          v-if="residence === 'resident' && legality === 'legal' && verification_settings.resident_legal_kyc_provider	 === 'local'"
      ></local-legal>

      <kontur-individual
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.non_resident_individual_kyc_provider === 'kontur'"
      ></kontur-individual>
      <kontur-company
          v-if="residence === 'non_resident' && legality === 'legal' && verification_settings.non_resident_legal_kyc_provider	 === 'kontur'"
      ></kontur-company>
      <sum-sub-kyc
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.non_resident_individual_kyc_provider	 === 'sumsub'"
          @set_reason="set_reason"
      ></sum-sub-kyc>
      <sum-sub-kyb
          v-if="residence === 'non_resident' && legality === 'legal' && verification_settings.non_resident_legal_kyc_provider	 === 'sumsub'"
          @set_reason="set_reason"
      ></sum-sub-kyb>
      <local-individual
          v-if="residence === 'non_resident' && legality === 'individual' && verification_settings.non_resident_individual_kyc_provider === 'local'"
      ></local-individual>
      <local-legal
          v-if="residence === 'non_resident' && legality === 'legal' && verification_settings.non_resident_legal_kyc_provider	 === 'local'"
      ></local-legal>
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
  </v-stepper>
</template>

<script>
import KonturIndividual from '@/components/user/verification/KonturIndividual.vue';
import KonturCompany from '@/components/user/verification/KonturCompany.vue';
import SumSubKyc from '@/components/user/verification/SumSubKyc.vue';
import SumSubKyb from '@/components/user/verification/SumSubKyb.vue';
import LocalIndividual from '@/components/user/verification/LocalIndividual.vue';
import LocalLegal from '@/components/user/verification/LocalCompany.vue';
import { mapActions, mapState } from 'vuex';
export default {
  name: 'VerificationSteps',
  components: {
    KonturIndividual,
    KonturCompany,
    SumSubKyc,
    SumSubKyb,
    LocalIndividual,
    LocalLegal
  },
  data() {
    return {
      isLoading: true,
      step: 1,
      residence: null,
      legality: null,
      verification_settings: null,
      reason: null
    };
  },
  computed: {
    ...mapState('user', ['verificationStatus']),
    verifyStatus() {
      return this.verificationStatus === null ? null : this.verificationStatus.status;
    },
    notBadStatus() {
      return (this.verifyStatus === null || this.verifyStatus === 'verified' || this.verifyStatus === 'pending' || this.verifyStatus === 'new' || this.verifyStatus === 'checking') && !this.reason
    },
    getKycProvider() {
      if(this.residence === 'resident' && this.legality === 'individual')
        return this.verification_settings.resident_individual_kyc_provider;
      else if(this.residence === 'resident' && this.legality === 'legal')
        return this.verification_settings.resident_legal_kyc_provider;
      else if(this.residence === 'non_resident' && this.legality === 'individual')
        return this.verification_settings.non_resident_individual_kyc_provider;
      else if(this.residence === 'non_resident' && this.legality === 'legal')
        return this.verification_settings.non_resident_legal_kyc_provider;
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
    }),

    async fetchVerificationSettings() {
      const { data } = await axios.get('/get_verification_settings');
      this.verification_settings = data.data;
    },
    async saveVerificationStatus() {
      const payload = {
        is_resident: this.residence === 'resident',
        is_legal_entity: this.legality === 'legal',
        kyc_provider: this.getKycProvider
      };
      await this.setVerificationStatusStore(payload);
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
          this.step = 3;
        }
      }
    },
    set_reason(data) {
      this.reason = data.reason;
    },
  },
};
</script>

<style scoped>

</style>