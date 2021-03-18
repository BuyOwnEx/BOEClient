<template>
	<v-container class="profile" fluid>
		<div class='flex-grow-1'>
			<v-tabs v-model='tab' :show-arrows='true' background-color='transparent'>
				<v-tab href='#account'>Account</v-tab>
				<v-tab href='#information'>Information</v-tab>
			</v-tabs>

			<v-tabs-items v-model='tab'>
				<v-tab-item value='account'>
					<account-tab ref='account' :user='user'></account-tab>
				</v-tab-item>

				<v-tab-item value='information'>
					<information-tab ref='information' :user='user'></information-tab>
				</v-tab-item>
			</v-tabs-items>
		</div>
	</v-container>
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
				'id': 32,
				'email': 'bfitchew0@ezinearticles.com',
				'name': 'Bartel Fitchew',
				'verified': false,
				'created': '2019-08-09T03:14:12Z',
				'lastSignIn': '2019-08-14T20:00:53Z',
				'disabled': true,
				'role': 'ADMIN',
				'avatar': '/images/avatars/avatar1.svg',
			},
			tab: null,
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
