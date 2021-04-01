<template>
	<v-list class="pa-0" dense nav>
		<div class="overline pa-1">Типы уведомлений</div>

		<v-list-item
			v-for="item in notificationTypes"
			:key="item.type"
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

	computed: {
		...mapState('notifications', ['notificationTypes']),
		...mapGetters({
			systemQuantity: 'notifications/getSystemNotificationUnreadQuantity',
			newsQuantity: 'notifications/getNewsNotificationUnreadQuantity',
		}),
	},

	methods: {
		navigate(type) {
			window.location.hash = type;
			this.$emit('update', type);
		},
		getTypeQuantity(type) {
			const name = `${type}Quantity`;
			return this[name];
		},
	},
};
</script>

<style scoped></style>
