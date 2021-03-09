<template>
	<v-row class="filter-top px-1" align="center" no-gutters>
		<span class="filter-top__title text-overline">
			Filters
		</span>

		<v-btn icon @click="toggleFilters">
			<v-icon v-if="show">mdi-chevron-down</v-icon>
			<v-icon v-else>mdi-chevron-up</v-icon>
		</v-btn>
	</v-row>
</template>

<script>
export default {
	name: 'FiltersTitle',

	props: {
		show: {
			type: Boolean,
			required: true,
		}
	},

	methods: {
		toggleFilters() {
			this.$emit('toggle-filters');
		},
	},
};
</script>

<style scoped lang="sass">
.filter-top__title
	font-size: 1rem !important
</style>
