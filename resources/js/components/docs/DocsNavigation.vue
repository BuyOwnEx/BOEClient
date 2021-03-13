<template>
	<v-col cols="12" md="3" xl="2">
		<div class="docs-navigation__sticky-wrapper">
			<div class="title mb-2">
				{{ $t('docs.navigation') }}
			</div>
			<!---->

			<slot>
				<div v-if="nested">
					<v-treeview
						v-model="tree"
						:items="dataArray"
						:open="['general']"
						:transition="true"
						item-children="items"
						item-text="title"
						open-on-click
						dense
					>
						<template #label="{ item }">
							<v-btn
								color="primary"
								text
								@click.stop="$vuetify.goTo(`#${item.id}`, { offset: 30 })"
							>
								{{ item.title }}
							</v-btn>
						</template>
					</v-treeview>
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

	data() {
		return {
			tree: [],
		};
	},
};
</script>

<style scoped lang="sass">
.docs-navigation
	&__sticky-wrapper
		position: sticky
		top: 90px
</style>
