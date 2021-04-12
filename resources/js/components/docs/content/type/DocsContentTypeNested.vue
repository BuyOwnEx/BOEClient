<template>
	<div class="docs-content-type-nested">
		<div
			v-for="(dataItem, index) in dataArray"
			:id="dataItem.id"
			:key="dataItem.id"
		>
			<div class="component-title pb-2">
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
import DocsContentNestedWithItems from '../nested/DocsContentNestedWithItems';
import DocsContentNestedWithoutItems from '../nested/DocsContentNestedWithoutItems';

export default {
	name: 'DocsContentTypeNested',

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
