<template>
	<v-expansion-panels class="user-account-tab-panels" v-model="panel" multiple>
		<v-expansion-panel>
			<v-expansion-panel-header class="title">
				Actions
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
					<div class="title">Export Account Data</div>
					<div class="subtitle mb-2">
						Export all the platform metadata for this user.
					</div>
					<v-btn class="mb-2">
						<v-icon left small>mdi-clipboard-account</v-icon>
						Export User Data
					</v-btn>
				</div>

				<v-divider />

				<div class="my-2">
					<div class="error--text title">Danger Zone</div>
					<div class="subtitle mb-2">
						Full administrator with access to this dashboard.
					</div>

					<div class="my-2">
						<v-btn
							v-if="user.role === 'ADMIN'"
							color="primary"
							@click="user.role = 'USER'"
						>
							<v-icon left small>mdi-security</v-icon>
							Remove admin access
						</v-btn>
						<v-btn v-else color="primary" @click="user.role = 'ADMIN'">
							<v-icon left small>mdi-security</v-icon>
							Set User as Admin
						</v-btn>
					</div>

					<v-divider />

					<div class="subtitle mt-3 mb-2">
						Prevent the user from signing in on the platform.
					</div>
					<div class="my-2">
						<v-btn
							v-if="user.blocked"
							color="warning"
							:loading="enableLoading"
							@click="enableUser"
						>
							<v-icon left small>mdi-account-check</v-icon>
							Enable User
						</v-btn>
						<v-btn v-else color="warning" @click="openBlockDialog">
							<v-icon left small>mdi-cancel</v-icon>
							Disable User
						</v-btn>
					</div>

					<v-divider />

					<div class="subtitle mt-3 mb-2">
						To delete the user please transfer ownership or delete user's
						subscriptions.
					</div>
					<v-btn color="error" @click="openDeleteDialog">
						<v-icon left small>mdi-delete</v-icon>
						Delete User
					</v-btn>
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>

		<v-expansion-panel>
			<v-expansion-panel-header class="title">
				Metadata
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
import formatDate from '../../../../../mixins/format/formatDate';

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
			panel: [1],
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
	::v-deep.v-expansion-panel--active
		margin-top: 5px
		+ .v-expansion-panel
			margin-top: 5px
</style>
