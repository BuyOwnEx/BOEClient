<template>
  <v-card class="exchange-suspended-alert">
    <v-card-title>{{ $t('exchange.suspended_title') }}</v-card-title>
    <v-card-subtitle> {{ $t('exchange.suspended_sub_title') }} </v-card-subtitle>
  </v-card>
</template>

<script>
export default {
  name: 'SuspendedAlert',
};
</script>

<style lang="sass" scoped>
.exchange-suspended-alert
  color: white !important
  margin-bottom: 5px
  background: #ff7365d6 !important
  ::v-deep.v-card__subtitle
    color: white !important
</style>