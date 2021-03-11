<template>
	<div class="py-3 min-w-0 w-full">
		<div class="display-1">
			<slot name="title">
				{{ $t('common.faq') }}
			</slot>
		</div>

		<v-card img="/images/demo/cards/material2.jpg" class="mb-5">
			<div class="pa-4 py-8">
				<v-text-field
					v-model="search"
					solo
					hide-details
					append-icon="mdi-magnify"
					placeholder="Search"
				/>
			</div>
		</v-card>

		<v-row>
			<v-col cols="12" md="3" xl="2">
				<div class="sticky" style="top: 90px">
					<div class="title mb-2">Contents</div>
					<div v-for="item in itemsData" :key="item.id" class="mb-1">
						<v-btn
							text
							color="primary"
							@click="$vuetify.goTo(`#${item.id}`, { offset: 30 })"
							>{{ item.title }}</v-btn
						>
					</div>
				</div>
			</v-col>

			<v-col cols="12" md="9" xl="10">
				<slot>
					<v-expansion-panels class="mb-4" multiple>
						<v-expansion-panel v-for="(item, i) in searchResult" :key="i">
							<v-expansion-panel-header class="font-weight-black">
								{{ item.title }}
							</v-expansion-panel-header>
							<v-expansion-panel-content>
								{{ item.content }}
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</slot>
			</v-col>
		</v-row>

		<div class="caption mt-2 text-center">
			<slot name="footer">
				{{ $t('faq.call') }}
				<router-link to="">{{ $t('common.contact') }}</router-link>
			</slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DocsPageWrapper',

	props: {
		itemsData: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			search: '',
		};
	},

	computed: {
		searchResult() {
			const searchString = this.search.toLowerCase();
			if (searchString === '') return this.itemsData;

			return this.itemsData.filter(item => {
				return Object.values(item).some(itemValue =>
					itemValue
						.toString()
						.toLowerCase()
						.includes(searchString)
				);
			});
		},
	},
};
</script>

<style scoped></style>
