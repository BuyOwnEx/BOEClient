<template>
	<v-list class="notifications-sidebar-menu pa-1" dense nav>
		<div class="overline pa-1 pt-0 pb-2">{{ $t('notifications.notifications_types') }}</div>

		<v-list-item
			v-for="item in notificationTypes"
			:key="item.id"
			:input-value="value === item.id"
			:ripple="false"
			active-class="primary--text"
			@click="navigate(item.id, item.type)"
		>
			<v-list-item-icon>
				<v-icon small :color="item.color">{{ item.icon }}</v-icon>
			</v-list-item-icon>

			<v-list-item-content>
				<v-list-item-title>{{ item.name }}</v-list-item-title>
			</v-list-item-content>

			<v-list-item-action v-if="getTypeQuantity(item.type_id) > 0">
				<v-badge class="font-weight-bold" :content="getTypeQuantity(item.type_id)" :color="item.color" inline />
			</v-list-item-action>
		</v-list-item>
	</v-list>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'NotificationsSidebarMenu',

	model: {
		prop: 'value',
		event: 'update:value',
	},

	props: {
		value: {
			type: Number,
			required: false,
			default: 0,
		},
	},

	computed: {
		...mapGetters({
			notificationTypes: 'notifications/notificationTypes',
			getTypeQuantity: 'notifications/getNotificationsUnreadQuantityByType',
		}),
	},

	methods: {
		navigate(typeID, typeKey) {
			this.setHash(typeKey);
			this.$emit('update:value', typeID);
		},
		setHash(key) {
			if (key === 'all') history.replaceState(null, null, ' ');
			else window.location.hash = key;
		},
	},
};
</script>
