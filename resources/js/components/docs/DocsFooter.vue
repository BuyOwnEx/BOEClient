<template>
	<div class="caption mt-2 text-center">
		<!--		-->

		<slot>
			<span>{{ $t('common.have_questions') }}</span>
			<a href="/contacts">{{ $t('common.contact') }}</a>
		</slot>

		<!--		-->
	</div>
</template>

<script>
export default {
	name: 'DocsFooter',
};
</script>
