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
			<SupportSidebarMenu @update-status="updateStatus" @update-priority="updatePriority" />
		</v-navigation-drawer>

		<div class="support-page__content-wrapper d-flex flex-grow-1 flex-column">
			<v-toolbar class="support-page__toolbar flex-grow-0 hidden-lg-and-up">
				<v-app-bar-nav-icon @click="drawer = !drawer" />
				<div class="title font-weight-bold">Поддержка</div>
			</v-toolbar>

			<SupportListWrapper :status-to-show="status" :priority-to-show="priority" />
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
			status: 'all',
			priority: 'all'
		};
	},

	methods: {
		...mapActions({
			fetchTicketsStore: 'support/fetchTickets',
		}),

		async fetch() {
			await this.fetchTicketsStore();
		},

		updateStatus(status) {
			this.status = status;
		},
		updatePriority(priority) {
			this.priority = priority;
		},
	},

	created() {
		 this.fetch();
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
