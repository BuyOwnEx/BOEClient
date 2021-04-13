<template>
	<v-card class="user-settings-tab tab-fill-height">
		<v-card-title> {{ $t('user.title.settings') }} </v-card-title>

		<CommonLoading v-if="!allRefTypes" />

		<v-card-text v-else>
			<UserSettingsEmailNotifications :user-types='user.emailNotifications || []'/>

			<UserSettingsRef
				:all-ref-types="allRefTypes"
				:user-ref-program-id="user.refProgram || 1"
			/>

			<UserSettingsSystem />

			<UserSettingsSecurity />
		</v-card-text>
	</v-card>
</template>

<script>
import UserSettingsEmailNotifications from './parts/UserSettingsEmailNotifications';
import UserSettingsRef from './parts/UserSettingsRef';
import UserSettingsSystem from './parts/UserSettingsSystem';
import UserSettingsSecurity from './parts/UserSettingsSecurity';
import CommonLoading from '../../common/CommonLoading';

export default {
	name: 'UserSettingsTab',

	components: {
		UserSettingsEmailNotifications,
		UserSettingsRef,
		UserSettingsSystem,
		UserSettingsSecurity,
		CommonLoading,
	},

	props: {
		user: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			allRefTypes: null,
		};
	},

	created() {
		this.fetchRefTypes();
	},

	methods: {
		async fetchRefTypes() {
			const { data } = await axios.get('/trader/ext/all_referral_types');
			data.data.forEach(item => {
				item.name = `${item.percent}% - ${item.days} ${this.$t(
					'user.settings.days'
				)}`;
			});

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
