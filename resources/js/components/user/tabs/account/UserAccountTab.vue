<template>
	<div>
		<div>
			<UserAccountTabBlockedAlert v-if="user.disabled" @enable="enableUser" />

			<UserAccountTabBasicInfo :user="user" />

			<UserAccountTabPanels
				:user="user"
				@enable="enableUser"
				@open-disable-dialog="openDisableDialog"
				@open-delete-dialog="openDeleteDialog"
			/>
		</div>

		<UserAccountDialogsWrapper
			:disable-dialog="disableDialog"
			:delete-dialog="deleteDialog"
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
		};
	},

	methods: {
		...mapActions({
			enableUserStore: 'user/enableUser',
			disableUserStore: 'user/disableUser',
			deleteUserStore: 'user/deleteUser',
		}),

		enableUser() {},
		disableUser() {},
		deleteUser() {},

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
