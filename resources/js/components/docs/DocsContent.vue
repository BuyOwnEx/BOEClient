<template>
	<v-col cols="12" md="9" xl="10">
		<!--		-->

		<slot>
			<DocsContentNestedType v-if="nested" :data-array="dataArray" />
			<DocsContentDefaultType v-else :data-array="dataArray" />
		</slot>

		<!--		-->
	</v-col>
</template>

<script>
import DocsContentNestedType from './parts/content/DocsContentNestedType';
import DocsContentDefaultType from './parts/content/DocsContentDefaultType';

export default {
	name: 'DocsContent',

	components: { DocsContentNestedType, DocsContentDefaultType },

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

<style scoped></style>
