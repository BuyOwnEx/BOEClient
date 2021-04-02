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
				<div class="title font-weight-bold">Уведомления</div>
			</v-toolbar>

			<keep-alive>
				<component :is="notificationsTypeComponentToShow" :key="type" />
			</keep-alive>
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
			type: 'system',
		};
	},

	computed: {
		notificationsTypeComponentToShow() {
			const firstCharToUppercase = this.type.charAt(0).toUpperCase();
			const restOfWord = this.type.slice(1);
			return 'NotificationsType' + firstCharToUppercase + restOfWord;
		},
	},

	methods: {
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
	&__toolbar
		margin-bottom: 5px

.v-application--is-rtl
	.notifications
		&__sidebar
			margin-right: 0
			margin-left: 5px
</style>
