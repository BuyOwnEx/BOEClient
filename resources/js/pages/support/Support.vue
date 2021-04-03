<template>
	<div class="support-page d-flex flex-grow-1 flex-row">
		<v-navigation-drawer
			v-model="drawer"
			class="support-page__sidebar elevation-1 rounded flex-shrink-0"
			:app="$vuetify.breakpoint.mdAndDown"
			:permanent="$vuetify.breakpoint.lgAndUp"
			width="240"
			floating
		>
			<SupportSidebarMenu @update="updateType" />
		</v-navigation-drawer>

		<div class="support-page__content-wrapper d-flex flex-grow-1 flex-column">
			<v-toolbar class="support-page__toolbar flex-grow-0 hidden-lg-and-up">
				<v-app-bar-nav-icon @click="drawer = !drawer" />
				<div class="title font-weight-bold">Поддержка</div>
			</v-toolbar>

			<SupportListWrapper :type-to-show="type" />
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

import SupportSidebarMenu from '../../components/support/sidebar/SupportSidebarMenu';
import SupportListWrapper from '../../components/support/list/SupportListWrapper';

export default {
	name: 'Support',

	components: {
		SupportSidebarMenu,
		SupportListWrapper,
	},

	data() {
		return {
			drawer: false,
			type: 'all',
		};
	},

	methods: {
		...mapActions({
			fetchTicketsStore: 'support/fetchTickets',
			fetchPriorityListStore: 'support/fetchPriorityList',
			fetchStatusListStore: 'support/fetchStatusList',
			fetchTagListStore: 'support/fetchTagList',
		}),

		async fetch() {
			await this.fetchTicketsStore();
			await this.fetchPriorityListStore();
			await this.fetchStatusListStore();
			await this.fetchTagListStore();
		},

		updateType(type) {
			this.type = type;
		},
	},

	created() {
		// this.fetch();
	},
};
</script>

<style lang="sass" scoped>
.support-page
	&__sidebar
		margin-right: 5px
	&__toolbar
		margin-bottom: 5px

.v-application--is-rtl
	.support-page
		&__sidebar
			margin-right: 0
			margin-left: 5px
</style>
