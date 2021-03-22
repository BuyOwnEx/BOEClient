<template>
	<div>
		<div>
			<UserAccountTabBlockedAlert
				v-if="userData.disabled"
				:loading="enableUserLoading"
				@enable="enableUser"
			/>

			<UserAccountTabBasicInfo :user="userData" />

			<UserAccountTabPanels
				:user="userData"
				:loading="enableUserLoading"
				@enable="enableUser"
				@open-disable-dialog="openDisableDialog"
				@open-delete-dialog="openDeleteDialog"
			/>
		</div>

		<UserAccountDialogsWrapper
			:disable-dialog="disableDialog"
			:delete-dialog="deleteDialog"
			:dialog-loading="dialogLoading"
			@close-disable-dialog="closeDisableDialog"
			@close-delete-dialog="closeDeleteDialog"
			@disable="disableUser"
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
			disableDialog: false,
			dialogLoading: false,
			enableUserLoading: false,
			userData: this.user,
		};
	},

	methods: {
		...mapActions({
			enableUserStore: 'user/enableUser',
			disableUserStore: 'user/disableUser',
			deleteUserStore: 'user/deleteUser',
		}),

		async enableUser() {
			try {
				this.enableUserLoading = true;
				await this.enableUserStore(user.id);
				this.userData.disabled = false;
			} catch (e) {
				console.error(e);
			} finally {
				this.enableUserLoading = false;
			}
		},
		async disableUser() {
			try {
				this.dialogLoading = true;
				await this.disableUserStore(user.id);
				this.userData.disabled = true;
				this.closeDisableDialog();
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

		openDisableDialog() {
			this.disableDialog = true;
		},
		openDeleteDialog() {
			this.deleteDialog = true;
		},
		closeDisableDialog() {
			this.disableDialog = false;
		},
		closeDeleteDialog() {
			this.deleteDialog = false;
		},
	},
};
</script>
