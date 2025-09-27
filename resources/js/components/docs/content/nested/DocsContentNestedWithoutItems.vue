<template>
	<span class="docs-content-nested-without-items">
		<v-expansion-panel :id="dataItem.id">
			<v-expansion-panel-header>
				{{ dataItem.title.toUpperCase() }}
			</v-expansion-panel-header>
			<v-expansion-panel-content v-html='dataItem.content'>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</span>
</template>

<script>
export default {
	name: 'DocsContentNestedWithoutItems',

	props: {
		dataItem: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped lang='sass'>
.docs-content-nested-without-items
	width: 100%
</style>
