<template>
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

			<v-btn type="submit" class="mt-3" :loading="saveSystemLoading">
				{{ $t('common.save') }}
			</v-btn>
		</v-form>
		<v-divider class="my-4" />
	</section>
</template>

<script>
export default {
	name: 'UserSettingsSystem',

	data() {
		return {
			saveSystemLoading: false,
		};
	},

	methods: {
		async saveSystemSettings() {
			try {
				this.saveSystemLoading = true;
			} finally {
				this.saveSystemLoading = false;
			}
		},
	},
};
</script>

<style scoped></style>
