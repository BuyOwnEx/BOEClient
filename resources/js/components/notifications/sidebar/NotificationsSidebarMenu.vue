<template>
	<v-list class="notifications-sidebar-menu pa-1" dense nav>
		<div class="overline pa-1 pt-0 pb-2">{{ $t('notifications.notifications_types') }}</div>

		<v-list-item
			v-for="item in notificationTypes"
			:key="item.type"
			:input-value="selectedType === item.type"
			:ripple="false"
			active-class="primary--text"
			@click="navigate(item.type)"
		>
			<v-list-item-icon>
				<v-icon small :color="item.color">{{ item.icon }}</v-icon>
			</v-list-item-icon>

			<v-list-item-content>
				<v-list-item-title>{{ item.name }}</v-list-item-title>
			</v-list-item-content>

			<v-list-item-action v-if="getTypeQuantity(item.type) > 0">
				<v-badge
					class="font-weight-bold"
					:content="getTypeQuantity(item.type)"
					:color="item.color"
					inline
				>
				</v-badge>
			</v-list-item-action>
		</v-list-item>
	</v-list>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
	name: 'NotificationsSidebarMenu',

	data() {
		return {
			selectedType: 'system',
		};
	},

	computed: {
		...mapState('notifications', ['notificationTypes']),
		...mapGetters({
			getTypeQuantity: 'notifications/getNotificationsUnreadQuantityByType',
		}),
	},

	methods: {
		navigate(type) {
			window.location.hash = type;
			this.selectedType = type;
			this.$emit('update', type);
		},
	},
};
</script>
