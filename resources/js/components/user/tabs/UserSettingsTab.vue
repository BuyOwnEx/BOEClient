<template>
	<v-card class="user-settings-tab">
		<v-card-title> {{ $t('user.title.settings') }} </v-card-title>

		<v-card-text>
			<v-form @submit.prevent="saveSettings">
				<section class="user-settings-tab__notifications">
					<div class="user-settings-tab__header">
						Управление почтовыми оповещениями
					</div>

					<v-checkbox hide-details label="checkbox" />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>
				</section>

				<section class="user-settings-tab__system">
					<div class="user-settings-tab__header">Настрйоки системы</div>

					<v-checkbox hide-details label="checkbox" />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>
				</section>

				<section class="user-settings-tab__security">
					<div class="user-settings-tab__header">Настрйоки безопасности</div>

					<v-checkbox hide-details label="checkbox" />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>
				</section>

				<v-btn type="submit">{{ $t('common.save') }}</v-btn>
			</v-form>
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
		async saveSettings() {
			console.log('saveSettings');
		},
	},

	mounted() {
		window.location.hash = '#settings';
	},
};
</script>

<style lang="sass" scoped>
.user-settings-tab
	&__header
		font-size: 0.9rem
		font-weight: 500

	section
		padding-bottom: 32px

	::v-deep.v-input
		margin-top: 8px
</style>
