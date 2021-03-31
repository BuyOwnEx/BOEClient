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
				<UserApiTab :user="trader" />
			</v-tab-item>

			<v-tab-item :key="4">
				<UserSecurityTab :g2fa="trader.g2fa" />
			</v-tab-item>

			<v-tab-item :key="5">
				<UserSettingsTab :user="trader" />
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UserAccountTab from '../../components/user/tabs/account/UserAccountTab';
import UserVerificationTab from '../../components/user/tabs/verification/UserVerificationTab';
import UserApiTab from '../../components/user/tabs/api/UserApiTab';
import UserSecurityTab from '../../components/user/tabs/security/UserSecurityTab';
import UserSettingsTab from '../../components/user/tabs/settings/UserSettingsTab';

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
			selectedTab: this.selectedTabStore,
		};
	},

	computed: {
		...mapState({
			trader: state => state.app.trader,
			selectedTabStore: state => state.user.profileSelectedTab,
		}),
	},

	watch: {
		selectedTabStore(value) {
			this.selectedTab = value;
		},
		selectedTab(value) {
			this.setHash(value);
		},
	},

	methods: {
		...mapActions({
			setProfileTab: 'user/setProfileTab',
		}),

		setHash(tabIndex) {
			if (tabIndex === 0) history.replaceState(null, null, ' ');
			else if (tabIndex === 1) window.location.hash = '#verification';
			else if (tabIndex === 2) window.location.hash = '#api';
			else if (tabIndex === 3) window.location.hash = '#security';
			else if (tabIndex === 4) window.location.hash = '#settings';
		},
	},

	mounted() {
		const tabName = window.location.hash;
		if (tabName) {
			if (tabName === '#verification') this.selectedTab = 1;
			else if (tabName === '#api') this.selectedTab = 2;
			else if (tabName === '#security') this.selectedTab = 3;
			else if (tabName === '#settings') this.selectedTab = 4;
		}
	},
};
</script>

<style lang="sass" scoped>
.profile-page
	max-width: 100%

	&__tabs-items
		padding-top: 5px
</style>
