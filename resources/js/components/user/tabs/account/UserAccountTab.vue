<template>
	<div class="user-account-tab tab-fill-height">
		<UserAccountTabBlockedAlert
			v-if="userData.blocked"
			:loading="enableUserLoading"
			@enable="enableUser"
		/>

		<UserAccountTabBasicInfo :user="userData" />

		<UserAccountTabPanels
			:user="userData"
			:enable-loading="enableUserLoading"
			@enable="enableUser"
			@open-block-dialog="openBlockDialog"
			@open-delete-dialog="openDeleteDialog"
			@reset-password="resetPassword"
		/>

		<UserAccountDialogsWrapper
			:block-dialog="blockDialog"
			:delete-dialog="deleteDialog"
			:dialog-loading="dialogLoading"
			@close-block-dialog="closeBlockDialog"
			@close-delete-dialog="closeDeleteDialog"
			@block="blockUser"
			@delete="deleteUser"
		/>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import UserAccountTabBlockedAlert from './parts/UserAccountTabBlockedAlert';
import UserAccountTabBasicInfo from './parts/UserAccountTabBasicInfo';
import UserAccountTabPanels from './parts/UserAccountTabPanels';
import UserAccountDialogsWrapper from './parts/UserAccountDialogsWrapper';

export default {
	name: 'UserAccountTab',

	components: {
		UserAccountTabBlockedAlert,
		UserAccountTabBasicInfo,
		UserAccountTabPanels,
		UserAccountDialogsWrapper,
	},

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			deleteDialog: false,
			blockDialog: false,
			dialogLoading: false,
			enableUserLoading: false,
			userData: this.user,
		};
	},

	methods: {
		...mapActions({
			enableUserStore: 'user/enableUser',
			blockUserStore: 'user/blockUser',
			deleteUserStore: 'user/deleteUser',
		}),

		async resetPassword() {},

		async enableUser() {
			try {
				this.enableUserLoading = true;
				await this.enableUserStore(user.id);
				this.userData.blocked = false;
			} catch (e) {
				console.error(e);
			} finally {
				this.enableUserLoading = false;
			}
		},
		async blockUser() {
			try {
				this.dialogLoading = true;
				await this.blockUserStore(user.id);
				this.userData.blocked = true;
				this.closeBlockDialog();
			} catch (e) {
				console.error(e);
			} finally {
				this.dialogLoading = false;
			}
		},
		async deleteUser() {
			try {
				this.dialogLoading = true;
				await this.deleteUserStore(user.id);
				this.closeDeleteDialog();
			} catch (e) {
				console.error(e);
			} finally {
				this.dialogLoading = false;
			}
		},

		openBlockDialog() {
			this.blockDialog = true;
		},
		openDeleteDialog() {
			this.deleteDialog = true;
		},
		closeBlockDialog() {
			this.blockDialog = false;
		},
		closeDeleteDialog() {
			this.deleteDialog = false;
		},
	},
};
</script>
