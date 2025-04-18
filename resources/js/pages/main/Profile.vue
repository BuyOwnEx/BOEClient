<template>
	<div class="profile-page flex-grow-1">
		<v-tabs v-model="selectedTab" :key="$i18n.locale" show-arrows>
			<v-tab :key="1">{{ $t('user.title.account') }}</v-tab>
			<v-tab :key="2">{{ $t('user.title.verification') }}</v-tab>
      <v-tab :key="3">{{ $t('user.title.props') }}</v-tab>
			<v-tab :key="4">{{ $t('user.title.api') }}</v-tab>
			<v-tab :key="5">{{ $t('user.title.security') }}</v-tab>
			<v-tab :key="6">{{ $t('user.title.settings') }}</v-tab>
		</v-tabs>
      <v-tabs-items v-model="selectedTab" class="profile-page__tabs-items">
        <v-tab-item v-if="trader" :key="1">
          <UserAccountTab v-if="!isLoading" :user="trader" :block_status="blockStatus" :doc_statuses="doc_statuses" :trader_status="status"  />
        </v-tab-item>

        <v-tab-item v-if="trader" :key="2">
          <VerificationSteps v-if="!isLoading"></VerificationSteps>
        </v-tab-item>

        <v-tab-item v-if="trader" :key="3">
          <UserPropsTab v-if="!isLoading" :user="trader" :trader_status="status"></UserPropsTab>
        </v-tab-item>

        <v-tab-item v-if="trader" :key="4">
          <UserApiTab v-if="!isLoading" />
        </v-tab-item>

        <v-tab-item v-if="trader" :key="5">
          <UserSecurityTab v-if="!isLoading" :g2fa="trader.g2fa" />
        </v-tab-item>

        <v-tab-item v-if="trader" :key="6">
          <UserSettingsTab v-if="!isLoading" :user-ref-program="trader.refProgram || 1" />
        </v-tab-item>
      </v-tabs-items>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import UserAccountTab from '@/components/user/account/UserAccountTab.vue';
import VerificationSteps from '@/components/user/verification/VerificationSteps.vue';
import UserPropsTab from '@/components/user/props/UserPropsTab.vue';
import UserApiTab from '@/components/user/api/UserApiTab.vue';
import UserSecurityTab from '@/components/user/security/UserSecurityTab.vue';
import UserSettingsTab from '@/components/user/settings/UserSettingsTab.vue';

export default {
	name: 'Profile',

	components: {
		UserAccountTab,
    VerificationSteps,
    UserPropsTab,
		UserApiTab,
		UserSecurityTab,
		UserSettingsTab,
	},

	data() {
		return {
			selectedTab: this.selectedTabStore,
      isLoading: true,
		};
	},

  computed: {
    ...mapState({
      trader: state => state.app.trader,
      selectedTabStore: state => state.user.profileSelectedTab,
    }),
    ...mapState('user', ['blockStatus','verifyStatus','status', 'doc_statuses']),
  },

  async created() {
    await Promise.all([this.getVerificationStatusStore(), this.getBlockStatusStore(), this.getStatusStore(), this.getDocRequestStatusStore()]);
    this.isLoading = false;
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
      getBlockStatusStore: 'user/getBlockStatus',
      getVerificationStatusStore: 'user/getVerifyStatus',
      getStatusStore: 'user/getStatus',
      getDocRequestStatusStore: 'user/getDocRequestStatus',
    }),
		setHash(tabIndex) {
			if (tabIndex === 0) history.replaceState(null, null, ' ');
			else if (tabIndex === 1) window.location.hash = '#verification';
      else if (tabIndex === 2) window.location.hash = '#props';
			else if (tabIndex === 3) window.location.hash = '#api';
			else if (tabIndex === 4) window.location.hash = '#security';
			else if (tabIndex === 5) window.location.hash = '#settings';
		},
	},

	mounted() {
		const tabName = window.location.hash;
		if (tabName) {
			if (tabName === '#verification') this.selectedTab = 1;
      else if (tabName === '#props') this.selectedTab = 2;
			else if (tabName === '#api') this.selectedTab = 3;
			else if (tabName === '#security') this.selectedTab = 4;
			else if (tabName === '#settings') this.selectedTab = 5;
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
