<template>
	<v-row class="filter-bottom px-1" no-gutters>
		<v-btn
			class="ma-2 ml-0"
			tile
			color="primary"
			:disabled="disabled"
			@click="setFilter"
		>
			Apply
		</v-btn>

		<v-btn class="ma-2" tile outlined color="grey" @click="resetFilter">
			Reset
		</v-btn>
	</v-row>
</template>
<script>
export default {
	name: 'FiltersFooter',

	props: {
		disabled: {
			type: Boolean,
			required: true,
		},
	},

	methods: {
		setFilter() {
			this.$emit('set');
		},
		resetFilter() {
			this.$emit('reset');
		},
	},
};
</script>
