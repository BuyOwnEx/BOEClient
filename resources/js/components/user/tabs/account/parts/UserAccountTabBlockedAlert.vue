<template>
	<v-card class="user-account-tab-blocked-alert">
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

<style lang="sass" scoped>
.user-account-tab-blocked-alert
	margin-bottom: 5px
	background: #ff7365d6
</style>
