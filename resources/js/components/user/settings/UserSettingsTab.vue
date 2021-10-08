<template>
	<v-card class="user-settings-tab tab-fill-height">
		<v-card-title> {{ $t('user.title.settings') }} </v-card-title>

		<CommonLoading v-if="isLoading" page-margin />

		<v-card-text v-else>
			<UserSettingsRef :all-ref-types="allRefTypes" :user-ref-program-id="userRefProgram" />
			<UserSettingsEmailNotifications :user-types="userEmailNotifications" />
		</v-card-text>
	</v-card>
</template>

<script>
import { mapActions } from 'vuex';

import UserSettingsRef from './parts/UserSettingsRef';
import UserSettingsEmailNotifications from './parts/UserSettingsEmailNotifications';

import CommonLoading from '../../common/CommonLoading';

export default {
	name: 'UserSettingsTab',

	components: {
		UserSettingsRef,
		UserSettingsEmailNotifications,
		CommonLoading,
	},

	props: {
		userEmailNotifications: {
			type: Array,
			required: true,
		},
		userRefProgram: {
			type: Number,
			required: true,
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
