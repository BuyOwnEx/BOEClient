<template>
	<v-dialog v-model="dialog" width="500">
		<template v-slot:activator="{ on, attrs }">
			<span :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" v-bind="attrs" v-on="on">
				<v-btn v-if="$vuetify.breakpoint.smAndUp" small tile>
					Редактировать разрешения
				</v-btn>

				<v-btn v-else icon small>
					<v-icon>
						mdi-pencil
					</v-icon>
				</v-btn>
			</span>
		</template>

		<v-card class="user-api-dialog-edit">
			<v-card-title class="common-dialog__title">
				Редактирвать разрешения
			</v-card-title>

			<v-form ref="form" class="common-dialog__content" @submit.prevent="edit">
				<v-card-text class="pt-0">
					<v-checkbox
						v-model="form.trading"
						:ripple="false"
						label="Торговля"
						hide-details
						dense
					/>
					<v-checkbox
						v-model="form.withdraw"
						label="Вывод средств"
						:ripple="false"
						hide-details
						dense
					/>
				</v-card-text>

				<v-divider />

				<v-card-actions class="common-dialog__actions">
					<v-spacer />

					<v-btn small tile text plain @click="close">
						Закрыть
					</v-btn>

					<v-spacer />

					<v-btn
						:loading="loading"
						type="submit"
						color="primary"
						small
						tile
						text
						plain
					>
						Редактировать
					</v-btn>

					<v-spacer />
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
import CommonDialog from '../../../../../common/CommonDialog';

import loadingMixin from '../../../../../../mixins/common/loadingMixin';

export default {
	name: 'UserApiDialogEdit',

	components: { CommonDialog },

	mixins: [loadingMixin],

	props: {
		apiItem: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			dialog: false,
			form: {
				trading: false,
				withdraw: false,
			},
		};
	},

	computed: {
		isNoChanges() {
			const isTradingNoChange =
				this.beforeEditTradingValue === this.form.trading;
			const isWithdrawNoChange =
				this.beforeEditWithdrawValue === this.form.withdraw;

			return isTradingNoChange && isWithdrawNoChange;
		},

		enabledAbilities() {
			const result = [];

			if (this.form.trading) result.push('trading');
			if (this.form.withdraw) result.push('withdraw');

			return result;
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
			} catch (e) {
				console.error(e);
			} finally {
				this.stopLoading();
			}
		},

		close() {
			this.dialog = false;
		},
	},

	mounted() {
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
