<template>
	<div class="docs-content-type-nested">
		<div
			v-for="(dataItem, index) in dataArray"
			:id="dataItem.id"
			:key="dataItem.id"
		>
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
import DocsContentNestedWithItems from '@/components/docs/content/nested/DocsContentNestedWithItems.vue';
import DocsContentNestedWithoutItems from '@/components/docs/content/nested/DocsContentNestedWithoutItems.vue';

export default {
	name: 'DocsContentTypeNested',

	components: { DocsContentNestedWithItems, DocsContentNestedWithoutItems },

	data() {
		return {
			nestedOpenedPanels: this.expArray,
		};
	},

	props: {
		dataArray: {
			type: Array,
			required: true,
		},
    expArray: {
      type: Array,
      required: true,
      default() {
        return [[0]];
      },
    }
	},
};
</script>
