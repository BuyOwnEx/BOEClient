<template>
	<div class="d-flex flex-grow-1">
		<NotificationsList
			:key="notificationsData.length"
			:notifications-prop="notificationsData"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import NotificationsList from './NotificationsList';

export default {
	name: 'NotificationsListWrapper',

	props: {
		typeToShow: {
			type: String,
			required: true,
		},
	},

	components: { NotificationsList },

	computed: {
		...mapGetters({
			getNotificationsByType: 'notifications/getNotificationsByType',
		}),

		notificationsData() {
			return this.getNotificationsByType(this.typeToShow);
		},
	},
};
</script>

<style scoped></style>
