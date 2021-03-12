<template>
	<v-col cols="12" md="3" xl="2">
		<div class="sticky" style="top: 90px">
			<div class="title mb-2">
				{{ $t('docs.navigation') }}
			</div>
			<!---->

			<slot>
				<div v-if="nested">
					<div v-for="dataItem in dataArray" :key="dataItem.id" class="mb-1">
						<v-btn
							text
							color="primary"
							@click="$vuetify.goTo(`#${dataItem.id}`, { offset: 30 })"
						>
							{{ dataItem.title }}
						</v-btn>

						<div v-if="dataItem.items">
							<div class="pl-2" v-for="item in dataItem.items" :key="item.id">
								<v-btn
									text
									color="primary"
									@click="$vuetify.goTo(`#${item.id}`, { offset: 30 })"
								>
									{{ item.title }}
								</v-btn>
							</div>
						</div>
					</div>
				</div>

				<div v-else>
					<div v-for="item in dataArray[0].items" :key="item.id" class="mb-1">
						<v-btn
							text
							color="primary"
							@click="$vuetify.goTo(`#${item.id}`, { offset: 30 })"
						>
							{{ item.title }}
						</v-btn>
					</div>
				</div>
			</slot>

			<!---->
		</div>
	</v-col>
</template>

<script>
export default {
	name: 'DocsNavigation',

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
