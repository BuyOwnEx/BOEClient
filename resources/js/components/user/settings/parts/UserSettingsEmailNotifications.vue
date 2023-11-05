<template>
	<section class="user-settings-tab__notifications">
		<v-form @submit.prevent="saveNotificationsSettings">
			<div class="user-settings-tab__header">
				{{ $t('user.settings.headers.managing_email_notifications') }}
			</div>

			<div>
				<v-checkbox
					v-model="selectedTypes"
					v-for="item in notificationsKinds"
					:key="item.id"
					:ripple="false"
					:label="item.title"
					:value="item.id"
					hide-details
				/>
			</div>

			<v-btn type="submit" class="mt-3" :loading="isSaveNotificationsLoading">
				{{ $t('common.save') }}
			</v-btn>
		</v-form>
	</section>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import showNotificationMixin from '@/mixins/common/showNotificationMixin';

export default {
	name: 'UserSettingsEmailNotifications',

	mixins: [showNotificationMixin],

	data() {
		return {
			selectedTypes: [],
			isSaveNotificationsLoading: false,
		};
	},

	computed: {
		...mapState('user', ['notificationStatus']),
		...mapGetters({
			notificationsKinds: 'notifications/notificationsKinds',
		}),
	},

	created() {
		this.selectedTypes = this.getSelectedFromBinary();
	},

	methods: {
		...mapActions({
			updateNotificationSettingsStore: 'user/updateNotificationSettings',
		}),

		async saveNotificationsSettings() {
			try {
				this.isSaveNotificationsLoading = true;

				const payload = {
					status: this.calculateDigitStatus(),
				};
				await this.updateNotificationSettingsStore(payload);

				this.pushSuccessNotification(this.$t('user.settings.notification_changed'));
			} finally {
				this.isSaveNotificationsLoading = false;
			}
		},

		calculateDigitStatus() {
			const binaryArr = new Array(this.notificationsKinds.length).fill('0');

			this.selectedTypes.forEach(id => {
				const index = id - 1;
				binaryArr[index] = '1';
			});
			binaryArr.reverse();
			const binaryStr = binaryArr.join('');

			return parseInt(binaryStr, 2);
		},
		getSelectedFromBinary() {
			const res = [];

			const binary = Number(this.notificationStatus).toString(2);
			const binaryArr = binary.split('').reverse();
			binaryArr.forEach((num, index) => {
				if (num === '1') res.push(index + 1);
			});

			return res;
		},
	},
};
</script>
