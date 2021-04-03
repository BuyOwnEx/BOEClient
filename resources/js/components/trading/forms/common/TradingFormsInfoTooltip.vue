<template>
	<v-tooltip max-width="300" top>
		<template v-slot:activator="{ on, attrs }">
			<div v-bind="attrs" v-on="on">
				<slot></slot>
			</div>
		</template>

		<span>
			<slot name="text"></slot>
		</span>
	</v-tooltip>
</template>

<script>
export default {
	name: 'TradingFormsInfoTooltip',
};
</script>
