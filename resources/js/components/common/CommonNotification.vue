<template>
	<transition-group class="notification" name="notification" tag="ul">
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
			const isWarning = status === 'partiallyFilled';
			const isSuccess =
				status === 'filled' || status === 'cancel' || status === 'closed';
			const isError =
				status === 'mc_liquidation' || status === 'timeout_liquidation';

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
	//min-height: 80px;
	//max-height: 160px;
	//min-width: 20vw;
	max-width: 40vw;
	z-index: 2;
	&__item {
		font-size: 13px;
		//background: #e8e8e8;
		padding: 4px 8px;
		list-style-type: none;
		cursor: pointer;
		transition: transform 0.3s;
	}
}
.theme--dark {
	.notification {
		&__item {
			//background: #30303c;
		}
	}
}

.slide-from-right-enter-active {
	transition: all 0.3s ease;
}

.slide-from-right-leave-active {
	transition: all 0.3s ease;
}

.slide-from-right-enter,
.slide-from-right-leave-to {
	transform: translateX(100%);
	opacity: 0;
}

.notification-enter-active,
.notification-leave-active {
}

.notification-enter {
	opacity: 0;
	transform: translateY(30px);
}

.notification-leave-to {
	opacity: 0;
	max-height: 0;
	transform: translateY(-30px);
}

.notification-move {
}

.slide-up-enter-active {
	transition: all 0.3s ease;
}

.slide-up-leave-active {
	transition: all 0.3s ease;
}

.slide-up-enter,
.slide-up-leave-to {
	overflow: hidden;
	padding-top: 0;
	transform: translateY(-10px);
	opacity: 0;
}
</style>
