<template>
	<div class='text-center mt-3'>
		<v-progress-circular :color='color' :size='size' :width='width' indeterminate />
	</div>
</template>

<script>
export default {
	name: 'CommonProgressCircular',

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
