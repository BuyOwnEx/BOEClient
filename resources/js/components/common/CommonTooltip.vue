<template>
	<v-tooltip max-width="300" top>
		<template #activator="{ on, attrs }">
			<span v-bind="attrs" v-on="on">
				<slot></slot>
			</span>
		</template>

		<span>
			<slot name="text"></slot>
		</span>
	</v-tooltip>
</template>

<script>
export default {
	name: 'CommonTooltip',
};
</script>
