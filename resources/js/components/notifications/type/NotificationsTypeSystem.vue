<template>
	<div class="d-flex flex-grow-1">
		<NotificationsList
			:key="systemNotifications.length"
			:notifications-prop="systemNotifications"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import NotificationsList from '../NotificationsList';

export default {
	name: 'NotificationsTypeSystem',

	components: { NotificationsList },

	computed: {
		...mapGetters({
			systemNotifications: 'notifications/getSystemNotifications',
		}),
	},
};
</script>
