<template>
	<v-col class="docs-navigation" cols="12" md="3" xl="2">
		<div class="docs-navigation__sticky-wrapper">
			<div class="trading-component-title mb-2">
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
						<v-btn
							color="primary"
							text
							plain
							@click.stop="$vuetify.goTo(`#${item.id}`, { offset: 30 })"
						>
							{{ item.title }}
						</v-btn>
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
</style>
