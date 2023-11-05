<template>
	<div
		class="common-loading text-center"
		:class="[pageMargin ? 'pt-16' : 'pt-3', { 'common-loading--center': center }]"
	>
		<v-progress-circular :color="color" :size="size" :width="width" indeterminate />
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

		pageMargin: Boolean,
		center: Boolean,
	},
};
</script>

<style scoped lang="sass">
.common-loading
	width: 100%
	:is(--center)
		position: absolute
		top: 0
		left: 0
		right: 0
		bottom: 0
		display: flex
		justify-content: center
		align-items: center
</style>
