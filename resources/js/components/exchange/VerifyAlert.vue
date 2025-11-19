<template>
  <v-card class="exchange-verify-alert">
    <v-card-title>{{ $t('exchange.verify_title') }}</v-card-title>
    <v-card-subtitle> {{ $t('exchange.verify_sub_title') }} <Link path="/knowledge#verification">{{ $t('exchange.verify_sub_link') }}</Link></v-card-subtitle>
  </v-card>
</template>

<script>
import Link from "@/components/common/Link.vue";

export default {
  name: 'VerifyAlert',
  components: {Link},
};
</script>

<style lang="sass" scoped>
.exchange-verify-alert
  color: white !important
  margin-bottom: 5px
  background: #ffc67cd9 !important
  ::v-deep.v-card__subtitle
    color: white !important
</style>