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
		<v-divider class="my-4" />
	</section>
</template>

<script>
export default {
	name: 'UserSettingsEmailNotifications',

	props: {
		userTypes: {
			type: Object,
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
		notificationsKinds() {
			return this.$store.state.notifications.notificationsKinds;
		},
	},

	methods: {
		async saveNotificationsSettings() {
			try {
				this.saveNotificationsLoading = true;
				const payload = this.selectedTypes.sort((a, b) => a - b);

				// await axios.post('')
			} finally {
				this.saveNotificationsLoading = false;
			}
		},
	},
};
</script>

<style lang="sass" scoped>
.user-settings-tab__notifications
	::v-deep.v-input--checkbox
		display: inline-flex
		width: 25%
		padding-right: 8px
		@media screen and (max-width: 1264px)
			width: 33%
		@media screen and (max-width: 960px)
			width: 50%
		@media screen and (max-width: 600px)
			width: 100%
</style>
