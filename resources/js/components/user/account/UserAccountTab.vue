<template>
	<div class="user-account-tab d-flex flex-column tab-fill-height">
		<v-card v-if="!user" class="tab-fill-height">
			<v-card-title>{{ $t('user.title.basic_info') }}</v-card-title>
			<CommonLoading page-margin />
		</v-card>

		<template v-else>
			<UserAccountBlockedAlert v-if="has_locks" :status="blockStatus" />
			<UserAccountBasicInfo :user="user" />
			<UserAccountPanels :user="user" :doc_statuses="doc_statuses" />
		</template>
	</div>
</template>

<script>
import CommonLoading from '@/components/common/CommonLoading.vue';
import UserAccountBasicInfo from '@/components/user/account/parts/UserAccountBasicInfo.vue';
import UserAccountPanels from '@/components/user/account/parts/UserAccountPanels.vue';
import { mapState } from 'vuex';

export default {
	name: 'UserAccountTab',

	components: {
		CommonLoading,
		UserAccountBasicInfo,
		UserAccountPanels,
		UserAccountBlockedAlert: () => import('@/components/user/account/parts/UserAccountBlockedAlert.vue'),
	},
	props: {
		user: {
			type: Object,
			required: true,
		},
	},
  computed: {
    ...mapState('user', ['blockStatus', 'doc_statuses']),
    has_locks() {
      return this.isTradeBlocked || this.isWithdrawBlocked || this.isSystemBlocked;
    },
    isTradeBlocked() {
      return (this.blockStatus & 1) > 0;
    },
    isWithdrawBlocked() {
      return (this.blockStatus & 2) > 0;
    },
    isSystemBlocked() {
      return (this.blockStatus & 4) > 0;
    },
  },
};
</script>
