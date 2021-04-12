<template>
	<v-col cols="12" md="9" xl="10">
		<!--		-->

		<slot>
			<DocsContentTypeNested v-if="nested" :data-array="dataArray" />
			<DocsContentTypeDefault v-else :data-array="dataArray" />
		</slot>

		<!--		-->
	</v-col>
</template>

<script>
import DocsContentTypeNested from './type/DocsContentTypeNested';
import DocsContentTypeDefault from './type/DocsContentTypeDefault';

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
	},
};
</script>
