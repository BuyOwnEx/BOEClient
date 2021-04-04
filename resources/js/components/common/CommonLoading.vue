<template>
	<div class="common-loading text-center mt-3">
		<v-progress-circular
			:color="color"
			:size="size"
			:width="width"
			indeterminate
		/>
	</div>
</template>

<script>
export default {
	name: 'CommonLoading',

	props: {
		color: {
			type: String,
			default: 'primary',
		},
		size: { type: String, default: '30' },
		width: { type: String, default: '2' },
	},
};
</script>

<style scoped>
.common-loading {
	width: 100%;
}
</style>
