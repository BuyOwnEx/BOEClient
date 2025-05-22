<template>
	<v-dialog v-model="dialog" width="500">
		<template #activator="{ on, attrs }">
			<span :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-bind="attrs" v-on="on">
				<v-btn v-if="$vuetify.breakpoint.smAndUp" small tile>
					{{ $t('user.api.dialog.edit.title') }}
				</v-btn>

				<v-btn v-else icon small>
					<v-icon>
						mdi-pencil
					</v-icon>
				</v-btn>
			</span>
		</template>

		<v-card class="user-api-dialog-edit">
			<v-card-title class="common-dialog__title common-dialog__title--primary">
				{{ $t('user.api.dialog.edit.title') }}
			</v-card-title>

			<v-card-text class="common-dialog__content pt-0">
				<v-form ref="form">
          <v-checkbox
              v-model="form.info"
              :ripple="false"
              :label="$t('common.info')"
              disabled
              hide-details
              dense
          />
					<v-checkbox
              v-model="form.trading"
              :ripple="false"
              :label="$t('menu.trading')"
              hide-details
              dense
          />
					<v-checkbox
						v-model="form.withdraw"
						:ripple="false"
						:label="$t('common.withdrawal_funds')"
						hide-details
						dense
					/>

				</v-form>
			</v-card-text>

			<v-divider />

			<v-card-actions class="common-dialog__actions">
				<v-spacer />

				<v-btn small tile text plain @click="close">
					{{ $t('common.close') }}
				</v-btn>

				<v-spacer />

				<v-btn :loading="loading" color="primary" small tile text plain @click="edit">
					{{ $t('common.edit') }}
				</v-btn>

				<v-spacer />
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import CommonDialog from '@/components/common/CommonDialog.vue';

import loadingMixin from '@/mixins/common/loadingMixin';
import dialogMethodsMixin from '@/mixins/common/dialogMethodsMixin';

export default {
	name: 'UserApiDialogEdit',

	components: { CommonDialog },

	mixins: [loadingMixin, dialogMethodsMixin],

	props: {
		apiItem: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			form: {
        info: false,
				trading: false,
				withdraw: false,
			},
		};
	},

	computed: {
		isNoChanges() {
      const isInfoNoChange = this.beforeEditInfoValue === this.form.info;
			const isTradingNoChange = this.beforeEditTradingValue === this.form.trading;
			const isWithdrawNoChange = this.beforeEditWithdrawValue === this.form.withdraw;

			return isTradingNoChange && isWithdrawNoChange && isInfoNoChange;
		},

		enabledAbilities() {
			const result = [];

      if (this.form.info) result.push('info');
			if (this.form.trading) result.push('trading');
			if (this.form.withdraw) result.push('withdraw');

			return result;
		},

    beforeEditInfoValue() {
      return this.apiItem.abilities.indexOf('info') !== -1;
    },
		beforeEditTradingValue() {
			return this.apiItem.abilities.indexOf('trading') !== -1;
		},
		beforeEditWithdrawValue() {
			return this.apiItem.abilities.indexOf('withdraw') !== -1;
		},
	},

	methods: {
		async edit() {
			if (this.isNoChanges) {
				this.close();
				return;
			}

			try {
				this.startLoading();

				await axios.post('/trader/ext/edit_api_token', {
					id: this.apiItem.id,
					abilities: this.enabledAbilities,
				});

				this.$emit('edit', this.enabledAbilities);
				this.close();
			} finally {
				this.stopLoading();
			}
		},
	},

	mounted() {
    this.form.info = this.beforeEditInfoValue;
		this.form.trading = this.beforeEditTradingValue;
		this.form.withdraw = this.beforeEditWithdrawValue;
	},
};
</script>

<style lang="sass" scoped>
.user-api-dialog-edit
	::v-deep.v-input--checkbox
		display: inline-flex
		width: 49%
		margin-top: 0
</style>
