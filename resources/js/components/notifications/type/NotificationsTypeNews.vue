<template>
	<div class="d-flex flex-grow-1">
		<NotificationsList
			:key="newsNotifications.length"
			:notifications-prop="newsNotifications"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import NotificationsList from '../NotificationsList';

export default {
	name: 'NotificationsTypeNews',

	components: { NotificationsList },

	computed: {
		...mapGetters({
			newsNotifications: 'notifications/getNewsNotifications',
		}),
	},
};
</script>

<style scoped></style>
