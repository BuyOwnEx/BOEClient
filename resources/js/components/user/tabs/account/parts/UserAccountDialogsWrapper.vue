<template>
	<div>
		<v-dialog
			:value="disableDialog"
			max-width="290"
			@click:outside="closeDisableDialog"
		>
			<v-card>
				<v-card-title class="headline">Disable User</v-card-title>
				<v-card-text>Are you sure you want to disable this user?</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn @click="closeDisableDialog">Cancel</v-btn>
					<v-btn color="warning" :loading="dialogLoading" @click="disableUser">
						Disable
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog
			:value="deleteDialog"
			max-width="290"
			@click:outside="closeDeleteDialog"
		>
			<v-card>
				<v-card-title class="headline">Delete User</v-card-title>
				<v-card-text>Are you sure you want to delete this user?</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn @click="closeDeleteDialog">Cancel</v-btn>
					<v-btn color="error" :loading="dialogLoading" @click="deleteUser"
						>Delete</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	name: 'UserAccountDialogsWrapper',

	props: {
		disableDialog: {
			type: Boolean,
			required: true,
		},
		deleteDialog: {
			type: Boolean,
			required: true,
		},
		dialogLoading: {
			type: Boolean,
			required: true,
		},
	},

	methods: {
		closeDisableDialog() {
			this.$emit('close-disable-dialog');
		},
		closeDeleteDialog() {
			this.$emit('close-delete-dialog');
		},

		disableUser() {
			this.$emit('disable');
		},
		deleteUser() {
			this.$emit('delete');
		},
	},
};
</script>

<style scoped></style>
