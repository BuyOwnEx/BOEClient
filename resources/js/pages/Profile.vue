<template>
	<div class="profile-page flex-grow-1">
		<v-tabs v-model="selectedTab" background-color="transparent" show-arrows>
			<v-tab :key="1">Account</v-tab>
			<v-tab :key="2">Information</v-tab>
		</v-tabs>

		<v-tabs-items v-model="selectedTab">
			<v-tab-item :key="1">
				<AccountTab :user="user" />
			</v-tab-item>

			<v-tab-item :key="2">
				<InformationTab :user="user" />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import AccountTab from '../pages/users/EditUser/AccountTab';
import InformationTab from '../pages/users/EditUser/InformationTab';

export default {
	name: 'Profile',

	components: {
		AccountTab,
		InformationTab,
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
