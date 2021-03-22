<template>
	<v-card class="warning mb-4" light>
		<v-card-title>User Disabled</v-card-title>
		<v-card-subtitle>
			This user has been disabled! Login access has been revoked.
		</v-card-subtitle>
		<v-card-text>
			<v-btn dark :loading="loading" @click="enableUser">
				<v-icon left small>mdi-account-check</v-icon>
				Enable User
			</v-btn>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: 'UserAccountTabBlockedAlert',

	props: {
		loading: {
			type: Boolean,
			required: true,
		},
	},

	methods: {
		enableUser() {
			this.$emit('enable');
		},
	},
};
</script>

<style scoped></style>
