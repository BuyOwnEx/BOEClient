<template>
	<v-card class="d-flex flex-grow-1 flex-column">
		<CommonLoading v-if="!notificationsData" page-margin />
		<NotificationsList v-else :key="listKey" :notifications-prop="notificationsData" />
	</v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import NotificationsList from '@/components/notifications/list/NotificationsList.vue';
import CommonLoading from '@/components/common/CommonLoading.vue';

export default {
	name: 'NotificationsListWrapper',

	props: {
		typeId: {
			type: Number,
			required: true,
		},
	},

	components: { NotificationsList, CommonLoading },

	computed: {
		...mapGetters({
			getNotificationsByType: 'notifications/getNotificationsByType',
		}),

		notificationsData() {
			return this.getNotificationsByType(this.typeId);
		},
		listKey() {
			return this.notificationsData.length + Math.random();
		},
	},
};
</script>
