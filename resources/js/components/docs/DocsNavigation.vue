<template>
	<v-col class="docs-navigation pr-0" cols="12" md="3" xl="2">
		<div class="docs-navigation__sticky-wrapper">
			<div class="component-title mb-2">
				{{ $t('docs.navigation') }}
			</div>
			<!---->

			<slot>
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
						<span
							class="docs-navigation__item"
							@click.stop="$vuetify.goTo(`#${item.id}`, { offset: 30 })"
						>
							{{ item.title }}
						</span>
					</template>
				</v-treeview>
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
	&__item
		overflow: hidden
		text-overflow: ellipsis
</style>
