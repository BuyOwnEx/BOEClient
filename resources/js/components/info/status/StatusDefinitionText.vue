<template>
	<div>
		<p>{{ $t('status.description') }}</p>
		<p v-if="(!isLogged && product.guestShowMarkets) || (isLogged && !isHideTrading && product.authedShowMarkets)">{{ $t('status.see_state_of_market') }} <Link class="text-decoration-none" path="/overview">{{ $t('menu.overview') }}</Link></p>
	</div>
</template>

<script>
import Link from "@/components/common/Link.vue";
import { mapGetters, mapState } from 'vuex';
export default {
	name: 'StatusDefinitionText',
  components: {
    Link
  },
  computed: {
    ...mapState('app', ['product']),
    ...mapState('user', ['blockStatus']),
    ...mapGetters({
      isLogged: 'app/isLogged',
    }),
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
  }
};
</script>
