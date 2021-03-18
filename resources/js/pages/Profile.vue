<template>
	<div class="profile-page flex-grow-1">
		<v-tabs v-model="selectedTab" background-color="transparent" show-arrows>
			<v-tab :key="1">Аккаунт</v-tab>
			<v-tab :key="2">Информация</v-tab>
			<v-tab :key="3">Верификация</v-tab>
			<v-tab :key="4">API</v-tab>
			<v-tab :key="4">Безопасность</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab" class="pt-1">
			<v-tab-item :key="1">
				<UserAccountTab :user="user" />
			</v-tab-item>

			<v-tab-item :key="2">
				<UserInformationTab :user="user" />
			</v-tab-item>

			<v-tab-item :key="3">
				<UserVerificationTab />
			</v-tab-item>

			<v-tab-item :key="4">
				<UserApiTab />
			</v-tab-item>

			<v-tab-item :key="5">
				<UserSecurityTab />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import UserAccountTab from '../components/user/tabs/UserAccountTab';
import UserInformationTab from '../components/user/tabs/UserInformationTab';
import UserVerificationTab from '../components/user/tabs/UserVerificationTab';
import UserApiTab from '../components/user/tabs/UserApiTab';
import UserSecurityTab from '../components/user/tabs/UserSecurityTab';

export default {
	name: 'Profile',

	components: {
		UserAccountTab,
		UserInformationTab,
		UserVerificationTab,
		UserApiTab,
		UserSecurityTab,
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
