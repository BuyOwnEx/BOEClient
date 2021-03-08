<template>
	<transition-group name="notification" tag="div">
		<div
			v-for="(item, index) in notificationsForDisplay"
			:key="item.id"
			class="notification-container"
		>
			<div
				:class="'clickable alert alert-' + item.status + ' nomb'"
				v-html="item.text"
				@click.self="removeNotification(item.id)"
			></div>
		</div>
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
	watch: {
		notifications(val, oldVal) {
			if (val.length === 0 && this.notificationsHandler !== null) {
				clearInterval(this.notificationsHandler);
				this.notificationsHandler = null;
			}
			if (val.length > 0 && this.notificationsHandler === null) {
				this.initHandler();
			}
		},
	},
};
</script>
<style scoped>
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

.notification-container {
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	bottom: 56px;
	right: 16px;
	min-height: 80px;
	max-height: 160px;
	min-width: 200px;
	max-width: 500px;
	background: rgb(143, 164, 178);
	z-index: 2;
	padding: 8px 4px;
	transition: all 0.3s;
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
