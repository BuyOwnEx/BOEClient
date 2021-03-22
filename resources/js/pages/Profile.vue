<template>
	<div class="profile-page flex-grow-1">
		<v-tabs v-model="selectedTab" show-arrows>
			<v-tab :key="1">{{ $t('user.title.account') }}</v-tab>
			<v-tab :key="2">{{ $t('user.title.verification') }}</v-tab>
			<v-tab :key="3">{{ $t('user.title.api') }}</v-tab>
			<v-tab :key="4">{{ $t('user.title.security') }}</v-tab>
			<v-tab :key="5">{{ $t('user.title.settings') }}</v-tab>
		</v-tabs>

		<v-tabs-items
			v-if="trader"
			v-model="selectedTab"
			class="profile-page__tabs-items"
		>
			<v-tab-item :key="1">
				<UserAccountTab :user="trader" />
			</v-tab-item>

			<v-tab-item :key="2">
				<UserVerificationTab :user="trader" />
			</v-tab-item>

			<v-tab-item :key="3">
				<UserApiTab />
			</v-tab-item>

			<v-tab-item :key="4">
				<UserSecurityTab />
			</v-tab-item>

			<v-tab-item :key="5">
				<UserSettingsTab />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import UserAccountTab from '../components/user/tabs/account/UserAccountTab';
import UserVerificationTab from '../components/user/tabs/UserVerificationTab';
import UserApiTab from '../components/user/tabs/UserApiTab';
import UserSecurityTab from '../components/user/tabs/UserSecurityTab';
import UserSettingsTab from '../components/user/tabs/UserSettingsTab';

export default {
	name: 'Profile',

	components: {
		UserAccountTab,
		UserVerificationTab,
		UserApiTab,
		UserSecurityTab,
		UserSettingsTab,
	},

	data() {
		return {
			selectedTab: 0,
			breadcrumbs: [
				{
					text: 'Users',
					to: '/users/list',
					exact: true,
				},
				{
					text: 'Edit User',
				},
			],
		};
	},

	computed: {
		...mapState('app', ['trader']),
	},
};
</script>

<style lang="sass" scoped>
.profile-page
	&__tabs-items
		padding-top: 5px
</style>
