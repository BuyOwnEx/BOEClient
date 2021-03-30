<template>
	<transition-group
		class="notification"
		name="scroll-y-reverse-transition"
		tag="ul"
	>
		<li
			v-for="item in notificationsForDisplay"
			:key="item.id"
			class="notification__item"
			:class="getStatusBackgroundColor(item.status)"
			@click.self="removeNotification(item.id)"
		>
			{{ item.text }}
		</li>
	</transition-group>
</template>

<script>
export default {
	data() {
		return {
			notificationsHandler: null,
			defaultDisplayInterval: 6000,
			displayLimit: 3,
			notificationIdInRemoveQueue: null,
		};
	},

	computed: {
		notifications() {
			return this.$store.state.notifications.notifications;
		},
		notificationsForDisplay() {
			return this.notifications.slice(0, this.displayLimit);
		},
	},

	methods: {
		initHandler() {
			if (this.notificationsHandler === null) {
				this.notificationsHandler = setInterval(() => {
					this.initNotificationRefresh();
				}, 1000);
			}
		},
		initNotificationRefresh() {
			console.log(this.notifications);
			let id = _.get(this.notifications[0], 'id', null);
			if (id !== this.notificationIdInRemoveQueue && id !== null) {
				this.notificationIdInRemoveQueue = id;
				setTimeout(() => {
					this.$store.commit(
						'notifications/setNotifications',
						_.tail(this.notifications)
					);
				}, _.get(this.notifications[0], 'timeout', this.defaultDisplayInterval));
			}
		},
		removeNotification(id) {
			let firstNotificationRemoved = _.get(this.notifications, 'id') === id;
			if (firstNotificationRemoved) {
				clearInterval(this.notificationsHandler);
				this.notificationsHandler = null;
			}

			this.$store.commit('notifications/dropNotificationIfExists', id);
			if (firstNotificationRemoved) {
				this.$nextTick(() => {
					this.initHandler();
				});
			}
		},

		getStatusBackgroundColor(status) {
			const isWarning = status === 'partiallyFilled' || status === 'warning';
			const isSuccess =
				status === 'filled' ||
				status === 'cancel' ||
				status === 'closed' ||
				status === 'success';
			const isError =
				status === 'mc_liquidation' ||
				status === 'timeout_liquidation' ||
				status === 'danger' ||
				status === 'error';

			if (isWarning) return 'warning';
			else if (isSuccess) return 'success';
			else if (isError) return 'error';
			else return 'primary';
		},
	},

	watch: {
		notifications(val) {
			if (val.length === 0 && this.notificationsHandler !== null) {
				clearInterval(this.notificationsHandler);
				this.notificationsHandler = null;
			}
			if (val.length > 0 && this.notificationsHandler === null) {
				this.initHandler();
			}
		},
	},

	created() {
		if (this.notifications.length > 0) {
			this.initHandler();
		}
	},

	beforeDestroy() {
		if (this.notificationsHandler !== null) {
			clearInterval(this.notificationsHandler);
			this.notificationsHandler = null;
		}
	},
};
</script>
<style scoped lang="scss">
.notification {
	position: fixed;
	bottom: 36px;
	right: 16px;
	max-width: 40vw;
	z-index: 2;
	&__item {
		color: white;
		font-size: 13px;
		padding: 4px 8px;
		list-style-type: none;
		cursor: pointer;
		transition: transform 0.3s;
	}
}

.scroll-y-reverse-transition-move {
	transition: transform 0.2s;
}
</style>
