<template>
	<span class="docs-content-nested-with-items">
		<v-expansion-panel
			v-for="(item, i) in dataItem.items"
			:key="i"
			:id="item.id"
		>
			<v-expansion-panel-header>
				{{ item.title }}
			</v-expansion-panel-header>
			<v-expansion-panel-content>
				{{ item.content }}
			</v-expansion-panel-content>
		</v-expansion-panel>
	</span>
</template>

<script>
export default {
	name: 'DocsContentNestedWithItems',

	props: {
		dataItem: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped lang="sass">
.docs-content-nested-with-items
	width: 100%
</style>
