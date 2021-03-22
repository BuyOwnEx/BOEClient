<template>
	<div class="profile-page flex-grow-1">
		<v-tabs v-model="selectedTab" background-color="transparent" show-arrows>
			<v-tab :key="1">Аккаунт</v-tab>
			<v-tab :key="2">Верификация</v-tab>
			<v-tab :key="3">API</v-tab>
			<v-tab :key="4">Безопасность</v-tab>
			<v-tab :key="5">Настройки</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab" class="pt-1">
			<v-tab-item :key="1">
				<UserAccountTab :user="user" />
			</v-tab-item>

			<v-tab-item :key="2">
				<UserVerificationTab :user="user" />
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
import UserAccountTab from '../components/user/tabs/UserAccountTab';
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
			user: {
				id: 32,
				email: 'bfitchew0@ezinearticles.com',
				name: 'Bartel Fitchew',
				verified: false,
				created: '2019-08-09T03:14:12Z',
				lastSignIn: '2019-08-14T20:00:53Z',
				disabled: true,
				role: 'ADMIN',
				avatar: '/images/avatars/avatar1.svg',
			},
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
};
</script>

<style scoped></style>
