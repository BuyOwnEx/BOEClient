<template>
  <v-sheet height="100%" width="100%" class="d-flex align-center justify-center">
    <span class="overline" style="opacity: 0.6">
      {{ $t('trading.own_list_unauthed_before') }}
      <Link path="/login">{{ $t('trading.own_list_unauthed_link') }}</Link>
       {{ $t('trading.own_list_unauthed_after') }}
    </span>
  </v-sheet>
</template>
<script>
import Link from "@/components/common/Link.vue";
export default {
  name: "UnAuthLabel",
  components: {
    Link
  },
}
</script>
<style scoped lang="sass">

</style>