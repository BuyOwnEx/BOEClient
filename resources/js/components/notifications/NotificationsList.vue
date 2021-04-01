<template>
	<v-card class="notifications-list">
		<div class="notifications-list__top px-2 d-flex align-center">
			<v-checkbox
				:value="selectAll"
				:indeterminate="selectAlmostAll"
				@click.stop="onSelectAll(selectAll)"
			/>

			<v-menu offset-y>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-menu-down</v-icon>
					</v-btn>
				</template>

				<v-list>
					<v-list-item
						v-for="item in menuSelection"
						:key="item.key"
						@click="onMenuSelection(item.key)"
					>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>

			<div v-show="selected.length > 0">
				<v-btn icon @click="readSelected">
					<v-icon>mdi-eye</v-icon>
				</v-btn>
				<v-btn color="error" icon @click="removeSelected">
					<v-icon>bx-trash-alt</v-icon>
				</v-btn>
			</div>

			<v-spacer />

			<div class="caption mr-1">1 - 20 of 428</div>
			<v-btn icon disabled>
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-chevron-right</v-icon>
			</v-btn>
		</div>

		<v-divider />

		<v-list>
			<v-list-item-group>
				<v-list-item
					v-for="item in notifications"
					:key="item.id"
					:class="{
						'grey lighten-4': item.isChecked && !$vuetify.theme.dark,
						'grey darken-4': item.isChecked && $vuetify.theme.dark,
						'v-list-item--active primary--text':
							selected.indexOf(item.id) !== -1,
					}"
					@click="readNotification(item)"
				>
					<v-list-item-action class="d-flex flex-row align-center">
						<v-checkbox v-model="selected" :value="item.id" @click.stop />
					</v-list-item-action>

					<v-list-item-content>
						<v-list-item-title :class="{ 'font-weight-light': item.isChecked }">
							{{ item.title }}
						</v-list-item-title>
						<v-list-item-subtitle>
							{{ item.author }}
						</v-list-item-subtitle>
						<v-list-item-subtitle class="font-weight-light">
							{{ item.text }}
						</v-list-item-subtitle>
						<v-list-item-subtitle>
							<v-chip
								v-for="label in item.labels"
								:key="label"
								:color="getLabelColor(label)"
								class="font-weight-bold mt-1 mr-1"
								outlined
								small
							>
								{{ getLabelTitle(label) }}
							</v-chip>
						</v-list-item-subtitle>
					</v-list-item-content>

					<v-list-item-action>
						<v-list-item-action-text>
							{{ item.created_at }}
						</v-list-item-action-text>
					</v-list-item-action>
				</v-list-item>
			</v-list-item-group>
		</v-list>

		<NotificationCommonModal
			v-if="showDetails"
			:show="showDetails"
			:notification="selectedNotificationDetails"
			@close="showDetails = false"
		/>
	</v-card>
</template>

<script>
import { mapActions } from 'vuex';
import NotificationCommonModal from './common/NotificationCommonModal';

export default {
	name: 'NotificationsList',

	components: { NotificationCommonModal },

	props: {
		notificationsProp: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			notifications: this.notificationsProp,

			showDetails: false,
			selectedNotificationDetails: null,

			selectAll: false,
			selectAlmostAll: false,
			selected: [],

			labels: [
				{
					id: 1,
					title: 'Hot',
					color: 'warning',
				},
				{
					id: 2,
					title: 'Important',
					color: 'error',
				},
			],
			menuSelection: [
				{
					title: 'All',
					key: 'all',
				},
				{
					title: 'Read',
					key: 'read',
				},
				{
					title: 'Unread',
					key: 'unread',
				},
			],
		};
	},

	watch: {
		selected(val) {
			this.$nextTick(() => {
				if (this.selectAll) {
					if (val.length === 0) {
						this.selectAll = false;
						this.selectAlmostAll = false;
					} else {
						if (this.notifications.length === val.length) {
							this.selectAlmostAll = false;
						} else {
							this.selectAlmostAll = true;
						}
					}
				}
			});
		},
		notificationProp(val) {
			this.notifications = val;
		},
	},
	methods: {
		...mapActions({
			readNotificationStore: 'notifications/readNotification',
			readSelectedStore: 'notifications/readSelected',
			removeSelectedStore: 'notifications/removeSelected',
		}),

		onMenuSelection(key) {
			switch (key) {
				case 'all':
					this.selected = this.notifications.map(i => i.id);
					this.selectAll = true;
					this.selectAlmostAll = false;
					break;
				case 'read':
					break;
				case 'unread':
					break;
			}
		},
		onSelectAll(selectAll) {
			if (this.selectAll) {
				this.selected = [];
			} else {
				this.selected = this.notifications.map(i => i.id);
			}
			this.selectAlmostAll = false;
			this.selectAll = !this.selectAll;
		},

		readNotification(notification) {
			console.log(notification)
			this.showDetails = true;
			this.selectedNotificationDetails = notification;
			this.readNotificationStore(notification.id);
		},
		readSelected() {
			this.readSelectedStore(this.selected);
			this.selected = [];
		},
		removeSelected() {
			this.closeDetailsIfDeletingItemOpen();
			this.removeSelectedStore(this.selected);
			this.selected = [];
		},

		getLabelColor(id) {
			const label = this.labels.find(l => l.id === id);
			return label ? label.color : '';
		},
		getLabelTitle(id) {
			const label = this.labels.find(l => l.id === id);
			return label ? label.title : '';
		},

		closeDetailsIfDeletingItemOpen() {
			const openedItem = this.selectedNotificationDetails;
			if (openedItem && this.selected.indexOf(openedItem.id) !== -1)
				this.showDetails = false;
		},
	},
};
</script>

<style lang="sass" scoped>
.notifications-list
	display: flex
	flex-grow: 1
	flex-flow: column
</style>
