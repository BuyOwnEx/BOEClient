<template>
	<v-col cols="12" md="9" xl="10">
		<!--		-->

		<slot>
			<div>
				<div v-for="dataItem in dataArray" :id="dataItem.id" :key="dataItem.id">
					<div class="title pb-2">
						{{ dataItem.title }}
					</div>
					<v-expansion-panels class="mb-4" multiple>
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
	},
};
</script>

<style scoped></style>
