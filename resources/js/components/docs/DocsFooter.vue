<template>
	<div class="caption mt-2 text-center">
		<!--		-->

		<slot>
			<span>{{ $t('faq.call') }}</span>
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

<style scoped></style>
