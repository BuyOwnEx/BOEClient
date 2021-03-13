<template>
	<v-col cols="12" md="9" xl="10">
		<!--		-->

		<slot>
			<div v-if="nested">
				<div
					v-for="(dataItem, index) in dataArray"
					:id="dataItem.id"
					:key="dataItem.id"
				>
					<div class="title pb-2">
						{{ dataItem.title }}
					</div>
					<v-expansion-panels
						v-model="nestedOpenedPanels[index]"
						class="mb-4"
						multiple
					>
						<v-expansion-panel
							v-for="(item, i) in dataItem.items"
							:key="i"
							:id="item.id"
						>
							<v-expansion-panel-header class="font-weight-black">
								{{ item.title }}
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								{{ item.content }}
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</div>

			<div v-else>
				<div v-for="dataItem in dataArray" :id="dataItem.id" :key="dataItem.id">
					<div class="title pb-2">
						{{ dataItem.title }}
					</div>
					<v-expansion-panels v-model="openedPanels" class="mb-4" multiple>
						<v-expansion-panel
							v-for="(item, i) in dataItem.items"
							:key="i"
							:id="item.id"
						>
							<v-expansion-panel-header class="font-weight-black">
								{{ item.title }}
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								{{ item.content }}
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</div>
		</slot>

		<!--		-->
	</v-col>
</template>

<script>
export default {
	name: 'DocsContent',

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

	data() {
		return {
			openedPanels: [0],
			nestedOpenedPanels: [[0]],
		};
	},
};
</script>

<style scoped></style>
