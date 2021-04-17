<template>
	<v-card class="d-flex flex-grow-1">
		<CommonLoading v-if="!notificationsData" class="mt-6" />
		<NotificationsList
			v-else
			:key="listKey"
			:notifications-prop="notificationsData"
		/>
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import NotificationsList from './NotificationsList';
import CommonLoading from '../../common/CommonLoading';

export default {
	name: 'NotificationsListWrapper',

	props: {
		typeToShow: {
			type: String,
			required: true,
		},
	},

	components: { NotificationsList, CommonLoading },

	computed: {
		...mapGetters({
			getNotificationsByType: 'notifications/getNotificationsByType',
		}),

		notificationsData() {
			return this.getNotificationsByType(this.typeToShow);
		},
		listKey() {
			return this.notificationsData.length + Math.random();
		},
	},
};
</script>
