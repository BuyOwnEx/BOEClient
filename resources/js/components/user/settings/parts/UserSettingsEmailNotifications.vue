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

			<v-btn type="submit" class="mt-3" :loading="saveNotificationsLoading">
				{{ $t('common.save') }}
			</v-btn>
		</v-form>
	</section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'UserSettingsEmailNotifications',

	props: {
		userTypes: {
			type: Array,
			required: true,
		},
	},

	data() {
		return {
			selectedTypes: this.userTypes,
			saveNotificationsLoading: false,
		};
	},

	computed: {
		...mapGetters({
			notificationsKinds: 'notifications/notificationsKinds',
		}),
	},

	methods: {
		...mapActions({
			updateNotificationsSettings: 'user/updateNotificationsSettings',
		}),

		async saveNotificationsSettings() {
			try {
				this.saveNotificationsLoading = true;
				const payload = this.selectedTypes.sort((a, b) => a - b);

				await this.updateNotificationsSettings(payload);
			} finally {
				this.saveNotificationsLoading = false;
			}
		},
	},
};
</script>
