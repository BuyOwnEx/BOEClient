<template>
	<div class="notifications-list">
		<div class="notifications-list__top px-2 d-flex align-center">
			<v-checkbox
				v-if="notifications.length"
				:value="selectAll"
				:indeterminate="selectAlmostAll"
				:ripple="false"
				@click.stop="handleSelectAll"
			/>

			<div v-if="selected.length">
				<CommonTooltip :value="$t('notifications.read_all')">
					<v-btn icon @click="readSelected">
						<v-icon>mdi-eye</v-icon>
					</v-btn>
				</CommonTooltip>

				<CommonTooltip :value="$t('notifications.delete_all')">
					<v-btn color="error" icon @click="deleteSelected">
						<v-icon>bx-trash-alt</v-icon>
					</v-btn>
				</CommonTooltip>
			</div>

			<v-spacer />

			<div v-if="notifications.length" class="d-flex align-center">
				<div class="caption mr-1">
					{{ pagesText }}
				</div>
				<v-btn icon :disabled="currentPage === 1" @click="getPrevPage">
					<v-icon>mdi-chevron-left</v-icon>
				</v-btn>
				<v-btn icon :disabled="currentPage === totalPages" @click="getNextPage">
					<v-icon>mdi-chevron-right</v-icon>
				</v-btn>
			</div>
		</div>

		<v-divider />

		<v-list class="pa-0">
			<v-list-item
				v-for="item in paginatedNotifications"
				:key="item.id"
				:class="{
					'grey lighten-4': item.read && !$vuetify.theme.dark,
					'grey darken-4': item.read && $vuetify.theme.dark,
					'v-list-item--active primary--text': selected.indexOf(item.id) !== -1,
				}"
				@click="readNotification(item)"
			>
				<v-list-item-action class="d-flex flex-row align-center">
					<CommonTooltip :value="$t('common.delete')">
						<v-btn color="error" icon @click.prevent="deleteNotificationStore(item.id)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</CommonTooltip>
				</v-list-item-action>

				<v-list-item-content>
					<v-list-item-title :class="{ 'font-weight-light': item.read }">
						{{ getSubject(item.subtype_id) }}
					</v-list-item-title>
					<v-list-item-subtitle :class="{ 'font-weight-light': $vuetify.theme.dark }">
						{{ getSubTitleText(item) }}
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
						{{ formatDate(item.created_at, 'timeAgo') }}
					</v-list-item-action-text>
				</v-list-item-action>
			</v-list-item>
		</v-list>

		<div v-if="!notifications.length" class="d-flex align-center justify-center overline py-6">
			{{ $t('notifications.no_notifications') }}
		</div>

		<NotificationsDetail
			v-if="showDetails"
			:dialog-prop="showDetails"
			:subject="getSubject(selectedNotificationDetails.subtype_id)"
			:text="getSubTitleText(selectedNotificationDetails)"
			@close="showDetails = false"
		/>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CommonTooltip from '@/components/common/CommonTooltip.vue';
import formatDate from '@/mixins/format/formatDate';

export default {
	name: 'NotificationsList',

	components: {
		CommonTooltip,
		NotificationsDetail: () => import('@/components/notifications/NotificationsDetail.vue'),
	},

	mixins: [formatDate],

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

			currentPage: 1,
			perPage: 20,

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
		};
	},

	computed: {
		...mapGetters({
			getSubject: 'notifications/getNotificationKindSubject',
			getSubTitleText: 'notifications/getNotificationSubTitleText',
		}),

		pagesText() {
			const firstVisibleElement = this.currentPage * this.perPage - this.perPage + 1;
			const showedElements = Math.min(this.currentPage * this.perPage, this.notifications.length);
			return `${firstVisibleElement} - ${showedElements} of ${this.notifications.length}`;
		},
		paginatedNotifications() {
			const from = this.currentPage * this.perPage - this.perPage;
			const to = this.currentPage * this.perPage;
			return this.notifications.slice(from, to);
		},
		totalPages() {
			return Math.ceil(this.notifications.length / this.perPage);
		},
	},

	watch: {
		selected(val) {
			this.$nextTick(() => {
				if (this.selectAll) {
					if (val.length === 0) {
						this.selectAll = false;
						this.selectAlmostAll = false;
					} else {
						this.selectAlmostAll = this.notifications.length !== val.length;
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
			deleteNotificationStore: 'notifications/deleteNotification',

			readAllStore: 'notifications/readAll',
			deleteAllStore: 'notifications/deleteAll',

			readSelectedStore: 'notifications/readSelected',
			deleteSelectedStore: 'notifications/deleteSelected',
		}),

		handleSelectAll() {
			if (this.selectAll) {
				this.selected = [];
			} else {
				this.selected = this.notifications.map(i => i.id);
			}
			this.selectAlmostAll = false;
			this.selectAll = !this.selectAll;
		},

		readNotification(notification) {
			this.showDetails = true;
			this.selectedNotificationDetails = notification;
			if (!notification.read) this.readNotificationStore(notification.id);
		},
		readSelected() {
			// this.readSelectedStore(this.selected);
			this.readAllStore();
			this.selected = [];
		},
		deleteSelected() {
			this.closeDetailsIfDeletingItemOpen();
			// this.deleteSelectedStore(this.selected);
			this.deleteAllStore();
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

		getPrevPage() {
			this.currentPage--;
		},
		getNextPage() {
			this.currentPage++;
		},

		closeDetailsIfDeletingItemOpen() {
			const openedItem = this.selectedNotificationDetails;
			if (openedItem && this.selected.indexOf(openedItem.id) !== -1) this.showDetails = false;
		},
	},
};
</script>

<style lang="sass" scoped>
.notifications-list
	display: flex
	flex-grow: 1
	flex-flow: column
	&__top
		height: 82px
</style>
