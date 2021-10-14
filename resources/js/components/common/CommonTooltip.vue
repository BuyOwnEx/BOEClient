<template>
	<v-tooltip max-width="300" top>
		<template #activator="{ on, attrs }">
			<span v-bind="attrs" v-on="on">
				<slot></slot>
			</span>
		</template>

		<span>
			<slot name="text">
				{{ value }}
			</slot>
		</span>
	</v-tooltip>
</template>

<script>
export default {
	name: 'CommonTooltip',

	props: {
		value: {
			type: [Number, String],
			required: false,
			default: null,
		},
	},
};
</script>
