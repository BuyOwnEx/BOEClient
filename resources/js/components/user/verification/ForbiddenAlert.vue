<template>
  <v-row>
    <v-col cols="12" class="pb-1">
      <v-card class="user-verification-tab-forbidden-alert d-inline-block">
        <v-card-title class="text-no-wrap">{{ $t('kyc.forbidden.caption') }}</v-card-title>
        <v-card-subtitle> {{ forbiddenText }} </v-card-subtitle>
      </v-card>
    </v-col>
    <v-col cols="12" class="pt-1">
      <v-btn
          class="text-uppercase caption"
          small
          depressed
          tile
          @click="back">
        {{ $t('common.back') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ForbiddenAlert',
  props: {
    is_resident: {
      type: Boolean,
      required: true,
    },
    is_legal: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    forbiddenText() {
      if(this.is_resident && this.is_legal) return this.$t('kyc.forbidden.resident_legal');
      else if(this.is_resident && !this.is_legal) return this.$t('kyc.forbidden.resident_individual');
      else if(!this.is_resident && this.is_legal) return this.$t('kyc.forbidden.no_resident_legal');
      else if(!this.is_resident && !this.is_legal) return this.$t('kyc.forbidden.no_resident_individual');
    },
  },
  methods: {
    back() {
      this.$emit('back');
    },
  },
};
</script>

<style lang="sass" scoped>
.user-verification-tab-forbidden-alert
  color: white !important
  margin-bottom: 5px
  background: #ff7365d6 !important
  ::v-deep.v-card__subtitle
    color: white !important
</style>