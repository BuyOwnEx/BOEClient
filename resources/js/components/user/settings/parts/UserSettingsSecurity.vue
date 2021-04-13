<template>
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

			<v-btn type="submit" class="mt-3" :loading="saveSecurityLoading">
				{{ $t('common.save') }}
			</v-btn>
		</v-form>
	</section>
</template>

<script>
export default {
	name: 'UserSettingsSecurity',

	data() {
		return {
			saveSecurityLoading: false,
		};
	},

	methods: {
		async saveSecuritySettings() {
			try {
				this.saveSecurityLoading = true;
			} finally {
				this.saveSecurityLoading = false;
			}
		},
	},
};
</script>

<style scoped></style>
