<template>
	<div class="caption mt-2 text-center" v-if="!product.disabledStatusPageShow">
		<slot>
			<span>{{ $t('common.have_questions') }}</span>
      <br>
      <Link path="/contacts">{{ $t('common.contact') }}</Link>
		</slot>
	</div>
</template>

<script>
import Link from "@/components/common/Link.vue";
import { mapState } from 'vuex';
export default {
	name: 'DocsFooter',
  components: {
      Link
  },
  computed: {
    ...mapState('app', ['product']),
  }
};
</script>
