<template>
	<div class="docs-title display-1 trading-component-title">
		<!--		-->

		<slot>
			DocsTitleSlot
		</slot>

		<!--		-->
	</div>
</template>

<script>
export default {
	name: 'DocsTitle',
};
</script>

<style scoped>
.docs-title {
	font-size: 30px !important;
}
</style>
