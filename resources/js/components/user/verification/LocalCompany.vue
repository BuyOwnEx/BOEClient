<template>
  <v-card class="user-verification-tab fill-height d-flex flex-column">
    <v-card-title>{{ $t('kyc.manual.legal.title') }}</v-card-title>
    <v-card-text class="d-flex flex-column flex-grow-1">
      <span class="red--text">{{ $t('kyc.manual.legal.description') }}</span>
    </v-card-text>
    <v-card-actions>

    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'LocalCompany',
};
</script>

<style scoped>

</style>