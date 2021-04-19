<template>
	<div class="user-account-tab tab-fill-height">
		<UserAccountTabBlockedAlert v-if="userData.blocked" />

		<UserAccountTabBasicInfo :user="userData" />

		<UserAccountTabPanels
			:user="userData"
			@reset-password="resetPassword"
		/>

	</div>
</template>

<script>
import { mapActions } from 'vuex';
import UserAccountTabBasicInfo from './parts/UserAccountTabBasicInfo';
import UserAccountTabPanels from './parts/UserAccountTabPanels';

export default {
	name: 'UserAccountTab',

	components: {
		UserAccountTabBasicInfo,
		UserAccountTabPanels,
		UserAccountTabBlockedAlert: () =>
			import(/* webpackPrefetch: true */ './parts/UserAccountTabBlockedAlert'),
	},

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			userData: this.user,
		};
	},

	methods: {
		...mapActions({
		}),

		async resetPassword() {},
	},
};
</script>
