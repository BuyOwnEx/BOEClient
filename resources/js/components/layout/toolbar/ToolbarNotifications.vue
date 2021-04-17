<template>
	<div class="toolbar-notifications">
		<v-menu
			transition="slide-y-transition"
			:close-on-content-click="false"
			min-width="400"
			offset-y
			left
		>
			<template v-slot:activator="{ on }">
				<v-badge
					:content="unreadQuantity"
					:value="unreadQuantity"
					offset-x="22"
					offset-y="22"
					bordered
				>
					<v-btn icon v-on="on">
						<v-icon>mdi-bell-outline</v-icon>
					</v-btn>
				</v-badge>
			</template>

			<v-card class="toolbar-notifications__card">
				<div v-if="unreadQuantity > 0">
					<v-list three-line dense max-width="400">
						<v-subheader class="pa-2 font-weight-bold">
							Notifications
						</v-subheader>
						<div v-for="(item, index) in toolbarNotifications" :key="item.id">
							<v-divider
								v-if="index > 0 && index < toolbarNotifications.length"
								inset
							/>

							<v-list-item :ripple="false" @click="readNotification(item)">
								<v-list-item-avatar
									size="32"
									:color="getNotificationColor(item.type)"
								>
									<v-icon dark small>
										{{ getNotificationIcon(item.type) }}
									</v-icon>
								</v-list-item-avatar>

								<v-list-item-content>
									<v-list-item-title>
										{{ item.title }}
									</v-list-item-title>
									<v-list-item-subtitle class="caption">
										{{ item.subtitle }}
									</v-list-item-subtitle>
								</v-list-item-content>

								<v-list-item-action class="align-self-center">
									<v-list-item-action-text>
										{{ formatDate(item.created_at, 'timeAgo') }}
									</v-list-item-action-text>
								</v-list-item-action>
							</v-list-item>
						</div>
					</v-list>
				</div>

				<div v-else class="text-center overline pa-2 pb-0">
					{{ $t('notifications.no_notifications') }}
				</div>

				<div class="text-center mx-1 mx-sm-0 py-2">
					<v-btn
						:block="isTabletOrMobile"
						small
						@click="navigateToNotificationsPage"
					>
						{{$t('common.see_all')}}
					</v-btn>
				</div>
			</v-card>
		</v-menu>

		<NotificationCommonModal
			v-if="showDetails"
			:show="showDetails"
			:notification="selectedNotificationDetails"
			@close="showDetails = false"
		/>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NotificationCommonModal from '../../notifications/common/NotificationsCommonModal';
import formatDate from '../../../mixins/format/formatDate';

export default {
	name: 'ToolbarNotifications',

	components: { NotificationCommonModal },

	mixins: [formatDate],

	data() {
		return {
			showDetails: false,
			selectedNotificationDetails: null,
		};
	},

	computed: {
		...mapGetters({
			toolbarNotifications:
				'notifications/getFirstFiveUnreadNotificationsForToolbar',
			unreadQuantity: 'notifications/getUnreadNotificationsQuantity',

			getNotificationColor: 'notifications/getNotificationColor',
			getNotificationIcon: 'notifications/getNotificationIcon',
		}),

		isTabletOrMobile() {
			return this.$vuetify.breakpoint.smAndDown;
		},
	},

	methods: {
		...mapActions({
			readNotificationStore: 'notifications/readNotification',
		}),

		readNotification(notification) {
			this.showDetails = true;
			this.selectedNotificationDetails = notification;
			this.readNotificationStore(notification.id);
		},
		navigateToNotificationsPage() {
			window.location.href = '/notifications';
		},
	},
};
</script>

<style lang="sass" scoped>
.theme--dark .toolbar-notifications__card
	background-color: var(--dark-popups-background-color) !important
</style>
