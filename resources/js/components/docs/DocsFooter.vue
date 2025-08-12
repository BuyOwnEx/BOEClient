<template>
	<div class="caption mt-2 text-center" v-if="is_show_contacts">
		<slot>
			<span>{{ $t('common.have_questions') }}</span>
      <br>
      <Link path="/contacts">{{ $t('common.contact') }}</Link>
		</slot>
	</div>
</template>

<script>
import Link from "@/components/common/Link.vue";
import { mapGetters, mapState } from 'vuex';
export default {
	name: 'DocsFooter',
  components: {
      Link
  },
  computed: {
    ...mapState('app', ['product']),
    ...mapGetters({
      isLogged: 'app/isLogged',
    }),
    is_show_contacts() {
      return (this.isLogged && this.product.authedShowContacts) || (!this.isLogged && this.product.guestShowContacts)
    }
  }
};
</script>
