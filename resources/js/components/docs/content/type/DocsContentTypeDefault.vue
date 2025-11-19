<template>
	<div class="docs-content-type-default">
		<v-expansion-panels v-model="openedPanels" class="mb-4" multiple>
			<v-expansion-panel
				v-for="dataItem in dataArray"
				:id="dataItem.id"
				:key="dataItem.id"
			>
				<v-expansion-panel-header>
					{{ dataItem.title.toUpperCase() }}
				</v-expansion-panel-header>
				<v-expansion-panel-content v-html='dataItem.content'>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
	</div>
</template>

<script>

import Vue from "vue";

export default {
	name: 'DocsContentTypeDefault',
	data() {
		return {
			openedPanels: this.expArray,
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
        return [0];
      },
    }
	},
  mounted() {
    if (this.$route.hash) {
      this.$nextTick(() => {
        const element = document.getElementById(this.$route.hash.replace('#', ''));
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      });
    }
  },
};
</script>
