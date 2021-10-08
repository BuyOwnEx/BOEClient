<template>
	<div class="user-account-tab tab-fill-height">
		<UserAccountBlockedAlert v-if="userData.blocked" />
		<UserAccountBasicInfo :user="userData" />
		<UserAccountPanels :user="userData" />
	</div>
</template>

<script>
import UserAccountBasicInfo from './parts/UserAccountBasicInfo';
import UserAccountPanels from './parts/UserAccountPanels';

export default {
	name: 'UserAccountTab',

	components: {
		UserAccountBasicInfo,
		UserAccountPanels,
		UserAccountBlockedAlert: () => import(/* webpackPrefetch: true */ './parts/UserAccountBlockedAlert'),
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
};
</script>
