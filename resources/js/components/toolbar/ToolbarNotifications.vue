<template>
	<v-menu offset-y left transition="slide-y-transition">
		<template v-slot:activator="{ on }">
			<v-badge bordered content="6" offset-x="22" offset-y="22">
				<v-btn icon v-on="on">
					<v-icon>mdi-bell-outline</v-icon>
				</v-btn>
			</v-badge>
		</template>

		<v-card>
			<v-list three-line dense max-width="400">
				<v-subheader class="pa-2 font-weight-bold">Notifications</v-subheader>
				<div v-for="(item, index) in toolbarNotifications" :key="item.id">
					<v-divider
						v-if="index > 0 && index < toolbarNotifications.length"
						inset
					/>

					<v-list-item @click="readNotification">
						<v-list-item-avatar
							size="32"
							:color="getNotificationColor(item.type)"
						>
							<v-icon dark small>{{ getNotificationIcon(item.type) }}</v-icon>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title>{{ item.title }}</v-list-item-title>
							<v-list-item-subtitle class="caption">
								{{ item.subtitle }}
							</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-action class="align-self-center">
							<v-list-item-action-text>
								{{ item.created_at }}
							</v-list-item-action-text>
						</v-list-item-action>
					</v-list-item>
				</div>
			</v-list>

			<div class="text-center py-2">
				<v-btn small @click="navigateToNotificationsPage">See all</v-btn>
			</div>
		</v-card>
	</v-menu>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'ToolbarNotifications',

	computed: {
		...mapGetters({
			toolbarNotifications: 'notifications/getFirstFiveNotificationsForToolbar',
			getNotificationColor: 'notifications/getNotificationColor',
			getNotificationIcon: 'notifications/getNotificationIcon',
		}),
	},

	methods: {
		...mapActions({
			readNotification: 'notifications/readNotification',
		}),

		navigateToNotificationsPage() {
			window.location.href = '/notifications';
		},
	},
};
</script>
