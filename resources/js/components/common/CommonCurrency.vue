<template>
	<div class="d-flex align-center justify-center gap-2">
		<v-img
			v-if="src"
			class="elevation-0 d-inline-flex vertical-middle"
			:src="src"
			:max-height="size"
			:max-width="size"
		/>
		<v-avatar v-else class="white--text subtitle-2" :color="color || 'grey'" :size="size">
			{{ code[0] }}
		</v-avatar>

		<div class="text-left" style="width: 70px">
			{{ code }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'CommonCurrency',

	props: {
		code: {
			type: String,
			default: null,
		},
		color: {
			type: String,
			default: null,
		},
		src: {
			type: String,
			default: null,
		},

		size: {
			type: String,
			default: 22,
		},
	},
};
</script>
