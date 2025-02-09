<template>
	<div class="user-account-tab d-flex flex-column tab-fill-height">
		<v-card v-if="!user" class="tab-fill-height">
			<v-card-title>{{ $t('user.title.basic_info') }}</v-card-title>
			<CommonLoading page-margin />
		</v-card>

		<template v-else>
			<UserAccountBlockedAlert v-if="block_status" :status="block_status" />
			<UserAccountBasicInfo :user="user" />
			<UserAccountPanels :user="user" :doc_statuses="doc_statuses" :trader_status="trader_status" />
		</template>
	</div>
</template>

<script>
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
    block_status: {
      type: Number,
      required: true,
    },
    doc_statuses: {
      type: Object,
      required: true,
    },
    trader_status: {
      type: Number,
      required: true,
    },
	},
	data() {
		return {

		};
	},
};
</script>
