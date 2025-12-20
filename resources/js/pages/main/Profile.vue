<template>
	<div class="profile-page flex-grow-1" v-if="blockStatus !== null">
		<v-tabs v-model="selectedTab" :key="$i18n.locale" show-arrows>
      <v-tab v-for="(item, index) in available_items" :key="item.hash" @click="navigatePage(item, index)">
        {{ item.text }}
      </v-tab>
		</v-tabs>
      <v-tabs-items v-model="selectedTab" class="profile-page__tabs-items">
        <v-tab-item v-for="item in available_items" :key="item.hash" v-if="trader">
          <UserAccountTab v-if="!isLoading && item.hash === '#account'" :user="trader" />
          <VerificationSteps v-if="!isLoading && item.hash === '#verification'"></VerificationSteps>
          <UserPropsTab v-if="!isLoading && item.hash === '#props'" :user="trader" :trader_status="status"></UserPropsTab>
          <UserApiTab v-if="!isLoading && item.hash === '#api'" />
          <UserSecurityTab v-if="!isLoading && item.hash === '#security'" :g2fa="trader.g2fa" />
          <UserSettingsTab v-if="!isLoading && item.hash === '#settings'" :is-hide-trading="isHideTrading" :is-ref-enabled="is_ref_enabled" :user-ref-program="trader.refProgram || 1" />
        </v-tab-item>
      </v-tabs-items>
	</div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex';
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
      selectedTabHash: state => state.user.profileSelectedHash,
    }),
    ...mapState('user', ['blockStatus','verifyStatus','status', 'doc_statuses']),
    ...mapState('app', ['product']),
    isHideTrading() {
      return (this.blockStatus & 8) > 0
    },
    is_ref_enabled() {
      return this.product.enabledReferral;
    },
    use_ru_props() {
      return this.product.fiatUseRUProps
    },
    use_kg_props() {
      return this.product.fiatUseKGProps
    },
    use_swift_props() {
      return this.product.fiatUseSwiftProps
    },
    show_props() {
      return this.use_kg_props || this.use_ru_props || this.use_swift_props;
    },
    items() {
      return [
        {
          icon: 'mdi-account-box-outline',
          text: this.$t('user.title.profile'),
          link: '/profile#account',
          hash: '#account',
        },
        {
          icon: 'mdi-email-outline',
          text: this.$t('user.title.verification'),
          link: '/profile#verification',
          hash: '#verification',
        },
        {
          icon: 'mdi-bank',
          text: this.$t('user.title.props'),
          link: '/profile#props',
          hash: '#props',
        },
        {
          icon: 'mdi-format-list-checkbox',
          text: this.$t('user.title.api'),
          link: '/profile#api',
          hash: '#api',
        },
        {
          icon: 'mdi-shield-key-outline',
          text: this.$t('user.title.security'),
          link: '/profile#security',
          hash: '#security',
        },
        {
          icon: 'mdi-cog-outline',
          text: this.$t('user.title.settings'),
          link: '/profile#settings',
          hash: '#settings',
        },
      ];
    },
    available_items() {
      let available = this.items;
      if(!this.use_ru_props && !this.use_kg_props && !this.use_swift_props)
        available = _.filter(this.items, item => { return item.link !== '/profile#props'; });
      if(this.isHideTrading)
        available = _.filter(this.items, item => { return item.link !== '/profile#api'; });
      return available;
    },
  },
  async created() {
    await Promise.all([this.getDocRequestStatusStore()]);
    this.isLoading = false;
    const tabName = window.location.hash;
    if (tabName) {
      let index = _.findIndex(this.available_items, function(item) { return item.hash === tabName; });
      if(index > -1) {
        this.selectedTab = index;
      }
    }
  },
	watch: {
		selectedTabStore(value) {
			this.selectedTab = value;
		},
	},
	methods: {
    ...mapActions({
      getDocRequestStatusStore: 'user/getDocRequestStatus',
    }),
    ...mapMutations({
      setProfileTab: 'user/SET_PROFILE_TAB',
    }),
    navigatePage(item, index) {
      if (this.$router.currentRoute.hash !== item.hash) {
        this.$router.replace(item.link);
        this.setProfileTab({index: Number(index), hash: item.hash});
      }
    },
	},
};
</script>

<style lang="sass" scoped>
.profile-page
	max-width: 100%

	&__tabs-items
		padding-top: 5px
</style>
