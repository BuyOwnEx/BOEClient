<template>
	<v-card class="user-settings-tab tab-fill-height">
		<v-card-title> {{ $t('user.title.settings') }} </v-card-title>

		<v-card-text>
			<section class="user-settings-tab__notifications">
				<v-form @submit.prevent="saveNotificationsSetting">
					<div class="user-settings-tab__header">
						{{ $t('user.settings.headers.managing_email_notifications') }}
					</div>

					<v-checkbox :ripple="false" label="checkbox" hide-details />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>

					<v-btn type="submit" class="mt-3">{{ $t('common.save') }}</v-btn>
				</v-form>
			</section>

			<v-divider class="my-4" />

			<section class="user-settings-tab__system">
				<v-form @submit.prevent="saveSystemSettings">
					<div class="user-settings-tab__header">
						{{ $t('user.settings.headers.system_settings') }}
					</div>

					<v-checkbox :ripple="false" label="checkbox" hide-details />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>

					<v-btn type="submit" class="mt-3">{{ $t('common.save') }}</v-btn>
				</v-form>
			</section>

			<v-divider class="my-4" />

			<section class="user-settings-tab__security">
				<v-form @submit.prevent="saveSecuritySettings">
					<div class="user-settings-tab__header">
						{{ $t('user.settings.headers.security_settings') }}
					</div>

					<v-checkbox :ripple="false" label="checkbox" hide-details />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>

					<v-btn type="submit" class="mt-3">{{ $t('common.save') }}</v-btn>
				</v-form>
			</section>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'UserSettingsTab',

	data() {
		return {};
	},

	methods: {
		async saveNotificationsSetting() {
			console.log('saveNotificationsSetting');
		},
		async saveSystemSettings() {
			console.log('saveSystemSettings');
		},
		async saveSecuritySettings() {
			console.log('saveSecuritySettings');
		},
	},
};
</script>

<style lang="sass" scoped>
.user-settings-tab
	&__header
		font-size: 0.9rem
		font-weight: 500

	::v-deep.v-input--selection-controls
		margin-top: 4px
</style>
