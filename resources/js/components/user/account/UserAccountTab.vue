<template>
	<div class="user-account-tab d-flex flex-column tab-fill-height">
		<v-card v-if="isLoading || !user" class="tab-fill-height">
			<v-card-title>{{ $t('user.title.basic_info') }}</v-card-title>
			<CommonLoading page-margin />
		</v-card>

		<template v-else>
			<UserAccountBlockedAlert v-if="blockStatus" :status="blockStatus" />
			<UserAccountBasicInfo :user="user" />
			<UserAccountPanels :user="user" />
		</template>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import CommonLoading from '@/components/common/CommonLoading.vue';
import UserAccountBasicInfo from '@/components/user/account/parts/UserAccountBasicInfo.vue';
import UserAccountPanels from '@/components/user/account/parts/UserAccountPanels.vue';

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

	data() {
		return {
			isLoading: true,
		};
	},

	computed: {
		...mapState('user', ['blockStatus','verifyStatus','status']),
	},

	async created() {
		await Promise.all([this.getVerificationStatusStore(), this.getBlockStatusStore(), this.getStatusStore()]);
		this.isLoading = false;
	},

	methods: {
		...mapActions({
			getBlockStatusStore: 'user/getBlockStatus',
			getVerificationStatusStore: 'user/getVerifyStatus',
      getStatusStore: 'user/getStatus',
		}),
	},
};
</script>
