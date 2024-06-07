<template>
	<div class="caption mt-2 text-center">
		<slot>
			<span>{{ $t('common.have_questions') }}</span>
      <br>
      <Link path="/contacts">{{ $t('common.contact') }}</Link>
		</slot>
	</div>
</template>

<script>
import Link from "@/components/common/Link.vue";
export default {
	name: 'DocsFooter',
    components: {
        Link
    },
};
</script>
