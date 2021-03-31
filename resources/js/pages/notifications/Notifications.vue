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
			<NotificationsSidebarMenu @update="updateHash" />
		</v-navigation-drawer>

		<div class="notifications__content-wrapper d-flex flex-grow-1 flex-column">
			<v-toolbar class="notifications__toolbar flex-grow-0 hidden-lg-and-up">
				<v-app-bar-nav-icon @click="drawer = !drawer" />
				<div class="title font-weight-bold">Уведомления</div>
			</v-toolbar>

			<component :is="notificationsTypeComponentToShow" :key="hash" />
		</div>
	</div>
</template>

<script>
import NotificationsSidebarMenu from '../../components/notifications/sidebar/NotificationsSidebarMenu';
import NotificationsTypeSystem from '../../components/notifications/type/NotificationsTypeSystem';
import NotificationsTypeNews from '../../components/notifications/type/NotificationsTypeNews';

export default {
	name: 'Notifications',

	components: {
		NotificationsSidebarMenu,
		NotificationsTypeSystem,
		NotificationsTypeNews,
	},

	data() {
		return {
			drawer: false,
			hash: 'system',
		};
	},

	computed: {
		notificationsTypeComponentToShow() {
			if (this.hash === 'news') return 'NotificationsTypeNews';
			else if (this.hash === 'system') return 'NotificationsTypeSystem';
		},
	},

	methods: {
		updateHash(hash) {
			this.hash = hash;
		},
	},
};
</script>

<style lang="sass" scoped>
.notifications
	&__sidebar
		margin-right: 5px
		position: sticky
		top: 69px !important
	&__toolbar
		margin-bottom: 5px

	@media screen and (max-width: 1263px)
		&__sidebar
			position: fixed
			top: 0 !important

.v-application--is-rtl
	.notifications
		&__sidebar
			margin-right: 0
			margin-left: 5px
</style>
