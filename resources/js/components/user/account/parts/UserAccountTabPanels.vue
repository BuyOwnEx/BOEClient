<template>
	<v-expansion-panels class="user-account-tab-panels" v-model="panel" multiple>
		<v-expansion-panel class="user-account-tab-panels__actions" readonly>
			<v-expansion-panel-header class="title">
				{{ $t('user.title.actions') }}
			</v-expansion-panel-header>

			<v-expansion-panel-content>
				<div class="mb-2">
					<div class="title">Reset User Password</div>
					<div class="subtitle mb-2">
						Sends a reset password email to the user.
					</div>
					<v-btn class="mb-2" @click="resetPassword">
						<v-icon left small>mdi-email</v-icon>
						Send Reset Password Email
					</v-btn>
				</div>

				<v-divider />

				<div class="my-2">
					<div class="title">Change Email</div>
					<div class="subtitle mb-2">
						Sends a change email request to the user
					</div>
					<v-btn class="mb-2">
						<v-icon left small>mdi-email</v-icon>
						Change Email Request
					</v-btn>
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>

		<v-expansion-panel class="user-account-tab-panels__metadata">
			<v-expansion-panel-header class="title">
				{{ $t('user.title.metadata') }}
			</v-expansion-panel-header>

			<v-expansion-panel-content class="body-2">
				<div>
					<span class="font-weight-bold">Created: </span>
					{{ formatDate(user.created_at) }}
				</div>
				<div>
					<span class="font-weight-bold">Last Sign In: </span>
					{{ formatDate(user.lastLoginAt) }}
				</div>
				<div>
					<span class="font-weight-bold">Last Browser: </span>
					{{ user.lastBrowser }}
				</div>
				<div>
					<span class="font-weight-bold">Last Device: </span>
					{{ user.lastDevice }}
				</div>
				<div>
					<span class="font-weight-bold">Last OS: </span>
					{{ user.lastOS }}
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script>
import formatDate from '../../../../mixins/format/formatDate';

export default {
	name: 'UserAccountTabPanels',

	mixins: [formatDate],

	props: {
		user: {
			type: Object,
			required: true,
		},
		enableLoading: {
			type: Boolean,
			required: true,
		},
	},

	data() {
		return {
			panel: [0, 1],
		};
	},

	methods: {
		enableUser() {
			this.$emit('enable');
		},
		openBlockDialog() {
			this.$emit('open-block-dialog');
		},
		openDeleteDialog() {
			this.$emit('open-delete-dialog');
		},

		resetPassword() {
			this.$emit('reset-password');
		},
	},
};
</script>

<style lang="sass" scoped>
.user-account-tab-panels
	padding-top: 5px

	::v-deep.v-expansion-panel--active:not(:first-child)
		margin-top: 5px
		+ .v-expansion-panel
			margin-top: 5px

	&__actions
		cursor: default !important
		::v-deep.v-expansion-panel-header__icon
			display: none
</style>
