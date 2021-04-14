<template>
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
			<div class="user-settings-tab__system-select-hint">
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
		<v-divider class="my-4" />
	</section>
</template>

<script>
import CommonDialog from '../../../common/CommonDialog';

export default {
	name: 'UserSettingsRef',

	components: { CommonDialog },

	props: {
		allRefTypes: {
			type: Array,
			required: true,
		},
		userRefProgramId: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			selectedRefTypeID: this.userRefProgramId,
			saveRefLoading: false,
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

	methods: {
		async saveRefSettings() {
			try {
				this.saveRefLoading = true;
				await axios.post('/trader/ext/set_referral_type', {
					id: this.selectedRefTypeID,
				});
			} finally {
				this.saveRefLoading = false;
			}
		},

		getRefText(id) {
			const types = this.allRefTypes;
			if (!types) return '';

			return types.find(t => t.id === id).name;
		},
	},
};
</script>

<style lang="sass" scoped>
.user-settings-tab__system
	&__system-select-hint
		padding-top: 4px
</style>
