<template>
	<v-card class="user-settings-tab tab-fill-height">
		<v-card-title> {{ $t('user.title.settings') }} </v-card-title>

		<CommonLoading v-if="isLoading" page-margin />

		<v-card-text v-else>
			<UserSettingsRef v-if="!isHideTrading && isRefEnabled" :all-ref-types="allRefTypes" :user-ref-program-id="userRefProgram" />
			<UserSettingsEmailNotifications :show-trade-notifications="!isHideTrading" :show-ref-notifications="isRefEnabled" />
		</v-card-text>
	</v-card>
</template>

<script>
import { mapActions } from 'vuex';

import UserSettingsRef from '@/components/user/settings/parts/UserSettingsRef.vue';
import UserSettingsEmailNotifications from '@/components/user/settings/parts/UserSettingsEmailNotifications.vue';

import CommonLoading from '@/components/common/CommonLoading.vue';

export default {
	name: 'UserSettingsTab',
	components: {
		UserSettingsRef,
		UserSettingsEmailNotifications,
		CommonLoading,
	},
	props: {
		userRefProgram: {
			type: Number,
			required: true,
		},
    isHideTrading: {
      type: Boolean,
      required: false,
      default: false
    },
    isRefEnabled: {
      type: Boolean,
      required: false,
      default: false
    },
	},
	data() {
		return {
			allRefTypes: null,
			isLoading: true,
		};
	},
	async created() {
		await Promise.all([this.fetchRefTypes(), this.getNotificationSettingsStore()]);
		this.isLoading = false;
	},
	methods: {
		...mapActions({
			getNotificationSettingsStore: 'user/getNotificationSettings',
		}),
		async fetchRefTypes() {
			const { data } = await axios.get('/trader/ext/all_referral_types');
			this.allRefTypes = data.data;
		},
	},
};
</script>

<style lang="sass" scoped>
.user-settings-tab
	::v-deep &__header
		font-size: 1rem
		font-weight: 500

	::v-deep.v-input--selection-controls
		margin-top: 4px
</style>
