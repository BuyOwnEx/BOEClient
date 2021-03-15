<template>
	<div class="docs-content-nested-type">
		<div
			v-for="(dataItem, index) in dataArray"
			:id="dataItem.id"
			:key="dataItem.id"
		>
			<div class="trading-component-title pb-2">
				{{ dataItem.title }}
			</div>

			<v-expansion-panels
				v-model="nestedOpenedPanels[index]"
				class="mb-4"
				multiple
			>
				<DocsContentNestedWithItems
					v-if="dataItem.items"
					:data-item="dataItem"
				/>

				<DocsContentNestedWithoutItems v-else :data-item="dataItem" />
			</v-expansion-panels>
		</div>
	</div>
</template>

<script>
import DocsContentNestedWithItems from './nested/DocsContentNestedWithItems';
import DocsContentNestedWithoutItems from './nested/DocsContentNestedWithoutItems';

export default {
	name: 'DocsContentNestedType',

	components: { DocsContentNestedWithItems, DocsContentNestedWithoutItems },

	data() {
		return {
			nestedOpenedPanels: [[0]],
		};
	},

	props: {
		dataArray: {
			type: Array,
			required: true,
		},
	},
};
</script>

<style scoped></style>
