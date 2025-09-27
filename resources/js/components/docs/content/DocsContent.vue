<template>
	<v-col cols="12" md="9" xl="10">
		<slot>
			<DocsContentTypeNested v-if="nested" :data-array="dataArray" :exp-array="nested_expanded" />
			<DocsContentTypeDefault v-else :data-array="dataArray" :exp-array="expanded" />
		</slot>
	</v-col>
</template>

<script>
import DocsContentTypeNested from '@/components/docs/content/type/DocsContentTypeNested.vue';
import DocsContentTypeDefault from '@/components/docs/content/type/DocsContentTypeDefault.vue';
export default {
	name: 'DocsContent',
	components: { DocsContentTypeNested, DocsContentTypeDefault },
	props: {
		dataArray: {
			type: Array,
			default() {
				return [];
			},
		},
		nested: {
			type: Boolean,
			default: false,
		},
    expanded: {
      type: Array,
      default() {
        return [0];
      },
    },
    nested_expanded: {
      type: Array,
      default() {
        return [[0]];
      },
    }
	},
};
</script>
