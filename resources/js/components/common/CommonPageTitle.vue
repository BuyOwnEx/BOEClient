<template>
	<v-card-title class="common-page-title component-title">
		<slot>
			Page Title
		</slot>
	</v-card-title>
</template>

<script>
export default {
	name: 'CommonPageTitle',
};
</script>

<style scoped lang="sass">
.common-page-title
	font-size: 24px !important
</style>
