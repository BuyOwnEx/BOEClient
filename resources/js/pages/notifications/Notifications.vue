<template>
	<div class="notifications d-flex flex-row flex-grow-1 ">
		<v-navigation-drawer
			v-model="drawer"
			class="notifications__sidebar elevation-1 rounded flex-shrink-0"
			:app="$vuetify.breakpoint.mdAndDown"
			:permanent="$vuetify.breakpoint.lgAndUp"
			width="240"
			floating
		>
			<NotificationsSidebarMenu @update="updateType" />
		</v-navigation-drawer>

		<div class="notifications__content-wrapper d-flex flex-grow-1 flex-column">
			<v-toolbar class="notifications__toolbar flex-grow-0 hidden-lg-and-up">
				<v-app-bar-nav-icon @click="drawer = !drawer" />
				<div class="title font-weight-bold">
					{{ $t('notifications.title') }}
				</div>
			</v-toolbar>

			<NotificationsListWrapper :type-to-show="type" />
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

import NotificationsSidebarMenu from '../../components/notifications/sidebar/NotificationsSidebarMenu';
import NotificationsListWrapper from '../../components/notifications/list/NotificationsListWrapper';

export default {
	name: 'Notifications',

	components: {
		NotificationsSidebarMenu,
		NotificationsListWrapper,
	},

	data() {
		return {
			drawer: false,
			type: 'system',
		};
	},

	created() {
		this.fetch();
	},

	methods: {
		...mapActions({
			fetchNotificationsStore: 'notifications/fetchNotifications',
		}),

		async fetch() {
			await this.fetchNotificationsStore();
		},
		updateType(type) {
			this.type = type;
		},
	},
};
</script>

<style lang="sass" scoped>
.notifications
	&__sidebar
		margin-right: 5px
		@media screen and (max-width: 960px)
			border-radius: 0 !important
	&__toolbar
		margin-bottom: 5px

.v-application--is-rtl
	.notifications
		&__sidebar
			margin-right: 0
			margin-left: 5px
</style>
