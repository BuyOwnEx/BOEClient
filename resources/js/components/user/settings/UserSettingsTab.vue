<template>
	<v-card class="user-settings-tab tab-fill-height">
		<v-card-title> {{ $t('user.title.settings') }} </v-card-title>

		<CommonLoading v-if="!allRefTypes" />

		<v-card-text v-else>
			<section class="user-settings-tab__notifications">
				<v-form @submit.prevent="saveNotificationsSetting">
					<div class="user-settings-tab__header">
						{{ $t('user.settings.headers.managing_email_notifications') }}
					</div>

					<v-checkbox :ripple="false" label="checkbox" hide-details />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>

					<v-btn type="submit" class="mt-3" :loading="saveNotificationsLoading">
						{{ $t('common.save') }}
					</v-btn>
				</v-form>
			</section>

			<v-divider class="my-4" />

			<section class="user-settings-tab__system">
				<v-form>
					<div class="user-settings-tab__header">
						{{ $t('user.settings.headers.ref_settings') }}
					</div>

					<v-select
						v-model="selectedRefTypeID"
						:items="activeRefTypes"
						item-value="id"
						hide-details
						hide-selected
					>
						<template #item="{item}">
							{{ getRefText(item.id) }}
						</template>
						<template #selection="{item}">
							{{ getRefText(item.id) }}
						</template>
					</v-select>
					<div class="user-settings-tab__select-hint">
						Получение <b>{{ selectedRefType.percent }}</b>
						% от сделок рефералов на протяжении
						<b>{{ selectedRefType.days }}</b> дней
					</div>

					<CommonDialog @confirm="saveRefSettings">
						<template #default>
							<v-btn class="mt-3" :loading="saveRefLoading">
								{{ $t('common.save') }}
							</v-btn>
						</template>
						<template #content>
							{{ $t('user.settings.dialog.ref_description') }}
						</template>
					</CommonDialog>
				</v-form>
			</section>

			<v-divider class="my-4" />

			<section class="user-settings-tab__system">
				<v-form @submit.prevent="saveSystemSettings">
					<div class="user-settings-tab__header">
						{{ $t('user.settings.headers.system_settings') }}
					</div>

					<v-checkbox :ripple="false" label="checkbox" hide-details />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>

					<v-btn type="submit" class="mt-3" :loading="saveSystemLoading">
						{{ $t('common.save') }}
					</v-btn>
				</v-form>
			</section>

			<v-divider class="my-4" />

			<section class="user-settings-tab__security">
				<v-form @submit.prevent="saveSecuritySettings">
					<div class="user-settings-tab__header">
						{{ $t('user.settings.headers.security_settings') }}
					</div>

					<v-checkbox :ripple="false" label="checkbox" hide-details />
					<v-radio-group hide-details mandatory dense row>
						<v-radio :ripple="false" label="radio" />
						<v-radio :ripple="false" label="radio" />
					</v-radio-group>

					<v-btn type="submit" class="mt-3" :loading="saveSecurityLoading">
						{{ $t('common.save') }}
					</v-btn>
				</v-form>
			</section>
		</v-card-text>
	</v-card>
</template>

<script>
import CommonDialog from '../../common/CommonDialog';
import CommonLoading from '../../common/CommonLoading';

export default {
	name: 'UserSettingsTab',

	components: { CommonDialog, CommonLoading },

	data() {
		return {
			selectedRefTypeID: 1,
			allRefTypes: null,

			saveNotificationsLoading: false,
			saveRefLoading: false,
			saveSystemLoading: false,
			saveSecurityLoading: false,
		};
	},

	computed: {
		activeRefTypes() {
			if (!this.allRefTypes) return [];
			return this.allRefTypes.filter(t => t.status === 'active');
		},
		selectedRefType() {
			return this.activeRefTypes.find(t => t.id === this.selectedRefTypeID);
		},
	},

	created() {
		this.fetchRefTypes();
		this.selectedRefTypeID = this.$store.state.app.trader.refProgram || 1;
	},

	methods: {
		async fetchRefTypes() {
			const { data } = await axios.get('/trader/ext/all_referral_types');
			this.allRefTypes = data.data;
		},

		async saveNotificationsSetting() {
			try {
				this.saveNotificationsLoading = true;
			} finally {
				this.saveNotificationsLoading = false;
			}
		},
		async saveRefSettings() {
			try {
				this.saveRefLoading = true;
				await axios.post(
					'/trader/ext/set_referral_type',
					this.selectedRefTypeID
				);
			} finally {
				this.saveRefLoading = false;
			}
		},
		async saveSystemSettings() {
			try {
				this.saveSystemLoading = true;
			} finally {
				this.saveSystemLoading = false;
			}
		},
		async saveSecuritySettings() {
			try {
				this.saveSecurityLoading = true;
			} finally {
				this.saveSecurityLoading = false;
			}
		},

		getRefText(id) {
			const types = [
				{
					id: 1,
					name: '10% - 365 дней',
				},
				{
					id: 2,
					name: '15% - 180 дней',
				},
				{
					id: 3,
					name: '20% - 90 дней',
				},
				{
					id: 4,
					name: '30% - 60 дней',
				},
				{
					id: 5,
					name: '50% - 30 дней',
				},
				{
					id: 6,
					name: '60% - 30 дней',
				},
			];
			return types.find(t => t.id === id).name;
		},
	},
};
</script>

<style lang="sass" scoped>
.user-settings-tab
	&__header
		font-size: 0.9rem
		font-weight: 500
	&__select-hint
		padding-top: 4px

	::v-deep.v-input--selection-controls
		margin-top: 4px
</style>
