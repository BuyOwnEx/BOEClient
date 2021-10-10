<template>
	<div class="user-account-tab tab-fill-height">
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

import CommonLoading from '../../common/CommonLoading';
import UserAccountBasicInfo from './parts/UserAccountBasicInfo';
import UserAccountPanels from './parts/UserAccountPanels';

export default {
	name: 'UserAccountTab',

	components: {
		CommonLoading,
		UserAccountBasicInfo,
		UserAccountPanels,
		UserAccountBlockedAlert: () => import(/* webpackPrefetch: true */ './parts/UserAccountBlockedAlert'),
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
		...mapState('user', ['blockStatus']),
	},

	async created() {
		await this.getBlockStatusStore();
		this.isLoading = false;
	},

	methods: {
		...mapActions({
			getBlockStatusStore: 'user/getBlockStatus',
		}),
	},
};
</script>
